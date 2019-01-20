/**
 * Copyright 2019 Plus Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const cluster = require('cluster');
const webpush = require('web-push');
const { GrovePi } = require('node-grovepi');
const moment = require("moment-timezone");

const samplingInterval = 10;    // unit: ms
const detectionDuration = 1000; // unit: ms
const detectionPercent = 10;    // unit: %
const maxHistoryLength = detectionDuration / samplingInterval;
const detectionCount = maxHistoryLength * detectionPercent / 100;

class SensorObserver {
  constructor(LoudnessAnalogSensor, notify, sendThreshold) {
    this.sensor = new LoudnessAnalogSensor(0, samplingInterval);
    this.notify = notify;
    this.notifying = false;
    this.sendThreshold = sendThreshold;
  }

  start() {
    this.sensor.start();
    setTimeout(() => {
      const { avg, max } = this.sensor.readAvgMax();
      this.sensor.stop();

      this.threshold = avg * 1.2;
      console.log(`avg = ${avg}, max = ${max}, init threshold = ${this.threshold}`);
      this.sendThreshold({
        avg: avg,
        max: max,
        threshold: this.threshold
      })

      const loudnessHistory = [];
      this.sensor.stream(samplingInterval, loudness => {
        loudnessHistory.push(loudness);
        
        if (loudnessHistory.length <= maxHistoryLength) {
          return;
        }
        
        loudnessHistory.shift();
        
        if (this.notifying) {
          return;
        }

        const count = loudnessHistory.reduce((acc, current) => acc + (current > this.threshold ? 1 : 0), 0);
        if (count <= detectionCount) {
          return;
        }

        console.log(`call detected: count = ${count}`);
        this.notifying = true;
        this.notify();
        setTimeout(() => {
          this.notifying = false;
        }, 5000);
      });
    }, 5000);
  }

  stop() {
    this.sensor.stopStream();
  }
}

if (cluster.isMaster) {
  const worker = cluster.fork()
  process.on('SIGINT', () => {
    worker.kill('SIGINT');
    setTimeout(() => {
      console.log('main stopped');
      process.exit();
    }, 100);
  });
  serveHttp(worker);
} else {
  startSensor();
}

function now() {
  return moment().tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
}

function serveHttp(sensorWorker) {
  const express = require('express');
  const bodyParser = require('body-parser');
  const fs = require('fs');
  const https = require('https');

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('static'));

  const vapidKeys = webpush.generateVAPIDKeys();
  sensorWorker.send({
    type: 'keys',
    vapidKeys: vapidKeys
  });

  app.get('/key', (req, res) => {
    res.json({
      publicKey: vapidKeys.publicKey
    });
  });

  app.post('/subscribe', (req, res) => {
    console.log(`${now()} subscribe endpoint = ${req.body.endpoint}`);
    sensorWorker.send({
      type: 'subscription',
      endpoint: req.body.endpoint,
      key: req.body.key,
      auth: req.body.auth
    });
    res.json({
      message: 'OK'
    });
  });

  app.post('/unsubscribe', (req, res) => {
    console.log(`${now()} unsubscribe endpoint = ${req.body.endpoint}`);
    sensorWorker.send({
      type: 'unsubscription',
      endpoint: req.body.endpoint,
      key: req.body.key,
      auth: req.body.auth
    });
    res.json({
      message: 'OK'
    });
  });

  let thresholdInfo = null;
  
  app.get('/threshold', (req, res) => {
    if (thresholdInfo == null) {
      const thresholdTimer = setInterval(() => {
        if (thresholdInfo != null) {
          clearInterval(thresholdTimer);
          res.json(thresholdInfo);
        }
      }, 500);
    } else {
      res.json(thresholdInfo);
    }
  });
  
  app.put('/threshold', (req, res) => {
    if (thresholdInfo != null) {
      console.log(`${now()} changed threshold to ${req.body.threshold}`);
      thresholdInfo.threshold = req.body.threshold;
      sensorWorker.send({
        type: 'threshold',
        threshold: thresholdInfo.threshold
      });
    }
    res.json({
      message: 'OK'
    });
  });

  sensorWorker.on('message', message => {
    thresholdInfo = message;
  });

  const port = '3000';
  const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
  };
  https.createServer(options, app).listen(port, () => {
    console.log(`now listening on port ${port}`)
  });
}

function startSensor() {
  const subscribers = [];

  function notify() {
    subscribers.forEach(subscriber => {
      webpush.sendNotification(subscriber, JSON.stringify({
        message: 'visitor now'
      }));
    });
  }
  function sendThreshold(thresholdInfo) {
    process.send(thresholdInfo);
  }

  const sensor = new SensorObserver(GrovePi.sensors.LoudnessAnalog, notify, sendThreshold);
  
  process.on('message', message => {
    switch (message.type) {
      case 'keys':
        webpush.setVapidDetails(
          'mailto:info@example.com',
          message.vapidKeys.publicKey,
          message.vapidKeys.privateKey
        );
        break;
      case 'subscription':
        const existingSubscriber = subscribers.find(subscriber =>
          subscriber.endpoint === message.endpoint &&
          subscriber.keys.p256dh === message.key &&
          subscriber.keys.auth === message.auth
        );
        if (!existingSubscriber) {
          console.log('new subscriber');
          subscribers.push({
            endpoint: message.endpoint,
            keys: {
              p256dh: message.key,
              auth: message.auth
            }
          });
        }
        break;
      case 'unsubscription':
        const subscriberIndex = subscribers.findIndex(subscriber =>
          subscriber.endpoint === message.endpoint &&
          subscriber.keys.p256dh === message.key &&
          subscriber.keys.auth === message.auth
        );
        if (subscriberIndex >= 0) {
          subscribers.splice(subscriberIndex, 1);
        }
        break;
      case 'threshold':
        sensor.threshold = message.threshold;
        break;
    }
  });
  
  const Board = GrovePi.board;

  const board = new Board({
    debug: true,
    onError: err => {
      console.log('error on board initialization');
      console.log(err);
    },
    onInit: res => {
      if (res) {
        console.log(`GrovePi Version :: ${board.version()}`);

        sensor.start();

        process.on('SIGINT', () => {
          sensor.stop();
          board.close();
          console.log('worker stopped');
          process.exit();
        });
      } else {
        process.on('SIGINT', () => {
          board.close();
          console.log('worker stopped');
          process.exit();
        });
      }
    }
  });
  board.init();
}

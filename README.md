intercom_notifier
======================
ラズパイでWebサーバ立てて、GrovePi+でつながった音センサーで、インターホンが鳴ったのを検知して、ブラウザに通知するやつ。

Web App that notifies browser of calls of intercom.

English follows Japanese.

## Table of Contents

- [前提条件](#前提条件)
- [インストール](#インストール)
- [使い方](#使い方)
- [著作権](#著作権)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Copyright](#copyright)

## 前提条件

1. ラズパイ、GrovePi+、音センサーをお手元に用意してね。
2. ラズパイとGrovePi+をつなげて、GrovePi+のセットアップをしといてね。
3. 音センサーをGrovePi+のA0ポートにつないでね。
4. httpsでのアクセスが必要だから、オレオレでもいいから証明書を用意しといてね。

## インストール

GrovePi+のセットアップは、ここを読んでやってね。  
https://www.dexterindustries.com/GrovePi/get-started-with-the-grovepi/

ここを参考にして、最新のNode.jsとnpmをインストールしてね。  
https://github.com/nodesource/distributions/blob/master/README.md

    $ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

まずリポジトリをクローンするよ。

    $ git clone https://github.com/reizouko/intercom_notifier.git

そしたら、このコマンドでライブラリをインストールしてね。

    $ cd intercom_notifier
    $ npm install

前提条件で「証明書を用意」って言ったけど、オレオレ証明書を作るなら、例えばここが参考になるよ。  
https://sterfield.co.jp/programmer/%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83%E3%81%AE%E8%87%AA%E5%B7%B1%E8%A8%BC%E6%98%8E%E6%9B%B8%E3%82%92%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AB%E4%BF%A1%E9%A0%BC%E3%81%95%E3%81%9B%E3%82%8B/

## 使い方

app.jsを実行すればOKだよ。

    $ node app.js

ブラウザからラズパイで実行中のWebサーバにアクセスしてね。  
https://(ラズパイのホスト名またはIP):3000/  
Service Workerを使っているから、httpsでのアクセスじゃないとだめだよ。

「通知を受け取る」ボタンを押すと、ブラウザが起動している間インターホンが鳴った時の通知を受け取れるようになるよ。やめるときは「通知を受け取るのをやめる」ボタンを押してね。

スライダーが表示されると思うけど、これで音レベルのしきい値を調節するんだよ。  
実際にインターホンの近くに音センサーを置いてインターホンを鳴らして、インターホンが鳴った時に通知されるちょうどいい音レベルを探してね。  
あまり低いと、静かな時にもちょっとしたノイズで通知されるようになっちゃうから気を付けてね。

## 著作権

LICENSEファイルを見てね。

Copyright 2019 Plus Project

## Prerequisites

1. Prepare Raspberry Pi, GrovePi+ and sound sensor for Grove.
2. Set up GrovePi+ and connect it with Raspberry Pi.
3. Connect sound sensor to A0 port of GrovePi+.
4. Prepare an SSL certificate because https connection required. Self-signed certificate is OK as well.

## Installation

Set up GrovePi+ referring to:  
https://www.dexterindustries.com/GrovePi/get-started-with-the-grovepi/

Install latest Node.js and npm to your Raspberry Pi referring to:  
https://github.com/nodesource/distributions/blob/master/README.md

    $ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

Clone repository:

    $ git clone https://github.com/reizouko/intercom_notifier.git

Install libraries:

    $ cd intercom_notifier
    $ npm install

If you should make an Self-signed certificate, refer to:
https://sterfield.co.jp/programmer/%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83%E3%81%AE%E8%87%AA%E5%B7%B1%E8%A8%BC%E6%98%8E%E6%9B%B8%E3%82%92%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AB%E4%BF%A1%E9%A0%BC%E3%81%95%E3%81%9B%E3%82%8B/

## Usage

Run app.js.

    $ node app.js

Access to https://(Raspberry Pi's hostname or IP):3000/ from your browser.  
https required because it uses Service Worker.

Click "通知を受け取る" button to receive notification while you open your browser when your intercom calls. Click "通知を受け取るのをやめる" button to stop notification.

Adjust sound level threshold with the slider in the page.  
Put your sound sensor near the intercom and ring the doorbell actually to find appropriate level.  
If you set threshold too low, it may notify you for some noise even when intercom doesn't call.

## Copyright

See ./LICENSE

Copyright 2019 Plus Project

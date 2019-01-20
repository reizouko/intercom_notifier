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

self.addEventListener("push", event => {
  event.waitUntil(self.registration.showNotification(
    "来客なう",
    {
      body: "誰か来たみたいだよ",
      icon: "https://s3-ap-northeast-1.amazonaws.com/static.reizouko.online/icons/reizouko.png"
    }
  ));
}, false);

self.addEventListener("notificationclick", event => {
  event.notification.close();
}, false);

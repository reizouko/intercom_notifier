intercom_notifier
======================
ラズパイでWebサーバ立てて、GrovePi+でつながった音センサーで、インターホンが鳴ったのを検知して、ブラウザに通知するやつ。

Web App that notifies browser of intercom's call.

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
4. httpsでのアクセスが必要だから。オレオレでもいいから証明書を用意しといてね。

## インストール

ここを参考にして、最新のNode.jsとnpmをインストールしてね。  
https://github.com/nodesource/distributions/blob/master/README.md

    $ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

まずリポジトリをクローンするよ。

    $ git clone https://github.com/reizouko/intercom_notifier.git

そしたら、このコマンドでライブラリをインストールしてね。

    $ cd intercom_notifier
    $ npm install

## 使い方

書き途中…

# ジューンさんのエディット画面系のテスト環境

## DB 作成手順

DB のスキーマは`db/schema`以下にあるのでこれを基に DB を作成する  
DB の初期化は以下のコマンドを用いて行う

```shell
$ php db/init_db.php
```

正常に初期化が終了した場合`db/photo_share.sqlite3`が作成されているはず

## 写真の一括リサイズ方法

以下のコマンドを実行することで `images/` ディレクトリ内に `写真名__small.png` という縮小された写真データが一括生成される

**コマンドの実行には [imagemagick](https://www.imagemagick.org/script/index.php) のインストールが必要**

```
$ ./_tool/resize_photos.bash
```

写真のアップロードをしたら自動でサイズの縮小が行われるので基本は行わなくて良い

# ジューンさんのエディット画面系のテスト環境

## DB 作成手順

DB のスキーマは`db/schema`以下にあるのでこれを基に DB を作成する  
DB の初期化は以下のコマンドを用いて行う

```shell
$ php db/init_db.php
```

正常に初期化が終了した場合`db/photo_share.sqlite3`が作成されているはず

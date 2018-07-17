PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `photo_tag_relation` (
        `id`       INTEGER PRIMARY KEY AUTOINCREMENT,
        `photo_id` INTEGER NOT NULL,
        `tag_id`   INTEGER NOT NULL
);
INSERT INTO photo_tag_relation VALUES(1,1,1);
COMMIT;

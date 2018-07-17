PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `user` (
        `id`       INTEGER PRIMARY KEY AUTOINCREMENT,
        `name`     TEXT,
        `password` INTEGER
);
INSERT INTO user VALUES(1,'guest','');
COMMIT;

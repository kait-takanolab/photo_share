PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `filter_preset` (
        `id`                INTEGER PRIMARY KEY AUTOINCREMENT,
        `name`              TEXT NOT NULL,
        `gaussian_filter`   INTEGER,
        `contrast _filter`  INTEGER,
        `grayscale_filter`  INTEGER,
        `sepia_filter`      INTEGER,
        `invert_filter`     INTEGER,
        `hue_rotate_filter` INTEGER,
        `lightness_filter`  INTEGER,
        `saturation_filter` INTEGER
);
INSERT INTO filter_preset VALUES(1,'sepia',NULL,NULL,NULL,100,NULL,NULL,NULL,NULL);
COMMIT;

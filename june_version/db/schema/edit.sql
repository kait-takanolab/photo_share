PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `edit` (
        `id`                INTEGER PRIMARY KEY AUTOINCREMENT,
        `name`              TEXT NOT NULL,
        `crop_size`         TEXT,
        `edit_duration`     INTEGER,
        `gaussian_filter`   INTEGER,
        `contrast _filter`  INTEGER,
        `grayscale_filter`  INTEGER,
        `sepia_filter`      INTEGER,
        `invert_filter`     INTEGER,
        `hue_rotate_filter` INTEGER,
        `lightness_filter`  INTEGER,
        `saturation_filter` INTEGER,
        `photo_id`          INTEGER NOT NULL
);
INSERT INTO edit VALUES(1,'grayscale_cat',NULL,NULL,NULL,NULL,100,NULL,NULL,NULL,NULL,NULL,1);
COMMIT;

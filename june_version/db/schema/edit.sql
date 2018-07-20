PRAGMA foreign_keys = OFF;BEGIN TRANSACTION;CREATE TABLE IF NOT EXISTS `edit` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `crop_size` TEXT,
  `edit_duration` INTEGER,
  `gaussian_filter` INTEGER,
  `contrast_filter` INTEGER,
  `grayscale_filter` INTEGER,
  `sepia_filter` INTEGER,
  `invert_filter` INTEGER,
  `hue_rotate_filter` INTEGER,
  `lightness_filter` INTEGER,
  `saturation_filter` INTEGER,
  `photo_id` INTEGER,
  `edit_id` INTEGER
);
INSERT INTO
  edit
VALUES(
    1,
    'grayscale_cat.png',
    '640,360',
    0,
    0,
    0,
    100,
    0,
    0,
    0,
    100,
    100,
    1,
    NULL
  );COMMIT;

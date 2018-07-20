PRAGMA foreign_keys = OFF;BEGIN TRANSACTION;CREATE TABLE IF NOT EXISTS `photo` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `camera_angle` TEXT,
  `camera_position` TEXT,
  `take_duration` INTEGER,
  `gyro_alpha` INTEGER,
  `gyro_beta` INTEGER,
  `gyro_gamma` INTEGER,
  `size` TEXT,
  `user_id` INTEGER NOT NULL
);
INSERT INTO
  photo
VALUES(
    1,
    'cat_sample.jpg',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    1
  );COMMIT;

-- Desactivar las restricciones de clave foránea temporalmente
SET
  foreign_key_checks = 0;

-- Eliminar las tablas en cascada
DROP TABLE IF EXISTS `session_token`;

DROP TABLE IF EXISTS `user_roles`;

DROP TABLE IF EXISTS `roles`;

DROP TABLE IF EXISTS `users`;

-- Restablecer las restricciones de clave foránea
SET
  foreign_key_checks = 1;

DROP TABLE IF EXISTS `users`;

CREATE TABLE
  `users` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `names` varchar(100) NOT NULL,
    `lastNames` varchar(100) NOT NULL,
    `user_name` varchar(50) CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
      `email` varchar(100) NOT NULL,
      `password` varchar(255) NOT NULL,
      PRIMARY KEY (`user_id`)
  );

DROP TABLE IF EXISTS `roles`;

CREATE TABLE
  `roles` (
    `role_id` int NOT NULL AUTO_INCREMENT,
    `role_name` varchar(50) NOT NULL,
    PRIMARY KEY (`role_id`)
  );

LOCK TABLES `roles` WRITE;

INSERT INTO
  `roles`
VALUES
  (1, 'user');

INSERT INTO
  `roles`
VALUES
  (2, 'moderator');

INSERT INTO
  `roles`
VALUES
  (3, 'admin');

UNLOCK TABLES;

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE
  `user_roles` (
    `user_id` int NOT NULL,
    `role_id` int NOT NULL,
    `status` bigint DEFAULT '1',
    PRIMARY KEY (`user_id`, `role_id`),
    KEY `role_id` (`role_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `session_token`;

CREATE TABLE
  `session_token` (
    `user_id` int AUTO_INCREMENT NOT NULL,
    `session_token` varchar(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
  );
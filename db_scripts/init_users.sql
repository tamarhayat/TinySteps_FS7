create Database users_TinySteps;
use users_TinySteps;

CREATE TABLE users (
    id CHAR(9) PRIMARY KEY, 
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(64) NOT NULL,
    role ENUM('parent', 'nurse') NOT NULL
);

CREATE USER 'esther' IDENTIFIED BY 'esther123';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP
ON users_TinySteps.*
TO 'esther'@'%';





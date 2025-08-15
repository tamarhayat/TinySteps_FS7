select * from users_tinysteps.users;


ALTER TABLE users_tinysteps.users 
ADD email VARCHAR(255) AFTER last_name;
UPDATE users_tinysteps.users
SET email = CONCAT(id, '@example.com')
WHERE email IS NULL;
ALTER TABLE users_tinysteps.users 
MODIFY email VARCHAR(255) UNIQUE NOT NULL;

use users_tinysteps;
CREATE TABLE user_auth (
    id CHAR(9) PRIMARY KEY,
    password VARCHAR(64) NOT NULL
);



CREATE TABLE TinySteps.users (
    id CHAR(9) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('parent', 'nurse') NOT NULL
);


INSERT INTO users_TinySteps.user_auth (id, password)
SELECT id, password FROM users_TinySteps.users;

INSERT INTO TinySteps.users (id, first_name, last_name, email, role)
SELECT id, first_name, last_name, email, role FROM users_TinySteps.users;


ALTER TABLE TinySteps.children
DROP FOREIGN KEY children_ibfk_1,
ADD CONSTRAINT fk_children_parent
    FOREIGN KEY (parent_id) REFERENCES TinySteps.users(id)
    ON DELETE CASCADE;

ALTER TABLE TinySteps.files
DROP FOREIGN KEY files_ibfk_2,
ADD CONSTRAINT fk_files_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES TinySteps.users(id)
    ON DELETE SET NULL;

ALTER TABLE TinySteps.appointments
DROP FOREIGN KEY appointments_ibfk_1,
ADD CONSTRAINT fk_appointments_nurse
    FOREIGN KEY (nurse_id) REFERENCES TinySteps.users(id)
    ON DELETE CASCADE;

DROP TABLE users_tinysteps.users;
create database TinySteps;
use TinySteps;

CREATE TABLE children (
    id CHAR(9) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    parent_id CHAR(9) NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES users_TinySteps.users(id)
        ON DELETE CASCADE
);


CREATE TABLE measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id CHAR(9) NOT NULL,
    date DATE NOT NULL,
    weight_kg DECIMAL(4,2),
    height_cm DECIMAL(5,2),
    FOREIGN KEY (child_id) REFERENCES children(id)
        ON DELETE CASCADE
);

CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id CHAR(9) NOT NULL,
    uploaded_by CHAR(9),
    file_path VARCHAR(255) NOT NULL,
    description TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id)
        ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users_TinySteps.users(id)
        ON DELETE SET NULL
);


CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nurse_id CHAR(9) NOT NULL,
    child_id CHAR(9),  
    appointment_time DATETIME NOT NULL,
    status ENUM('available', 'booked', 'completed', 'canceled') DEFAULT 'available',
    FOREIGN KEY (nurse_id) REFERENCES users_TinySteps.users(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE SET NULL
);

CREATE USER 'malka' IDENTIFIED BY 'malka123';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP
ON TinySteps.*
TO 'malka'@'%';

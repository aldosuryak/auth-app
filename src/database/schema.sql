CREATE DATABASE IF NOT EXISTS auth_app;
USE auth_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_email (email),
  INDEX idx_username (username)
);

CREATE TABLE login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  email VARCHAR(100),
  attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN DEFAULT FALSE,
  INDEX idx_ip_time (ip_address, attempt_time)
);

-- Insert demo user (password: password123)
INSERT INTO users (username, email, password_hash) VALUES 
('johndoe', 'johndoe@mail.com', '$2y$10$lWSWWrTT4V21u3au0wvzkOLb20WS2YjO7QRdTfaLORHmxinCL3Eri');

-- Clean old login attempts (run periodically)
DELETE FROM login_attempts WHERE attempt_time < DATE_SUB(NOW(), INTERVAL 1 MINUTE);
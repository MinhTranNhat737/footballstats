-- Script để kiểm tra và sửa cấu trúc bảng users nếu cần
-- Chạy trong phpMyAdmin hoặc MySQL client

-- 1. Kiểm tra cấu trúc bảng users hiện tại
DESCRIBE users;

-- 2. Nếu thiếu cột created_at, thêm vào (optional)
-- ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. Nếu thiếu cột updated_at, thêm vào (optional)  
-- ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 4. Nếu thiếu cột last_login, thêm vào (optional)
-- ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL;

-- 5. Kiểm tra dữ liệu users
SELECT u.user_id, u.username, u.email, u.is_active,
       GROUP_CONCAT(r.role_name SEPARATOR ', ') as roles
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
GROUP BY u.user_id;

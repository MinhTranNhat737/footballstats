const db = require('../db');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Tìm user theo username
     */
    static findByUsername(username, callback) {
        const query = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
        db.query(query, [username], callback);
    }

    /**
     * Tìm user theo email
     */
    static findByEmail(email, callback) {
        const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
        db.query(query, [email], callback);
    }

    /**
     * Tìm user theo ID
     */
    static findById(userId, callback) {
        const query = 'SELECT * FROM users WHERE user_id = ? AND is_active = TRUE';
        db.query(query, [userId], callback);
    }

    /**
     * Lấy user với roles
     */
    static findByIdWithRoles(userId, callback) {
        const query = `
            SELECT u.user_id, u.username, u.email, u.is_active,
                   GROUP_CONCAT(r.role_name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.role_id
            WHERE u.user_id = ? AND u.is_active = TRUE
            GROUP BY u.user_id
        `;
        db.query(query, [userId], callback);
    }

    /**
     * Tạo user mới
     */
    static create(userData, callback) {
        bcrypt.hash(userData.password, 10, (err, hash) => {
            if (err) return callback(err);

            const query = 'INSERT INTO users (username, email, password_hash, is_active) VALUES (?, ?, ?, TRUE)';
            const values = [userData.username, userData.email, hash];
            
            db.query(query, values, callback);
        });
    }

    /**
     * Xác thực mật khẩu
     */
    static verifyPassword(plainPassword, hashedPassword, callback) {
        bcrypt.compare(plainPassword, hashedPassword, callback);
    }

    /**
     * Gán role cho user
     */
    static assignRole(userId, roleName, callback) {
        const query = `
            INSERT INTO user_roles (user_id, role_id)
            SELECT ?, role_id FROM roles WHERE role_name = ? OR role_code = ?
        `;
        db.query(query, [userId, roleName, roleName], callback);
    }

    /**
     * Kiểm tra user có role cụ thể không
     */
    static hasRole(userId, roleName, callback) {
        const query = `
            SELECT COUNT(*) as count
            FROM user_roles ur
            JOIN roles r ON ur.role_id = r.role_id
            WHERE ur.user_id = ? AND (r.role_name = ? OR r.role_code = ?)
        `;
        db.query(query, [userId, roleName, roleName], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].count > 0);
        });
    }

    /**
     * Cập nhật last login - disabled vì không có cột last_login trong DB
     */
    static updateLastLogin(userId, callback) {
        // Skip update - column doesn't exist
        if (callback) callback(null, { affectedRows: 0 });
    }

    /**
     * Lấy tất cả users (admin only)
     */
    static getAll(callback) {
        const query = `
            SELECT u.user_id, u.username, u.email, u.is_active,
                   GROUP_CONCAT(r.role_name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.role_id
            GROUP BY u.user_id
            ORDER BY u.user_id DESC
        `;
        db.query(query, callback);
    }

    /**
     * Vô hiệu hóa user (soft delete)
     */
    static deactivate(userId, callback) {
        const query = 'UPDATE users SET is_active = FALSE WHERE user_id = ?';
        db.query(query, [userId], callback);
    }

    /**
     * Kích hoạt user
     */
    static activate(userId, callback) {
        const query = 'UPDATE users SET is_active = TRUE WHERE user_id = ?';
        db.query(query, [userId], callback);
    }
}

module.exports = User;

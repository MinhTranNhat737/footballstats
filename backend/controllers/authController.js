const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * Đăng ký user mới
 */
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin (username, email, password)'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự'
        });
    }

    // Kiểm tra username đã tồn tại
    User.findByUsername(username, (err, users) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống'
            });
        }

        if (users.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username đã tồn tại'
            });
        }

        // Kiểm tra email đã tồn tại
        User.findByEmail(email, (err, users) => {
            if (err) {
                console.error('Error checking email:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi hệ thống'
                });
            }

            if (users.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại'
                });
            }

            // Tạo user mới
            User.create({ username, email, password }, (err, result) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Lỗi khi tạo tài khoản'
                    });
                }

                const userId = result.insertId;

                // Gán role USER mặc định
                User.assignRole(userId, 'USER', (err) => {
                    if (err) {
                        console.error('Error assigning role:', err);
                    }

                    res.status(201).json({
                        success: true,
                        message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay.',
                        data: {
                            userId: userId,
                            username: username,
                            email: email
                        }
                    });
                });
            });
        });
    });
};

/**
 * Đăng nhập
 */
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập username và password'
        });
    }

    // Tìm user theo username
    User.findByUsername(username, (err, users) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống'
            });
        }

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Username hoặc password không đúng'
            });
        }

        const user = users[0];

        // Verify password
        User.verifyPassword(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.error('Error verifying password:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi hệ thống'
                });
            }

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Username hoặc password không đúng'
                });
            }

            // Lấy roles của user
            User.findByIdWithRoles(user.user_id, (err, userWithRoles) => {
                if (err) {
                    console.error('Error getting user roles:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Lỗi hệ thống'
                    });
                }

                const userData = userWithRoles[0];
                const roles = userData.roles ? userData.roles.split(',') : [];

                // Cập nhật last login
                User.updateLastLogin(user.user_id, (err) => {
                    if (err) console.error('Error updating last login:', err);
                });

                // Tạo JWT token
                const token = generateToken(user, roles);

                res.json({
                    success: true,
                    message: 'Đăng nhập thành công',
                    data: {
                        token: token,
                        user: {
                            userId: user.user_id,
                            username: user.username,
                            email: user.email,
                            roles: roles,
                            isAdmin: roles.includes('ADMIN') || roles.includes('Quản trị')
                        }
                    }
                });
            });
        });
    });
};

/**
 * Lấy thông tin user hiện tại
 */
exports.getCurrentUser = (req, res) => {
    const userId = req.user.userId;

    User.findByIdWithRoles(userId, (err, users) => {
        if (err) {
            console.error('Error getting current user:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống'
            });
        }

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }

        const user = users[0];
        const roles = user.roles ? user.roles.split(',') : [];

        res.json({
            success: true,
            data: {
                userId: user.user_id,
                username: user.username,
                email: user.email,
                roles: roles,
                isAdmin: roles.includes('ADMIN') || roles.includes('Quản trị')
            }
        });
    });
};

/**
 * Đăng xuất (client-side sẽ xóa token)
 */
exports.logout = (req, res) => {
    res.json({
        success: true,
        message: 'Đăng xuất thành công'
    });
};

/**
 * Lấy danh sách tất cả users (ADMIN only)
 */
exports.getAllUsers = (req, res) => {
    User.getAll((err, users) => {
        if (err) {
            console.error('Error getting all users:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống'
            });
        }

        // Format roles
        const formattedUsers = users.map(user => ({
            ...user,
            roles: user.roles ? user.roles.split(',') : []
        }));

        res.json({
            success: true,
            data: formattedUsers
        });
    });
};

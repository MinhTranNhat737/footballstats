const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key cho JWT - NÊN LƯU TRONG .ENV FILE
const JWT_SECRET = process.env.JWT_SECRET || 'football-app-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

/**
 * Middleware xác thực - yêu cầu user đã đăng nhập
 */
const requireAuth = (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực. Vui lòng đăng nhập.'
            });
        }

        const token = authHeader.substring(7); // Bỏ "Bearer "

        // Verify token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.'
                });
            }

            // Lưu thông tin user vào request
            req.user = {
                userId: decoded.userId,
                username: decoded.username,
                roles: decoded.roles || []
            };

            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực'
        });
    }
};

/**
 * Middleware kiểm tra quyền ADMIN
 */
const requireAdmin = (req, res, next) => {
    // Chạy requireAuth trước
    requireAuth(req, res, (err) => {
        if (err) return;

        // Kiểm tra role từ token - hỗ trợ cả ADMIN và Quản trị
        if (!req.user || !req.user.roles || 
            !(req.user.roles.includes('ADMIN') || req.user.roles.includes('Quản trị'))) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập. Chỉ ADMIN mới có thể thực hiện thao tác này.'
            });
        }

        // Double check với database để đảm bảo
        User.hasRole(req.user.userId, 'ADMIN', (err, hasRole) => {
            if (err) {
                console.error('Error checking admin role:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi kiểm tra quyền'
                });
            }

            if (!hasRole) {
                return res.status(403).json({
                    success: false,
                    message: 'Không có quyền ADMIN. Quyền đã bị thu hồi.'
                });
            }

            next();
        });
    });
};

/**
 * Tạo JWT token
 */
const generateToken = (user, roles) => {
    return jwt.sign(
        {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            roles: roles
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

/**
 * Middleware kiểm tra có phải USER thường không (optional - để phân biệt UI)
 */
const isRegularUser = (req, res, next) => {
    requireAuth(req, res, (err) => {
        if (err) return;
        
        req.isAdmin = req.user.roles && req.user.roles.includes('ADMIN');
        next();
    });
};

module.exports = {
    requireAuth,
    requireAdmin,
    generateToken,
    isRegularUser,
    JWT_SECRET
};

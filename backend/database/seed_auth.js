const bcrypt = require('bcryptjs');
const db = require('../db');

/**
 * Script để seed dữ liệu mặc định cho auth system
 * Chạy: node database/seed_auth.js
 */

async function seedAuthData() {
    console.log('🌱 Bắt đầu seed dữ liệu auth...\n');

    try {
        // 1. Kiểm tra và insert roles nếu chưa có
        console.log('📋 Checking roles...');
        const [roles] = await db.promise().query('SELECT * FROM roles');
        
        if (roles.length === 0) {
            console.log('   ➕ Inserting default roles...');
            await db.promise().query(`
                INSERT INTO roles (role_name, description) VALUES 
                ('USER', 'Người dùng thường - chỉ xem dữ liệu'),
                ('ADMIN', 'Quản trị viên - toàn quyền CRUD')
            `);
            console.log('   ✅ Roles created: USER, ADMIN\n');
        } else {
            console.log(`   ✅ Roles already exist (${roles.length} roles)\n`);
        }

        // 2. Tạo admin account nếu chưa có
        console.log('👤 Checking admin account...');
        const [adminExists] = await db.promise().query(
            'SELECT * FROM users WHERE username = ?',
            ['admin']
        );

        if (adminExists.length === 0) {
            console.log('   ➕ Creating admin account...');
            const adminPasswordHash = await bcrypt.hash('admin123', 10);
            
            const [adminResult] = await db.promise().query(
                'INSERT INTO users (username, email, password_hash, is_active) VALUES (?, ?, ?, TRUE)',
                ['admin', 'admin@football.com', adminPasswordHash]
            );

            const adminId = adminResult.insertId;

            // Gán role ADMIN
            const [adminRole] = await db.promise().query(
                'SELECT role_id FROM roles WHERE role_name = ?',
                ['ADMIN']
            );

            await db.promise().query(
                'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
                [adminId, adminRole[0].role_id]
            );

            console.log('   ✅ Admin account created');
            console.log('      Username: admin');
            console.log('      Password: admin123');
            console.log('      Email: admin@football.com\n');
        } else {
            console.log('   ⚠️  Admin account already exists');
            console.log('   🔄 Updating admin password to admin123...');
            
            // Cập nhật password cho admin
            const adminPasswordHash = await bcrypt.hash('admin123', 10);
            await db.promise().query(
                'UPDATE users SET password_hash = ? WHERE username = ?',
                [adminPasswordHash, 'admin']
            );
            console.log('   ✅ Admin password updated\n');
        }

        // 3. Tạo user account thường nếu chưa có
        console.log('👤 Checking regular user account...');
        const [userExists] = await db.promise().query(
            'SELECT * FROM users WHERE username = ?',
            ['user']
        );

        if (userExists.length === 0) {
            console.log('   ➕ Creating regular user account...');
            const userPasswordHash = await bcrypt.hash('user123', 10);
            
            const [userResult] = await db.promise().query(
                'INSERT INTO users (username, email, password_hash, is_active) VALUES (?, ?, ?, TRUE)',
                ['user', 'user@football.com', userPasswordHash]
            );

            const userId = userResult.insertId;

            // Gán role USER
            const [userRole] = await db.promise().query(
                'SELECT role_id FROM roles WHERE role_name = ?',
                ['USER']
            );

            if (userRole && userRole.length > 0) {
                await db.promise().query(
                    'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
                    [userId, userRole[0].role_id]
                );
            }

            console.log('   ✅ Regular user account created');
            console.log('      Username: user');
            console.log('      Password: user123');
            console.log('      Email: user@football.com\n');
        } else {
            console.log('   ⚠️  Regular user already exists');
            console.log('   🔄 Updating user password to user123...');
            
            // Cập nhật password cho user
            const userPasswordHash = await bcrypt.hash('user123', 10);
            await db.promise().query(
                'UPDATE users SET password_hash = ? WHERE username = ?',
                [userPasswordHash, 'user']
            );
            console.log('   ✅ User password updated\n');
        }

        // 4. Hiển thị tất cả users
        console.log('📊 Current users in database:');
        const [allUsers] = await db.promise().query(`
            SELECT u.user_id, u.username, u.email, u.is_active,
                   GROUP_CONCAT(r.role_name SEPARATOR ', ') as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.role_id
            GROUP BY u.user_id
            ORDER BY u.user_id
        `);

        console.table(allUsers);

        console.log('\n✨ Seed completed successfully!');
        console.log('\n📝 You can now login with:');
        console.log('   Admin: username=admin, password=admin123');
        console.log('   User:  username=user, password=user123');
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

// Run seed
seedAuthData();

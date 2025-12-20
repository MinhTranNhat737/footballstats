const db = require('../db');

async function fixUserRoles() {
    console.log('🔧 Fixing user roles...\n');

    try {
        // 1. Lấy role IDs
        const [roles] = await db.promise().query('SELECT * FROM roles');
        console.log('📋 Available roles:', roles);

        const adminRoleId = roles.find(r => r.role_name === 'ADMIN' || r.role_name === 'Quản trị')?.role_id;
        const userRoleId = roles.find(r => r.role_name === 'USER' || r.role_name === 'Người dùng')?.role_id;

        console.log(`Admin Role ID: ${adminRoleId}`);
        console.log(`User Role ID: ${userRoleId}\n`);

        // 2. Gán role ADMIN cho user 'admin'
        console.log('Setting role for admin...');
        await db.promise().query(`
            INSERT IGNORE INTO user_roles (user_id, role_id)
            SELECT 1, ?
        `, [adminRoleId]);
        console.log('✅ Admin role set\n');

        // 3. Gán role USER cho user 'user'
        console.log('Setting role for user...');
        await db.promise().query(`
            INSERT IGNORE INTO user_roles (user_id, role_id)
            SELECT 2, ?
        `, [userRoleId]);
        console.log('✅ User role set\n');

        // 4. Xóa user admin1 nếu không cần
        console.log('Cleaning up admin1 account...');
        await db.promise().query('DELETE FROM users WHERE username = ?', ['admin1']);
        console.log('✅ admin1 removed\n');

        // 5. Hiển thị kết quả
        console.log('📊 Final users:');
        const [finalUsers] = await db.promise().query(`
            SELECT u.user_id, u.username, u.email, u.is_active,
                   GROUP_CONCAT(r.role_name SEPARATOR ', ') as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.role_id
            GROUP BY u.user_id
            ORDER BY u.user_id
        `);
        console.table(finalUsers);

        console.log('\n✅ Fix completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixUserRoles();

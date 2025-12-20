const mysql = require('mysql2');

// Tạo kết nối với MySQL (XAMPP)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Username mặc định của XAMPP
    password: '',          // Password mặc định của XAMPP là rỗng
    database: 'pes_players_300_basic'  // Thay đổi tên database của bạn
});

// Kết nối đến database
connection.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối thành công đến MySQL!');
});

module.exports = connection;

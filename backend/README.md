# ⚽ Football Stats - Backend CRUD API

Backend API để quản lý thông tin cầu thủ bóng đá với Node.js, Express, MySQL và upload ảnh.

## 📋 Yêu cầu
- Node.js (v14+)
- MySQL (XAMPP)
- Database: `pes_players_300_basic`
- Bảng: `players`

## 🚀 Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Database
- Mở XAMPP và khởi động MySQL
- Database: `pes_players_300_basic`
- Bảng: `players` (đã có 300+ cầu thủ)
- Cập nhật thông tin kết nối trong `db.js` nếu cần

### 3. Chạy server
```bash
npm start
```

Hoặc với nodemon (development):
```bash
npm run dev
```

Server chạy tại: http://localhost:3000

## 📡 API Endpoints

### Lấy tất cả cầu thủ
```
GET /api/players
```

### Tìm kiếm cầu thủ
```
GET /api/players?search=messi
```

### Lấy cầu thủ theo ID
```
GET /api/players/:id
```

### Thêm cầu thủ mới
```
POST /api/players
Content-Type: application/json

{
  "name": "Tên cầu thủ",
  "position": "ST",
  "age": 25,
  "nationality": "Việt Nam",
  "club": "CLB",
  "overall": 85,
  "pace": 90,
  "shooting": 85,
  "passing": 80,
  "dribbling": 88,
  "defending": 40,
  "physical": 75
}
```

### Cập nhật cầu thủ
```
PUT /api/players/:id
Content-Type: application/json

{
  "name": "Tên mới",
  ...
}
```

### Xóa cầu thủ
```
DELETE /api/players/:id
```

## 📁 Cấu trúc dự án

```
backend crud/
├── models/
│   └── Player.js              # Model với SQL queries
├── controllers/
│   └── playerController.js    # Logic xử lý
├── routes/
│   └── playerRoutes.js        # API routes
├── public/
│   ├── index.html             # Giao diện web
│   └── uploads/               # Thư mục lưu ảnh
├── db.js                      # Kết nối MySQL
├── server.js                  # Server Express + Multer
├── package.json
└── README.md
```

## ✨ Tính năng

- ✅ **CRUD đầy đủ**: Thêm, Sửa, Xóa, Xem cầu thủ
- 🔍 **Tìm kiếm**: Theo tên, vị trí, quốc tịch, câu lạc bộ
- 📸 **Upload ảnh**: Hỗ trợ JPG, PNG, GIF (tối đa 10MB)
- 🎮 **Modal FIFA Card**: Hiển thị thông tin dạng thẻ cầu thủ
- 📊 **Thống kê**: 6 chỉ số với progress bar
- 📱 **Responsive**: Giao diện thân thiện mobile

## 🌐 Truy cập

- 🖥️ **Web Interface**: http://localhost:3000
- 📡 **API Endpoint**: http://localhost:3000/api/players
- 🧪 **Test Connection**: http://localhost:3000/api/test-db

## 📊 Database Schema

Bảng `players` (AUTO_INCREMENT):
- `player_id` INT PK AUTO_INCREMENT
- `name`, `nationality`, `club`
- `position`, `age`
- `overall`, `pace`, `shooting`, `passing`, `dribbling`, `defending`, `physical`
- `photo_url` VARCHAR(255) - Đường dẫn ảnh

## 🔧 Dependencies

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "multer": "^1.4.5-lts.1"
}
```

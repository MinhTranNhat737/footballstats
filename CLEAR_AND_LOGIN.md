# Hướng dẫn fix lỗi JWT malformed

## Vấn đề
- Token đang lưu sai key (`token` thay vì `auth_token`)
- Token có thể bị lỗi format

## Giải pháp

### Bước 1: Xóa localStorage
Mở Console trình duyệt (F12) và chạy:
```javascript
localStorage.clear()
```

Hoặc chỉ xóa token cũ:
```javascript
localStorage.removeItem('token')
localStorage.removeItem('auth_token')
```

### Bước 2: Refresh trang
Nhấn F5 hoặc Ctrl+R

### Bước 3: Đăng nhập lại
1. Vào trang login
2. Đăng nhập với tài khoản của bạn
3. Token mới sẽ được lưu với key `auth_token`

### Bước 4: Test
1. Vào trang Profile
2. Thêm CLB yêu thích
3. Nhấn Lưu
4. Kiểm tra terminal sẽ thấy:
   - `🔑 Verifying token with JWT_SECRET...`
   - `✅ Token verified, userId: X`
   - `✅ Đã thêm CLB thành công!`

## Debug
Nếu vẫn lỗi, kiểm tra token trong Console:
```javascript
console.log('Token:', localStorage.getItem('auth_token'))
```

Token hợp lệ phải có dạng: `xxxxx.yyyyy.zzzzz` (3 phần ngăn cách bởi dấu chấm)

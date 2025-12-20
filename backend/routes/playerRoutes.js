const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { requireAdmin } = require('../middleware/auth');

// Routes công khai (GET) - ai cũng có thể xem
router.get('/', playerController.getAllPlayers);           // Lấy tất cả cầu thủ
router.get('/:id', playerController.getPlayerById);        // Lấy cầu thủ theo ID

// Routes bảo vệ (CUD) - chỉ ADMIN
router.post('/', requireAdmin, playerController.createPlayer);           // Tạo cầu thủ mới
router.put('/:id', requireAdmin, playerController.updatePlayer);         // Cập nhật cầu thủ
router.delete('/:id', requireAdmin, playerController.deletePlayer);      // Xóa cầu thủ

module.exports = router;

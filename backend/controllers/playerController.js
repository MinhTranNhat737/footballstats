const Player = require('../models/Player');

// Lấy tất cả cầu thủ hoặc tìm kiếm
exports.getAllPlayers = (req, res) => {
    const searchTerm = req.query.search;
    
    if (searchTerm) {
        // Tìm kiếm cầu thủ
        Player.search(searchTerm, (err, results) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Lỗi khi tìm kiếm cầu thủ', 
                    error: err.message 
                });
            }
            res.json({ 
                success: true, 
                data: results 
            });
        });
    } else {
        // Lấy tất cả
        Player.getAll((err, results) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Lỗi khi lấy danh sách cầu thủ', 
                    error: err.message 
                });
            }
            res.json({ 
                success: true, 
                data: results 
            });
        });
    }
};

// Lấy thông tin cầu thủ theo ID
exports.getPlayerById = (req, res) => {
    const id = req.params.id;
    
    Player.getById(id, (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi khi lấy thông tin cầu thủ', 
                error: err.message 
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy cầu thủ' 
            });
        }
        
        res.json({ 
            success: true, 
            data: results[0] 
        });
    });
};

// Tạo cầu thủ mới
exports.createPlayer = (req, res) => {
    console.log('=== CREATE PLAYER ===');
    console.log('Body nhận được:', req.body);
    
    const playerData = {
        name: req.body.name,
        position: req.body.position,
        age: req.body.age,
        nationality: req.body.nationality,
        club: req.body.club,
        overall: req.body.overall,
        pace: req.body.pace || 0,
        shooting: req.body.shooting || 0,
        passing: req.body.passing || 0,
        dribbling: req.body.dribbling || 0,
        defending: req.body.defending || 0,
        physical: req.body.physical || 0,
        photo_url: req.body.photo_url || null
    };
    
    console.log('PlayerData chuẩn bị insert:', playerData);

    // Validate dữ liệu
    if (!playerData.name || !playerData.position) {
        return res.status(400).json({ 
            success: false, 
            message: 'Tên và vị trí cầu thủ là bắt buộc' 
        });
    }

    Player.create(playerData, (err, results) => {
        if (err) {
            console.error('❌ Lỗi SQL khi tạo cầu thủ:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi khi tạo cầu thủ mới', 
                error: err.message 
            });
        }
        
        console.log('✅ Tạo cầu thủ thành công, insertId:', results.insertId);
        res.status(201).json({ 
            success: true, 
            message: 'Tạo cầu thủ thành công', 
            data: { id: results.insertId, ...playerData } 
        });
    });
};

// Cập nhật thông tin cầu thủ
exports.updatePlayer = (req, res) => {
    const id = req.params.id;
    console.log('=== UPDATE PLAYER ===');
    console.log('ID:', id);
    console.log('Body nhận được:', req.body);
    
    const playerData = {
        name: req.body.name,
        position: req.body.position,
        age: req.body.age,
        nationality: req.body.nationality,
        club: req.body.club,
        overall: req.body.overall,
        pace: req.body.pace || 0,
        shooting: req.body.shooting || 0,
        passing: req.body.passing || 0,
        dribbling: req.body.dribbling || 0,
        defending: req.body.defending || 0,
        physical: req.body.physical || 0,
        photo_url: req.body.photo_url || null
    };

    Player.update(id, playerData, (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi khi cập nhật cầu thủ', 
                error: err.message 
            });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy cầu thủ' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Cập nhật cầu thủ thành công', 
            data: { id, ...playerData } 
        });
    });
};

// Xóa cầu thủ
exports.deletePlayer = (req, res) => {
    const id = req.params.id;
    
    Player.delete(id, (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi khi xóa cầu thủ', 
                error: err.message 
            });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy cầu thủ' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Xóa cầu thủ thành công' 
        });
    });
};

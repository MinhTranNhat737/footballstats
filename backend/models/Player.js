const db = require('../db');

class Player {
    // Lấy tất cả cầu thủ
    static getAll(callback) {
        const query = 'SELECT * FROM players ORDER BY name ASC';
        db.query(query, callback);
    }

    // Tìm kiếm cầu thủ
    static search(searchTerm, callback) {
        const query = 'SELECT * FROM players WHERE name LIKE ? OR position LIKE ? OR nationality LIKE ? OR club LIKE ? ORDER BY name ASC';
        const searchPattern = `%${searchTerm}%`;
        db.query(query, [searchPattern, searchPattern, searchPattern, searchPattern], callback);
    }

    // Lấy thông tin cầu thủ theo ID
    static getById(id, callback) {
        const query = 'SELECT * FROM players WHERE player_id = ?';
        db.query(query, [id], callback);
    }

    // Tạo cầu thủ mới
    static create(playerData, callback) {
        const query = 'INSERT INTO players (name, position, age, nationality, club, overall, pace, shooting, passing, dribbling, defending, physical, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            playerData.name,
            playerData.position,
            playerData.age,
            playerData.nationality,
            playerData.club || null,
            playerData.overall,
            playerData.pace,
            playerData.shooting,
            playerData.passing,
            playerData.dribbling,
            playerData.defending,
            playerData.physical,
            playerData.photo_url || null
        ];
        db.query(query, values, callback);
    }

    // Cập nhật thông tin cầu thủ
    static update(id, playerData, callback) {
        const query = 'UPDATE players SET name = ?, position = ?, age = ?, nationality = ?, club = ?, overall = ?, pace = ?, shooting = ?, passing = ?, dribbling = ?, defending = ?, physical = ?, photo_url = ? WHERE player_id = ?';
        const values = [
            playerData.name,
            playerData.position,
            playerData.age,
            playerData.nationality,
            playerData.club || null,
            playerData.overall,
            playerData.pace,
            playerData.shooting,
            playerData.passing,
            playerData.dribbling,
            playerData.defending,
            playerData.physical,
            playerData.photo_url || null,
            id
        ];
        db.query(query, values, callback);
    }

    // Xóa cầu thủ
    static delete(id, callback) {
        const query = 'DELETE FROM players WHERE player_id = ?';
        db.query(query, [id], callback);
    }
}

module.exports = Player;

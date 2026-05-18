const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.loginUser(username, password);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { register, login };
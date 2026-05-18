const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
    const { username, password, role } = userData;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        password: hashedPassword,
        role: role || 'User'
    });

    await user.save();

    return { _id: user._id, username: user.username, role: user.role };
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        token,
        user: { _id: user._id, username: user.username, role: user.role }
    };
};

module.exports = { registerUser, loginUser };
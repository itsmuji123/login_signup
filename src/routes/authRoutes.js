const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/jwt_exp', authenticateToken, authController.check);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const serviceController = require('../controllers/service');
const cardController = require('../controllers/card');
const codeController = require('../controllers/code');
const adminController = require('../controllers/Admin');

// middleware
const {authenticateToken, authenticateAdminToken} = require('../middlewares/auth');

router.post('/jwt_exp', authenticateToken, userController.check);


// routes for users

router.get('/user',authenticateAdminToken,userController.getUsers); // admin API
router.get('/user/:userId', userController.getUserById); // admin & user API
router.post('/user',authenticateAdminToken, userController.signup); // register (admin API)
router.put('/user/:userId',authenticateAdminToken,userController.editUser); // admin API
router.delete('/user/:userId',authenticateAdminToken, userController.deleteUser); // admin API

// Route for setting user balance by ID (admin API)
router.put('/user/:userId/set-balance', authenticateAdminToken, userController.setUserBalanceById);

// purchase routes
router.post('/user/:userId', userController.purchaseCard); // user API


// Define routes for service
router.post('/Service',authenticateAdminToken, serviceController.createService); // admin API
router.get('/Service', serviceController.getServices); // admin and user API
router.get('/Service/:serviceId',authenticateAdminToken, serviceController.getServiceById); // admin API
router.put('/Service/:serviceId',authenticateAdminToken, serviceController.editService); // admin API
router.delete('/Service/:serviceId',authenticateAdminToken, serviceController.deleteService); // admin API


// Define routes for cards 
router.get('/card',authenticateAdminToken, cardController.getCards); // admin API
router.get('/card/:cardId', cardController.getCardById); // admin & user API
router.post('/card',authenticateAdminToken, cardController.createCard); // admin API
router.put('/card/:cardId',authenticateAdminToken, cardController.editCard); // admin API
router.delete('/card/:cardId',authenticateAdminToken, cardController.deleteCard); // admin API
 

// Define a route for code 
router.get('/code',authenticateAdminToken,codeController.getCodes); // admin API
router.post('/code',authenticateAdminToken, codeController.createCode); // admin API
router.put('/code',authenticateAdminToken, codeController.editCode); // admin API
router.delete('/code',authenticateAdminToken, codeController.deleteCode); // admin API
router.get('/code/Id', authenticateAdminToken, codeController.getCodeByPinAndSerial); // admin API




// Some feature routes needed for functionality
router.post('/cardbyservice', cardController.getAllCardsByService); // user end API


// Admin API's

// user login at user end
router.post('/loginAdmin', adminController.loginAdmin);
router.post('/registerAdmin', adminController.registerAdmin);


// User API's
// user login at user end
router.post('/login', userController.login);




module.exports = router; 

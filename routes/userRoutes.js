const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.listUsers);
router.get('/add', userController.addUserForm);
router.post('/add', userController.addUser);
router.get('/edit/:id', userController.editUserForm);
router.post('/update/:id', userController.updateUser);
router.post('/delete/:id', userController.deleteUser);

module.exports = router;

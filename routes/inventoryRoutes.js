const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to display add inventory form
router.get('/add', (req, res) => {
    res.render('inventory/add');
});

// Route to add inventory item
router.post('/add', inventoryController.addInventory);

// Route to display inventory list
router.get('/list', inventoryController.getInventoryList);

// Route to display edit inventory form
router.get('/edit/:id', inventoryController.getInventoryById);

// Route to update inventory item
router.post('/update/:id', inventoryController.updateInventory);

// Route to delete inventory item
router.post('/delete/:id', inventoryController.deleteInventory);

module.exports = router;

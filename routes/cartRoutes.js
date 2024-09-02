const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get all cart items
router.get('/list', cartController.getAllCartItems);

// Show form to add a new cart item
router.get('/add', (req, res) => {
  res.render('cart/add', { title: 'Add Cart Item' });
});

// Add a new cart item
router.post('/add', cartController.addCartItem);

// Show form to edit a cart item
router.get('/edit/:id', cartController.editCartItem);

// Update a cart item
router.post('/edit/:id', cartController.updateCartItem);

// Delete a cart item
router.post('/delete/:id', cartController.deleteCartItem);

module.exports = router;

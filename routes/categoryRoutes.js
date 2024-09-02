const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route to get the list of categories
router.get('/list', categoryController.getAllCategories);

// Route to display the add category form
router.get('/add', (req, res) => {
    res.render('category/add', { title: 'Add New Category' });
});

// Route to handle adding a new category
router.post('/add', categoryController.addCategory);

// Route to display the edit category form
router.get('/edit/:id', categoryController.getCategoryForEdit);

// Route to handle updating a category
router.post('/update/:id', categoryController.updateCategory);
router.post('/delete/:id', categoryController.deleteCategory);

module.exports = router;

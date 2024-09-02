const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceControllers');

// Routes for invoices
router.get('/add', (req, res) => res.render('invoice/add')); // Render form to add invoice
router.get('/list', invoiceController.listInvoices);  // List all invoices
router.post('/add', invoiceController.addInvoice); // Handle adding new invoice
router.get('/edit/:id', invoiceController.editInvoiceForm ); // Render form to edit invoice
router.post('/update/:id', invoiceController.updateInvoice); // Handle updating invoice
router.post('/delete/:id', invoiceController.deleteInvoice); // Handle deleting invoice

module.exports = router;

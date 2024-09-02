const { ObjectId } = require('mongodb');

// List all invoices
exports.listInvoices = async (req, res) => {
    try {
        const invoices = await req.db.collection('invoices').find({}).toArray();
        res.render('invoice/list', { invoices });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving invoices");
    }
};

// Render add invoice form
exports.addInvoiceForm = (req, res) => {
    res.render('invoice/add');
};

// Add a new invoice
exports.addInvoice = async (req, res) => {
    const invoice = {
        senderName: req.body.senderName,
        senderContact: req.body.senderContact,
        senderEmail: req.body.senderEmail,
        recipientName: req.body.recipientName,
        recipientContact: req.body.recipientContact,
        recipientEmail: req.body.recipientEmail,
        name: req.body.name,
        quantity: parseInt(req.body.quantity),
        price: parseFloat(req.body.price),
        taxRate: parseFloat(req.body.taxRate),
        discountRate: parseFloat(req.body.discountRate),
        total: parseFloat(req.body.total)
    };
    try {
        await req.db.collection('invoices').insertOne(invoice);
        res.redirect('/invoice/list');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding invoice");
    }
};

// Render edit invoice form
exports.editInvoiceForm = async (req, res) => {
    const id = new ObjectId(req.params.id);
    try {
        const invoice = await req.db.collection('invoices').findOne({ _id: id });
        res.render('invoice/edit', { invoice });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving invoice");
    }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
    const id = new ObjectId(req.params.id);
    const updatedData = {
        senderName: req.body.senderName,
        senderContact: req.body.senderContact,
        senderEmail: req.body.senderEmail,
        recipientName: req.body.recipientName,
        recipientContact: req.body.recipientContact,
        recipientEmail: req.body.recipientEmail,
        name: req.body.name,
        quantity: parseInt(req.body.quantity),
        price: parseFloat(req.body.price),
        taxRate: parseFloat(req.body.taxRate),
        discountRate: parseFloat(req.body.discountRate),
        total: parseFloat(req.body.total)
    };
    try {
        await req.db.collection('invoices').updateOne({ _id: id }, { $set: updatedData });
        res.redirect('/invoice/list');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating invoice");
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    const id = new ObjectId(req.params.id);
    try {
        await req.db.collection('invoices').deleteOne({ _id: id });
        res.redirect('/invoice/list');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting invoice");
    }
};

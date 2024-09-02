const { ObjectId } = require('mongodb');

// Controller to handle adding inventory
exports.addInventory = async (req, res) => {
    try {
        const newItem = req.body;
        await req.db.collection('inventory').insertOne(newItem);
        res.redirect('/inventory/list');
    } catch (err) {
        res.status(500).send('Error adding inventory: ' + err.message);
    }
};

// Controller to get inventory list
exports.getInventoryList = async (req, res) => {
    try {
        const inventory = await req.db.collection('inventory').find().toArray();
        res.render('inventory/list', { inventory });
    } catch (err) {
        res.status(500).send('Error fetching inventory list: ' + err.message);
    }
};

// Controller to get inventory item by ID for editing
exports.getInventoryById = async (req, res) => {
    try {
        const inventory = await req.db.collection('inventory').findOne({ _id: new ObjectId(req.params.id) });
        res.render('inventory/edit', { inventory });
    } catch (err) {
        res.status(500).send('Error fetching inventory item: ' + err.message);
    }
};

// Controller to update inventory
exports.updateInventory = async (req, res) => {
    try {
        await req.db.collection('inventory').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.redirect('/inventory/list');
    } catch (err) {
        res.status(500).send('Error updating inventory: ' + err.message);
    }
};

// Controller to delete inventory
exports.deleteInventory = async (req, res) => {
    try {
        await req.db.collection('inventory').deleteOne({ _id: new ObjectId(req.params.id) });
        res.redirect('/inventory/list');
    } catch (err) {
        res.status(500).send('Error deleting inventory: ' + err.message);
    }
};

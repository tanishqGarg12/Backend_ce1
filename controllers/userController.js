const { ObjectId } = require('mongodb');

// List all users
exports.listUsers = async (req, res) => {
    try {
        const users = await req.db.collection('users').find({}).toArray();
        res.render('users/list', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving users");
    }
};

// Render add user form
exports.addUserForm = (req, res) => {
    res.render('users/add');
};

// Add a new user
exports.addUser = async (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        role: req.body.role,
        email: req.body.email,
        phone: parseInt(req.body.phone)
    };
    try {
        await req.db.collection('users').insertOne(user);
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding user");
    }
};

// Render edit user form
exports.editUserForm = async (req, res) => {
    const id = new ObjectId(req.params.id);
    try {
        const user = await req.db.collection('users').findOne({ _id: id });
        res.render('users/edit', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving user");
    }
};

// Update user
exports.updateUser = async (req, res) => {
    const id = new ObjectId(req.params.id);
    const updatedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        role: req.body.role,
        email: req.body.email,
        phone: parseInt(req.body.phone)
    };
    try {
        await req.db.collection('users').updateOne({ _id: id }, { $set: updatedData });
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating user");
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const id = new ObjectId(req.params.id);
    try {
        await req.db.collection('users').deleteOne({ _id: id });
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting user");
    }
};

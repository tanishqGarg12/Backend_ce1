const { ObjectId } = require('mongodb');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        // Fetch categories from the database
        const categories = await req.db.collection('categories').find({}).toArray();
        
        console.log("seesion is "+req.session.role)
        // Render the template with categories and user data
        res.render('category/list', { 
            title: 'Category List', 
            categories,
            user: {
                role: req.session.role // Pass user role from session
            } // Include user object to access role information in EJS
        });
    } catch (error) {
        res.status(500).send('Error fetching categories: ' + error.message);
    }
};


// Add a new category
exports.addCategory = async (req, res) => {
    const { name, subcategory, sellerName } = req.body;
    try {
        await req.db.collection('categories').insertOne({
            name,
            subcategory,
            sellerName,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.redirect('/category/list');
    } catch (error) {
        res.status(500).send('Error adding category: ' + error.message);
    }
};

// Get a category by ID for editing
exports.getCategoryForEdit = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await req.db.collection('categories').findOne({ _id: new ObjectId(categoryId) });
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.render('category/edit', { title: 'Edit Category', category });
    } catch (error) {
        res.status(500).send('Error fetching category: ' + error.message);
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name, subcategory, sellerName } = req.body;
    try {
        await req.db.collection('categories').updateOne(
            { _id: new ObjectId(categoryId) },
            {
                $set: {
                    name,
                    subcategory,
                    sellerName,
                    updatedAt: new Date(),
                }
            }
        );
        res.redirect('/category/list');
    } catch (error) {
        res.status(500).send('Error updating category: ' + error.message);
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        await req.db.collection('categories').deleteOne({ _id: new ObjectId(categoryId) });
        res.redirect('/category/list');
    } catch (error) {
        res.status(500).send('Error deleting category: ' + error.message);
    }
};

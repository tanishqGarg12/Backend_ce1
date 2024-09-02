const { ObjectId } = require('mongodb');

// Get all cart items
exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await req.db.collection('cart').find({}).toArray();
    res.render('cart/list',{cartItems});
  } catch (error) {
    res.status(500).send('Error fetching cart items: ' + error.message);
  }
};

// Add a new cart item
exports.addCartItem = async (req, res) => {
  const { name, quantity, price } = req.body;
  const total = quantity * price;
  try {
    await req.db.collection('cart').insertOne({
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      total,
      totalQuantity: quantity,
      totalPrice: total,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.redirect('/cart/list');
  } catch (error) {
    res.status(500).send('Error adding cart item: ' + error.message);
  }
};

// Edit a cart item
exports.editCartItem = async (req, res) => {
  const cartId = req.params.id;
  try {
    const cartItem = await req.db.collection('cart').findOne({ _id: new ObjectId(cartId) });
    res.render('cart/edit', { cartItem });
  } catch (error) {
    res.status(500).send('Error fetching cart item: ' + error.message);
  }
};

// Update a cart item
exports.updateCartItem = async (req, res) => {
  const cartId = req.params.id;
  const { name, quantity, price } = req.body;
  const total = quantity * price;
  try {
    await req.db.collection('cart').updateOne(
      { _id: new ObjectId(cartId) },
      {
        $set: {
          name,
          quantity: parseInt(quantity),
          price: parseFloat(price),
          total,
          totalQuantity: quantity,
          totalPrice: total,
          updatedAt: new Date(),
        },
      }
    );
    res.redirect('/cart/list');
  } catch (error) {
    res.status(500).send('Error updating cart item: ' + error.message);
  }
};

// Delete a cart item
exports.deleteCartItem = async (req, res) => {
  const cartId = req.params.id;
  try {
    await req.db.collection('cart').deleteOne({ _id: new ObjectId(cartId) });
    res.redirect('/cart/list');
  } catch (error) {
    res.status(500).send('Error deleting cart item: ' + error.message);
  }
};

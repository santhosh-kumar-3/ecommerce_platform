const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add to cart
exports.addToCart = async (req, res) => {
  console.log("Received body:", req.body);
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) cart = new Cart({ user: userId, items: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json({ items: populatedCart.items });
  } catch (err) {
    console.error("Add to Cart Error:", err.message);
    res.status(500).json({ message: "Server error while adding to cart" });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quantity
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.status(200).json({ items: populatedCart.items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item
exports.removeCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.status(200).json({ items: populatedCart.items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

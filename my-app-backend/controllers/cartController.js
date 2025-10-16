const db = require("../models");
const Cart = db.Cart;
const handleError = require("../utils/handleError");
const { addToCartSchema, updateCartSchema } = require("../validations/cartValidators");

exports.addToCart = async (req, res) => {
  try {
    const result = await addToCartSchema.validate(req.body, { abortEarly: false });
    const { productId, quantity } = result;

    const product = await db.Product.findOne({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    let cartItem = await Cart.findOne({ where: { productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ productId, quantity });
    }

    res.status(200).json({ success: true, cartItem });
  } catch (error) {
    handleError(error, res);
  }
};


exports.updateCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await updateCartSchema.validate(req.body, { abortEarly: false });
    const { quantity } = result;

    const product = await db.Product.findOne({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const cartItem = await Cart.findOne({ where: { productId } });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ success: true, cartItem });
  } catch (error) {
    handleError(error, res);
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await db.Product.findOne({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const deleted = await Cart.destroy({ where: { productId } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    handleError(error, res);
  }
};


exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll();

    const cartdetailList = await Promise.all(
      cartItems.map(async (item) => {
        const product = await db.Product.findOne({ where: { id: item.productId } });
        return {
          id: item.id,
          quantity: item.quantity,
          product,
        };
      })
    );

    res.status(200).json({ success: true, cart: cartdetailList });
  } catch (error) {
    handleError(error, res);
  }
};

const yup = require("yup");

exports.addToCartSchema = yup.object({
  productId: yup
    .string()
    .required("Product ID is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .integer("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

exports.updateCartSchema = yup.object({
  quantity: yup
    .number()
    .required("Quantity is required")
    .integer("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

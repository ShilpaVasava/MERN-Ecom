const  yup = require('yup');

const productSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  price: yup.string().required(),
  categoryId: yup.number(),
  stock: yup.number().positive().integer().min(0).required(),
  image: yup.string().url().optional(),
});


const updateProductSchema = yup.object().shape({
  name: yup.string(),
  description: yup.string().nullable(),
  price: yup.number().positive("Price must be positive"),
  categoryId: yup.number().integer(),
  stock: yup.number().integer().min(0),
});

module.exports = {productSchema,updateProductSchema};
const db = require("../models");
const handleError = require("../utils/handleError");
const { productSchema, updateProductSchema } = require("../validations/productValidators");

exports.createProduct = async (req, res) => {
  try {
    const result = await productSchema.validate(req.body, {
      abortEarly: false,
    });

    const imagePath = req.file ? `/public/uploads/${req.file.filename}` : null;
    if (imagePath) {
      result.image = imagePath;
    }

    const { name, description, price, categoryId, stock } = result;

    const categoryExists = await db.Categories.findOne({
      where: { id: parseInt(categoryId) },
    });

    if (!categoryExists) throw new Error("Invalid category ID");

    const existingProduct = await db.Product.findOne({ where: { name } });
    if (existingProduct) throw new Error("Product already exists");

    const product = await db.Product.create({
      name,
      description,
      price,
      categoryId,
      stock,
      image: req.file ? req.file.filename : "",
    });

    res.status(201).json(product);
  } catch (err) {
    handleError(err, res);
  }
};


exports.listProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await db.Product.findAndCountAll({
      limit,
      offset,
      include: [
        { model: db.Categories, as: "category" }
      ],
    });

    const data = rows.map((product) => {
      const prod = product.toJSON();
      prod.imageURL = prod.image ? `${process.env.BASE_URL}/public/uploads/${prod.image}` : null;
      return prod;
    });

    return res.status(200).json({
      products: data,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });

  } catch (err) {
    handleError(err, res);
  }
};


exports.getProductById = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const product = await db.Product.findByPk(req.params.id, {
      include: [{ model: db.Categories, as: "category" }],
    });

    if (!product) throw new Error("Product not found");

    res.status(200).json(product);
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateProduct = async (req, res) => {
  try {

    const result = await updateProductSchema.validate(req.body, { abortEarly: false });
    const { name, description, price, categoryId, stock } = result;
    console.log("result", result);

    const product = await db.Product.findByPk(req.params.id);
    if (!product) throw new Error("Product not found", 404);


    
    if(categoryId){
    const category = await db.Categories.findByPk(categoryId);
    if (!category) throw new Error("Invalid category ID", 400);
    }

    
    let imagePath = product.image; 
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      imagePath = `/public/uploads/${req.file.filename}`;
    }

    await product.update({ name, description, price, categoryId, stock, image: req.file ? req.file.filename : product.image });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    handleError(err, res);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (!product) throw new AppError("Product not found", 404);

    
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.destroy();
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};
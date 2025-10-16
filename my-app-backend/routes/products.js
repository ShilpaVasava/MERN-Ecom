const express = require('express');
const upload = require('../utils/multer');
const productController = require('../controllers/productController');

const router = express();

router.post('/create', upload.single('image'), productController.createProduct);
router.get('/list', productController.listProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
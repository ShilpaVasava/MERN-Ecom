const express = require('express');


const router = express.Router();

router.use('/products', require('./products'));
router.use('/cart', require('./carts'));

module.exports = router;

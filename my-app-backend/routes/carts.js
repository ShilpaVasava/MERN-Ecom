const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.put("/update/:productId", cartController.updateCart);
router.delete("/remove/:productId", cartController.removeFromCart);
router.get("/", cartController.getCart);

module.exports = router;

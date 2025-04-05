const express = require("express");
const { createOrder, verifyEsewaPayment } = require("../../controllers/users/order.controller");
const router = express.Router();

router.post("/create", createOrder);
router.post("/verify", verifyEsewaPayment);

module.exports = router;

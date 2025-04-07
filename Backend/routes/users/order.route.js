const express = require("express");
const { createOrder, verifyEsewaPayment } = require("../../controllers/users/order.controller");
const router = express.Router();

// Endpoint for creating a new order (with Esewa integration)
router.post("/create", createOrder);

// Endpoint for verifying Esewa payment
router.post("/verify", verifyEsewaPayment);

module.exports = router;

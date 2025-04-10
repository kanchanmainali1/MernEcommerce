const express = require("express");
const { createOrder, getOrdersByUserId, getOrderDetailsForUser } = require("../../controllers/users/order.controller");
const router = express.Router();


router.post("/create", createOrder);

router.get("/list/:userId", getOrdersByUserId);

router.get("/details/:id", getOrderDetailsForUser);

module.exports = router;

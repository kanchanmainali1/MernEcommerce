const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

// GET /api/admin/orders/ - Retrieve all orders
router.get("/", getAllOrdersOfAllUsers);

// GET /api/admin/orders/:id - Retrieve details of a specific order
router.get("/:id", getOrderDetailsForAdmin);

// PUT /api/admin/orders/:id - Update the status of a specific order
router.put("/:id", updateOrderStatus);

module.exports = router;
 
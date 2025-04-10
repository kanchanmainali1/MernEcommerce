const Order = require("../../models/Order");

// Create order (COD only)
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully with Cash on Delivery",
      orderId: newlyCreatedOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Some error occurred!" });
  }
};

// Get all orders for a given user (by userId)
// Instead of sending a 404 when there are no orders, we return an empty array.
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // userId from the URL
    const orders = await Order.find({ userId });
    res.status(200).json({
      success: true,
      data: orders, // may be an empty array if no orders exist
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Some error occurred!" });
  }
};

// Get details of a single order by order id
const getOrderDetailsForUser = async (req, res) => {
  try {
    const { id } = req.params; // order id from the URL
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Some error occurred!" });
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderDetailsForUser,
};

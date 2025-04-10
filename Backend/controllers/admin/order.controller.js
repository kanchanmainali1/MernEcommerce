const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error("Error fetching orders:", e.message);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
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
  } catch (e) {
    console.error("Error fetching order details:", e.message);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: updatedOrder,
    });
  } catch (e) {
    console.error("Error updating order status:", e.message);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};

const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const axios = require("axios");
const esewaConfig = require("../../helpers/esewa");
const CryptoJS = require("crypto-js");


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

    if (paymentMethod === "esewa") {
      const transactionUUID = `${newlyCreatedOrder._id}`;
      const merchantCode = esewaConfig.merchantCode; // e.g., "EPAYTEST"

      // Generate the signature message using the new field names
      const message = `amt=${totalAmount},txnId=${transactionUUID},merchantCode=${merchantCode}`;
      const signature = CryptoJS.HmacSHA256(message, esewaConfig.secretKey);
      const hashInBase64 = CryptoJS.enc.Base64.stringify(signature);

      const paymentUrl = esewaConfig.esewaEndpoint;

      res.status(201).json({
        success: true,
        data: {
          paymentUrl,
          amt: totalAmount,            // renamed field
          txnId: transactionUUID,        // renamed field
          merchantCode,                // renamed field
          successUrl: esewaConfig.successUrl,
          failureUrl: esewaConfig.failureUrl,
          signature: hashInBase64,
          signed_field_names: "amt,txnId,merchantCode",
        },
        orderId: newlyCreatedOrder._id,
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId: newlyCreatedOrder._id,
      });
    }
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

// Verify eSewa Payment
const verifyEsewaPayment = async (req, res) => {
  const { product_code, transaction_uuid, total_amount } = req.body;

  try {
    const verificationUrl = `${esewaConfig.verifyEndpoint}?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    const response = await axios.get(verificationUrl);

    console.log("[eSewa] Verification Response:", response.data);

    if (response.data.status === "COMPLETE") {
      res.json({ success: true, message: "Payment verified successfully.", response: response.data });
    } else {
      res.json({ success: false, message: "Payment verification failed." });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ success: false, message: "Verification error.", error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyEsewaPayment,
};

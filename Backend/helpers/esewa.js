const esewaConfig = {
  merchantCode: "EPAYTEST", // Testing Merchant Code. Replace with actual Merchant Code for production.
  secretKey: "8gBm/:&EnhH.1/q", // Secret key provided by eSewa for HMAC Signature Generation.
  successUrl: "http://localhost:5000/api/esewa/success",
  failureUrl: "http://localhost:5000/api/esewa/failure",
  esewaEndpoint: "https://rc-epay.esewa.com.np/api/epay/main/v2/form", // New Testing URL for Payment
  verifyEndpoint: "https://rc-epay.esewa.com.np/api/epay/transaction/status", // Testing Verification URL
};

module.exports = esewaConfig;

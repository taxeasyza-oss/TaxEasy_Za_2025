// Stub for production start-up
module.exports = {
  initPayFast: () => console.log("[PAYFAST] stub initialised"),
  processPayment: async () => ({ success: true, stub: true })
};

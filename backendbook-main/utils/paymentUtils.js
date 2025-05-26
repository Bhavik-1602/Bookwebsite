// const crypto = require('crypto');

// class PaymentUtils {
//   // Generate unique receipt ID
//   static generateReceiptId() {
//     return `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }

//   // Verify Razorpay signature
//   static verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
//     const body = razorpayOrderId + '|' + razorpayPaymentId;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');
    
//     return expectedSignature === razorpaySignature;
//   }

//   // Verify webhook signature
//   // static verifyWebhookSignature(body, signature) {
//   //   const expectedSignature = crypto
//   //     .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
//   //     .update(JSON.stringify(body))
//   //     .digest('hex');
    
//   //   return expectedSignature === signature;
//   // }

//   // Convert amount to paise (Razorpay expects amount in paise)
//   static convertToPaise(amount) {
//     return Math.round(amount * 100);
//   }

//   // Convert amount from paise to rupees
//   static convertFromPaise(amount) {
//     return amount / 100;
//   }
// }

// module.exports = PaymentUtils;

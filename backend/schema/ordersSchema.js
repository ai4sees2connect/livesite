const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter',  // Reference to the Recruiter model
      required: true,
    },
    planType: {
      type: String,
      required: true,
      enum: ['1-month', '3-month', '1-year', '1-post', '2-post', '3-post', '4-post', '5-post', '6-post', '7-post', '8-post', '9-post', '10-post'], // Adjust this based on your plan types
    },
    amount: {
      type: Number, // Store the amount in paise (or cents, depending on your currency)
      required: true,
    },
    orderId: {
      type: String,
      required: true, // Razorpay order ID
    },
    paymentId: {
      type: String,
      required: true, // Razorpay payment ID
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending', // Track the payment status
    },
    transactionDate: {
      type: Date,
      default: Date.now, // Date when the order was placed
    },
    expirationDate: {
      type: Date, // For subscriptions, you can store expiration date of the plan here
    },
    postsProvided: {
      type: Number, // Store posts remaining for subscription plans
    }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

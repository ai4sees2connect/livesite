const express = require("express");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Recruiter = require("../schema/recruiterSchema");
const dotenv = require("dotenv");
const Order = require("../schema/ordersSchema");
// const { connect } = require("http2");

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

router.get('/get-razorpay-key', (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
});


router.post('/:recruiterId/create-order', async (req, res) => {
  const { amount, planType } = req.body; // Get the amount and plan type from frontend
  const recruiterId = req.params.recruiterId;

  const options = {
    amount: amount, // amount in paise
    currency: 'INR',
    receipt: `receipt_order_${Math.random() * 10000}`,
  };

  // console.log(options);

  try {
    // Create order in Razorpay
    const order = await razorpay.orders.create(options);

    console.log(order);

    console.log('order-created');
    // Send back the order, recruiterId, and planType to the frontend
    res.status(200).json({
      success: true,
      order,
      recruiterId,  // To track which recruiter made the payment
      planType,     // The selected plan type (e.g., 1-month, 3-month, etc.)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType, recruiterId, amount } = req.body;

    // Create the order document first with paymentStatus = 'pending'
    const orderDocument = await Order.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      recruiterId,
      amount,
      planType,
      paymentStatus: 'pending', // Initially set to pending // Placeholder, will be determined later based on the planType
      postsProvided: 0,  // Placeholder, will be updated later
      expirationDate: null,  // Placeholder, will be updated later
    });

    // Perform Razorpay payment verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      console.log('Payment verified successfully');

      // Fetch recruiter data
      const recruiter = await Recruiter.findById(recruiterId);

      let expirationDate;
      let postsProvided;
      let orderType = ''; // Initialize orderType here

      // Handle the case where recruiter is on free plan and is upgrading to a paid plan
      if (recruiter.subscription.planType === 'free') {
        const subscriptionPlans = {
          '1-month': { duration: 1, unit: 'month', posts: 3 },
          '3-month': { duration: 3, unit: 'month', posts: 12 },
          '1-year': { duration: 12, unit: 'month', posts: 90 },
        };

        const selectedPlan = subscriptionPlans[planType];
        if (!selectedPlan) {
          orderDocument.paymentStatus = 'failed';
          // orderDocument.orderType='failed';  // Invalid plan type, set status to failed
          await orderDocument.save();
          return res.status(400).json({ message: 'Invalid plan type.', success: false });
        }

        // Set the expiration date and postsProvided based on the new plan
        expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + selectedPlan.duration);
        postsProvided = selectedPlan.posts;
        orderType = 'subscription'; // Set order type to subscription
        // orderDocument.orderType = orderType; 
        orderDocument.postsProvided = postsProvided;  
        orderDocument.expirationDate=expirationDate;
        await orderDocument.save();
        // Update recruiter with the new plan
        await Recruiter.findByIdAndUpdate(recruiterId, {
          'subscription.planType': planType,
          'subscription.activationDate': new Date(),
          'subscription.expirationDate': expirationDate,
          'subscription.postsRemaining': postsProvided,
          'subscription.status': 'active',
        });

        console.log('Subscription updated:', recruiter);
      }else if(!planType.includes('post')) {
        // If the recruiter is already on a paid plan (e.g., '1-month', '3-month', etc.)
        const subscriptionPlans = {
          '1-month': { duration: 1, unit: 'month', posts: 5 },
          '3-month': { duration: 3, unit: 'month', posts: 24 },
          '1-year': { duration: 12, unit: 'month', posts: 120 },
        };
      
        const selectedPlan = subscriptionPlans[planType];
        if (!selectedPlan) {
          orderDocument.paymentStatus = 'failed';
          // orderDocument.orderType = 'failed';  // Invalid plan type, set status to failed
          await orderDocument.save();
          return res.status(400).json({ message: 'Invalid plan type.', success: false });
        }
      
        // Calculate the new expiration date by adding the selected plan duration to the current expiration date
        expirationDate = new Date(recruiter.subscription.expirationDate);
        expirationDate.setMonth(expirationDate.getMonth() + selectedPlan.duration);
      
        // Carry forward the existing postsRemaining and add new posts if the new plan provides more
        postsTotal = recruiter.subscription.postsRemaining + selectedPlan.posts;
        postsProvided=selectedPlan.posts
      
        // Update the order document with the new details
        orderType = 'subscription'; // Set order type to subscription
        // orderDocument.orderType = orderType;
        orderDocument.postsProvided = postsProvided
        orderDocument.expirationDate = expirationDate;
        console.log('this is the doc',orderDocument);
        await orderDocument.save();
      
        // Update recruiter with the extended plan
        await Recruiter.findByIdAndUpdate(recruiterId, {
          'subscription.planType': planType,
          'subscription.activationDate': new Date(),
          'subscription.expirationDate': expirationDate,
          'subscription.postsRemaining': postsTotal,
          'subscription.status': 'active',
        });
      
        console.log('Subscription updated:', recruiter);
      }

      // Handle top-ups (for adding posts)
      if (planType.includes('post')) {
        const postsToAdd = parseInt(planType.split('-')[0], 10);

        // No change to expiration date for top-ups, only increment postsRemaining
        expirationDate = recruiter.subscription.expirationDate;  // Keep the same expiration date
        let postsTotal = recruiter.subscription.postsRemaining + postsToAdd;
        postsProvided= postsToAdd;

        orderType = 'top-up'; // Set order type to top-up

        // Update recruiter posts remaining
        await Recruiter.findByIdAndUpdate(recruiterId, {
          'subscription.postsRemaining': postsTotal,
        });

        console.log('Top-up applied:', recruiter);
      }

      // Update the order document with expirationDate, postsProvided, and orderType
      orderDocument.expirationDate = expirationDate;
      orderDocument.postsProvided = postsProvided;
      // orderDocument.orderType = orderType;  // Now that orderType is set, we can update the document

      // Set the payment status to 'completed' as payment is verified
      orderDocument.paymentStatus = 'completed';

      await orderDocument.save();  // Save the updated order document

      return res.status(200).json({ message: 'Payment verified and subscription updated.', success: true });
    } else {
      // Payment verification failed, update order document with failed status
      orderDocument.paymentStatus = 'failed';
      await orderDocument.save();
      return res.status(400).json({ message: 'Payment verification failed.', success: false });
    }
  } catch (error) {
    console.error('Error during payment verification:', error);
    return res.status(500).json({ message: 'Internal server error.', error, success: false });
  }
});










module.exports = router;

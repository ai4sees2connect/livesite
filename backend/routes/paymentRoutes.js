const express = require("express");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Recruiter = require("../schema/recruiterSchema");
const dotenv = require("dotenv");
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

  try {
    // Create order in Razorpay
    const order = await razorpay.orders.create(options);


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
    console.log('hello')
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType, recruiterId } = req.body;
    // console.log(req.body);
    // console.log('this is recruiterId', recruiterId.recruiterId);
    // const recruiter=await Recruiter.findById(recruiterId);
    // console.log(recruiter);
    let posts='';
    switch(planType) {
      case '1-month':
        posts="3"
        break;
      
      case '3-month':
        posts="12"
        break;

      case '1-year':
        posts="90"
    }
    

    // Perform Razorpay payment verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");
    // console.log(expectedSignature===razorpay_signature);
    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      
      // Update recruiter's subscription details based on the selected planType
      const subscriptionPlans = {
        '1-month': { duration: 1, unit: 'month' },
        '3-month': { duration: 3, unit: 'month' },
        '1-year': { duration: 12, unit: 'month' }
      };
     

      const selectedPlan = subscriptionPlans[planType];
      const activationDate = new Date();
      const expirationDate = new Date();
      
      expirationDate.setMonth(expirationDate.getMonth() + selectedPlan.duration);

      const updatedRecruiter = await Recruiter.findByIdAndUpdate(recruiterId, {
        'subscription.planType': planType,
        'subscription.activationDate': activationDate,
        'subscription.expirationDate': expirationDate,
        'subscription.postsRemaining':posts,
        'subscription.status': 'active',
      }, { new: true }); // Get the updated document
     
      

      console.log('order-verified');
      res.status(200).json({ message: 'Payment verified and subscription updated.',success:true });
    } else {
      return res.status(400).json({ message: "Payment verification failed." , success:false});
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error.", error, success:false });
  }
});



module.exports = router;

import React from 'react';
import axios from 'axios';
import api from '../common/server_url'
import { useParams } from 'react-router-dom';

const RecPricing = () => {
  
  const recruiterId=useParams();


  const handlePayment = async (amount, planType) => {
    try {

      const { data: { key: razorpayKey } } = await axios.get(`${api}/payments/get-razorpay-key`);
      // Step 1: Create an order by calling the backend
      const { data: orderData } = await axios.post(`${api}/payments/${recruiterId}/create-order`, { amount, recruiterId, planType });
  
      const { order } = orderData;
  
      if (!order) {
        alert('Failed to create an order');
        return;
      }
  
      // Step 2: Initialize Razorpay with the order details
      const options = {
        key: razorpayKey, // Replace with your Razorpay Key ID from environment
        amount: order.amount, // Order amount in the smallest currency unit (paise)
        currency: 'INR',
        name: 'Your Company Name',
        description: `Payment for ${planType}`, // Use the planType dynamically
        order_id: order.id, // Order ID from Razorpay
  
        handler: async (response) => {
          // Step 3: Verify payment after successful payment
          try {
            const { data: verifyData } = await axios.post(`${api}/payments/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              recruiterId,  // Pass the recruiterId to identify the recruiter
              planType,     // Pass the plan type to update subscription
            });
  
            if (verifyData.success) {
              alert('Payment successful and verified!');
              // You can redirect or update the UI to reflect the new subscription
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed');
          }
        },
  
        // prefill: {
        //   name: 'Recruiter Name', // You can dynamically populate this based on logged-in recruiter
        //   email: 'recruiter@example.com', // Similarly, populate this from recruiter data
        //   contact: '9999999999', // Optional
        // },
        
        theme: {
          color: '#3399cc', // Customize the color
        },
      };
  
      // Step 4: Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error during payment process:', error);
      alert('Payment failed to initialize');
    }
  };
  

  return (
    <div className='mt-20'>
      <div className='text-gray-700 text-center'>You are currently using free plan</div>
      <div className="flex justify-center space-x-4 p-6 text-gray-700 text-center">
        
        {/* Free Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-[20%]">
          <h2 className="text-xl font-semibold mb-4">Free Plan</h2>
          <p className="text-gray-600 mb-4">Best for trial period</p>
          <br />
          <p className="text-blue-600 mb-4">Total Posting: 1/month</p>
          <p className="text-2xl font-bold">&#8377;0.00</p>
        </div>

        {/* 1 Month Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-[20%]">
          <h2 className="text-xl font-semibold mb-4">1 Month Plan</h2>
          <p className="text-gray-600 mb-4">Best for short-term hiring.</p>
          <br />
          <p className="text-blue-600  mb-4">Total Posting: 3/month</p>
          <p className="text-2xl font-bold">&#8377;2000</p>
          <button 
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(200000,'1-month')}
          >
            Buy Now
          </button>
        </div>

        {/* 3 Month Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-[20%]">
          <h2 className="text-xl font-semibold mb-4">3 Month Plan</h2>
          <p className="text-gray-600 mb-4">Popular choice for consistent hiring.</p>
          <p className="text-blue-600  mb-4">Total Posting: 4/month</p>
          <p className="text-2xl font-bold">&#8377;5600</p>
          <button 
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(560000,'3-month')}
          >
            Buy Now
          </button>
        </div>

        {/* 1 Year Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-[20%]">
          <h2 className="text-xl font-semibold mb-4">1 Year Plan</h2>
          <p className="text-gray-600 mb-4">Best value for long-term hiring needs.</p>
          <p className="text-blue-600  mb-4">Total Posting: Unlimited</p>
          <p className="text-2xl font-bold">&#8377;23000</p>
          <button 
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(2300000,'1-year')}
          >
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default RecPricing;

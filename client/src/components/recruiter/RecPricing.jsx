import React from "react";
import axios from "axios";
import api from "../common/server_url";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecruiter } from "./context/recruiterContext";
import Spinner from "../common/Spinner";
import TimeLeft from "../common/TimeLeft";

const RecPricing = () => {
  const { recruiterId } = useParams();
  const { recruiter } = useRecruiter();
  console.log(recruiterId);

  const handlePayment = async (amount, planType) => {
    try {
      const {
        data: { key: razorpayKey },
      } = await axios.get(`${api}/payments/get-razorpay-key`);
      // Step 1: Create an order by calling the backend
      const { data: orderData } = await axios.post(
        `${api}/payments/${recruiterId}/create-order`,
        { amount, recruiterId, planType }
      );

      const { order } = orderData;

      if (!order) {
        alert("Failed to create an order");
        return;
      }

      // Step 2: Initialize Razorpay with the order details
      const options = {
        key: razorpayKey, // Replace with your Razorpay Key ID from environment
        amount: order.amount, // Order amount in the smallest currency unit (paise)
        currency: "INR",
        name: "Internshub",
        description: `Payment for ${planType}`, // Use the planType dynamically
        order_id: order.id, // Order ID from Razorpay

        handler: async (response) => {
          // Step 3: Verify payment after successful payment
          try {
            const { data: verifyData } = await axios.post(
              `${api}/payments/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                recruiterId,
                planType, // Pass the plan type to update subscription
              }
            );

            if (verifyData.success) {
              toast.success("Payment successful");
              // You can redirect or update the UI to reflect the new subscription
            } else {
              toast.error("Payment failed");
            }
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: "", // You can dynamically populate this based on logged-in recruiter
          email: "", // Similarly, populate this from recruiter data
          contact: "", // Optional
        },

        theme: {
          color: "#1b70d1", // Customize the color
        },
      };

      // Step 4: Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Payment failed to initialize");
    }
  };
  console.log(recruiter);

  if (!recruiter) {
    return <Spinner />;
  }
  let planType = "";
  switch (recruiter.subscription.planType) {
    case "free":
      planType = "Free Plan";
      break;
    case "1-month":
      planType = "1 Month Plan";
      break;
    case "3-month":
      planType = "3 Month Plan";
      break;
    case "1-year":
      planType = "1 Year Plan";
      break;
  }

  return (
    <div className="mt-24 lg:mt-32">
      <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-[80%] md:w-[40%] lg:w-[20%] text-center mx-auto bg-blue-50 mb-10">
        <h2 className="text-xl font-semibold mb-4">Active Plan</h2>
        <p className="text-xl font-semibold mb-4 text-blue-600 capitalize">
          {planType}
        </p>

        {recruiter.subscription.planType !== "free" && (
          <p className="text-red-500 mb-4">
            Your subscription ends in
            {TimeLeft(recruiter.subscription.expirationDate)} days
          </p>
        )}
        <p className="text-gray-700">
          No of postings left: {recruiter.subscription.postsRemaining}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center p-6 text-gray-700 text-center gap-10 mb-10">
        {/* Free Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg hover:border-blue-500 hover:scale-105 duration-300 ">
          <h2 className="text-xl font-semibold mb-4">Free Plan</h2>
          <p className="text-gray-600 mb-4">Best for trial period</p>

          <p className="text-blue-600 mb-4">Total Posting: 1/month</p>
          <p className="text-2xl font-bold">&#8377;0.00</p>
        </div>

        {/* 1 Month Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg  hover:border-blue-500 hover:scale-105 duration-300 ">
          <h2 className="text-xl font-semibold mb-4">1 Month Plan</h2>
          <p className="text-gray-600 mb-4">Best for short-term hiring.</p>

          <p className="text-blue-600  mb-4">Total Posting: 3/month</p>
          <p className="text-2xl font-bold">&#8377;1</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(100, "1-month")}
          >
            Buy Now
          </button>
        </div>

        {/* 3 Month Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg  hover:border-blue-500 hover:scale-105 duration-300 ">
          <h2 className="text-xl font-semibold mb-4">3 Month Plan</h2>
          <p className="text-gray-600 mb-4">
            Popular choice for consistent hiring.
          </p>
          <p className="text-blue-600  mb-4">Total Posting: 4/month</p>
          <p className="text-2xl font-bold">&#8377;2</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(200, "3-month")}
          >
            Buy Now
          </button>
        </div>

        {/* 1 Year Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg   hover:border-blue-500 hover:scale-105 duration-300 ">
          <h2 className="text-xl font-semibold mb-4">1 Year Plan</h2>
          <p className="text-gray-600 mb-4">
            Best value for long-term hiring needs.
          </p>
          <p className="text-blue-600  mb-4">Total Posting: 10/month</p>
          <p className="text-2xl font-bold">&#8377;3</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(300, "1-year")}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecPricing;

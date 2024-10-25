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
    <div className=" bg-gradient-to-r from-blue-500 to-blue-400 pt-32 pb-10">
      
      <div className="text-center text-white text-2xl lg:text-4xl mb-6 font-bold">Your plan expires in {TimeLeft(recruiter.subscription.expirationDate)} days...</div>
      

      <div className="flex flex-col space-y-4 w-[80%] sm:w-[80%] md:w-[70%] lg:space-y-0 lg:flex-row space-x-2 justify-center py-3 px-5 text-gray-700 text-center lg:w-[70%] mx-auto mb-10 lg:h-[380px]">
        {/* Free Plan */}

        <div className="border flex flex-col bg-white border-gray-300 lg:w-[25%] rounded-lg p-6 shadow-lg  ">
          <h2 className="text-xl font-semibold mt-4">Free Plan</h2>
          <hr />
          <p className="text-gray-600 my-4">Best for trial period</p>

          <p className="text-blue-600 mb-4">Total Posting: 1/month</p>
          <p className="text-2xl font-bold">&#8377;0.00</p>
        </div>

        {/* 1 Month Plan */}
        <div className="border flex flex-col justify-between bg-white border-gray-300 lg:w-[25%]  rounded-lg p-6 shadow-lg   hover:scale-110 duration-300 relative">
          <div>
          <h2 className="text-xl font-semibold mt-4">1 Month Plan</h2>
          <hr />
          <p className="text-gray-600 my-4">Best for short-term hiring.</p>

          <p className="text-blue-600  mb-4">Total Posting: 3/month</p>
          <p className="text-2xl font-bold">&#8377;1</p>
          </div>

          <button
            className=" bg-orange-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(100, "1-month")}
          >
            Buy Now
          </button>
        </div>

        {/* 3 Month Plan */}
        <div className="border flex flex-col justify-between bg-white border-gray-300 rounded-lg lg:w-[25%]  p-6 shadow-lg  hover:scale-110 duration-300 relative">
          <div>
          <h2 className="text-xl font-semibold mt-4">3 Month Plan</h2>
          <hr />
          <p className="text-gray-600 my-4">
            Popular choice for consistent hiring.
          </p>
          <p className="text-blue-600  mb-4">Total Posting: 4/month</p>
          <p className="text-2xl font-bold">&#8377;2</p>
          </div>
          <button
            className=" bg-orange-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(200, "3-month")}
          >
            Buy Now
          </button>
        </div>

        {/* 1 Year Plan */}
        <div className="border flex flex-col justify-between bg-white border-gray-300 rounded-lg lg:w-[25%] p-6  shadow-lg    hover:scale-110 duration-300 relative">
          <div>
          <div className=" absolute top-0 left-0 bg-yellow-300 font-semibold rounded-t-lg h-8 w-full">Popular</div>
          <h2 className="text-xl font-semibold mt-4">1 Year Plan</h2>
          <hr />
          <p className="text-gray-600 my-4">
            Best value for long-term hiring needs.
          </p>
          <p className="text-blue-600  mb-4">Total Posting: 10/month</p>
          <p className="text-2xl font-bold">&#8377;3</p>
          </div>
          <button
            className=" bg-orange-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(300, "1-year")}
          >
            Buy Now
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-[60%] md:w-[40%]  lg:w-[20%] text-center mx-auto bg-blue-50 mb-10">
        <h2 className="text-xl font-semibold mb-4">Active Plan</h2>
        <p className="text-xl font-semibold mb-4 text-blue-600 capitalize">
          {planType}
        </p>

        {recruiter.subscription.planType !== "free" && (
          <p className="text-red-500 mb-4">
            Your subscription ends&nbsp;
            {TimeLeft(recruiter.subscription.expirationDate)} days
          </p>
        )}
        <p className="text-gray-700">
          No of postings left: {recruiter.subscription.postsRemaining}
        </p>
      </div>

    </div>
  );
};

export default RecPricing;

import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../common/server_url";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecruiter } from "./context/recruiterContext";
import Spinner from "../common/Spinner";
import TimeLeft from "../common/TimeLeft";
import calculateDaysRemaining from '../common/calculateDaysRemaining';
import { FaMoneyBillWave, FaGift, FaBriefcase } from "react-icons/fa"
import { FaCalendarAlt } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";

const RecPricing = () => {
  const { recruiterId } = useParams();
  const { recruiter } = useRecruiter();
  const [selectedPosts, setSelectedPosts] = useState(1);
  const pricePerPost = 100;
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);


  const handlePayment = async (amount, planType) => {
    if (recruiter?.subscription?.status === "active" && planType !== "top-up") {
      setPendingPlan({ amount, planType });
      setShowDialog(true);
      return;
    }
    initiatePayment(amount, planType);
  };

  const initiatePayment = async (amount, planType) => {
    try {
      const { data: { key: razorpayKey } } = await axios.get(`${api}/payments/get-razorpay-key`);
      const { data: orderData } = await axios.post(
        `${api}/payments/${recruiterId}/create-order`,
        { amount, recruiterId, planType }
      );

      const { order } = orderData;

      if (!order) {
        alert("Failed to create an order");
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: "Internshub",
        description: `Payment for ${planType}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const { data: verifyData } = await axios.post(
              `${api}/payments/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                recruiterId,
                planType,
                amount: order.amount
              }
            );
            if (verifyData.success) {
              toast.success("Payment successful");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              toast.error("Payment failed");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: recruiter?.name || "",
          email: recruiter?.email || "",
        },
        theme: {
          color: "#1b70d1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Payment failed to initialize");
    }
  };


  const confirmMerge = () => {
    if (pendingPlan) {
      initiatePayment(pendingPlan.amount, pendingPlan.planType);
    }
    setShowDialog(false);
  };

  const cancelMerge = () => {
    setPendingPlan(null);
    setShowDialog(false);
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

  console.log('this is date', recruiter.subscription.expirationDate);

  return (
    <div className=" bg-gradient-to-r from-blue-500 to-blue-400 pt-32 pb-10">

<div className="text-center text-white text-2xl lg:text-4xl mb-6 font-bold">
  {recruiter.subscription.expirationDate ? (
    `Your plan expires in ${TimeLeft(recruiter.subscription.expirationDate)} days...`
  ) : (
    `Your available posting will refresh after ${calculateDaysRemaining(recruiter.subscription.activationDate)} days`
  )}
</div>


      <div className="flex flex-col space-y-4 w-[80%] sm:w-[80%] md:w-[70%] lg:space-y-0 lg:flex-row space-x-2 justify-center py-3 px-5 text-gray-700 text-center lg:w-[80%] mx-auto mb-10 lg:h-[380px]">
        
       {/* Free Plan */}
<div className="group border border-gray-200 bg-white lg:w-[25%] rounded-xl p-6 shadow-md 
hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col relative">

  <div className="flex justify-center mb-4">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
      <FaGift className="text-3xl" />
    </div>
  </div>

  <h2 className="text-xl font-bold text-gray-800 text-center">
    Free Plan
  </h2>

  <div className="h-px bg-gray-200 my-4"></div>

  <p className="text-gray-500 text-sm mb-5 text-center">
    Best for trial period
  </p>

  <div className="flex items-center justify-between mb-2">
    <span className="text-gray-600 font-medium">Posting</span>
    <span className="text-blue-600 font-semibold">2 per month</span>
  </div>

  <div className="text-center mb-6">
    <p className="text-2xl font-bold text-gray-900">
      ₹0
    </p>
  </div>

  <div className="mt-auto flex justify-center">
    <button className="flex items-center gap-2 
    bg-blue-600 text-white px-6 py-2.5 rounded-lg 
    hover:bg-blue-700 transition-all duration-200">
      <FaGift />
      Get Started
    </button>
  </div>
</div>

        {/* 1 Month Plan */}
<div className="group border border-gray-200 bg-white lg:w-[25%] rounded-xl p-6 shadow-md 
hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col">

  <div className="flex justify-center mb-4">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
      <FaBriefcase className="text-3xl" />
    </div>
  </div>

  <h2 className="text-xl font-bold text-gray-800 text-center">
    1 Month Plan
  </h2>

  <div className="h-px bg-gray-200 my-4"></div>

  <p className="text-gray-500 text-sm mb-5 text-center">
    Best for short-term hiring.
  </p>

  <div className="flex justify-between mb-2">
    <span className="text-gray-600 font-medium">Posting</span>
    <span className="text-blue-600 font-semibold">3 per month</span>
  </div>

  <div className="text-center mb-4">
    <p className="text-2xl font-bold text-gray-900">
      ₹1
    </p>
  </div>

 <div className="mt-3">
  <button
    onClick={() => handlePayment(100, "1-month")}
    className="
      w-full
      relative
      overflow-hidden
      bg-gradient-to-r
      from-orange-500
      to-orange-600
      text-white
      py-2.5
      rounded-xl
      shadow-md
      hover:shadow-xl
      transition-all
      duration-300
      flex
      items-center
      justify-center
      gap-2
      font-semibold
    "
  >
    <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>

    <span className="relative">
      Buy Now
    </span>
  </button>
</div>

</div>

        {/* 3 Month Plan */}
<div className="group border border-gray-200 bg-white lg:w-[25%] rounded-xl p-6 shadow-md 
hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col">

  <div className="flex justify-center mb-3">
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
      <FaCalendarAlt className="text-3xl" />
    </div>
  </div>

  <h2 className="text-xl font-bold text-gray-800 text-center">
    3 Month Plan
  </h2>

  <div className="h-px bg-gray-200 my-3"></div>

  <p className="text-gray-500 text-sm mb-4 text-center">
    Popular choice for consistent hiring.
  </p>

  <div className="flex justify-between mb-2">
    <span className="text-gray-600 font-medium">Posting</span>
    <span className="text-orange-600 font-semibold">4 per month</span>
  </div>

  <p className="text-2xl font-bold text-gray-900 mb-4 text-center">
    ₹199
  </p>

  <div className="mt-4">
  <button
    onClick={() => handlePayment(19900, "3-month")}
    className="
      w-full
      py-2.5
      rounded-xl
      bg-orange-500
      text-white
      font-semibold
      shadow-md
      hover:bg-orange-600
      hover:shadow-xl
      transition-all
      duration-300
    "
  >
    Buy Now
  </button>
</div>

</div>

        {/* 1 Year Plan */}
<div className="group border border-gray-200 bg-white lg:w-[25%] rounded-xl p-6 shadow-md 
hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col relative">

  <div className="absolute top-3 right-3 bg-yellow-300 text-xs font-semibold px-3 py-1 rounded-full">
    Popular
  </div>

  <div className="flex justify-center mb-3">
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
      <FaCrown className="text-3xl" />
    </div>
  </div>

  <h2 className="text-xl font-bold text-gray-800 text-center">
    1 Year Plan
  </h2>

  <div className="h-px bg-gray-200 my-3"></div>

  <p className="text-gray-500 text-sm mb-4 text-center">
    Best value for long-term hiring needs.
  </p>

  <div className="flex justify-between mb-2">
    <span className="text-gray-600 font-medium">Posting</span>
    <span className="text-yellow-600 font-semibold">10 per month</span>
  </div>

  <p className="text-2xl font-bold text-gray-900 mb-4 text-center">
    ₹499
  </p>

  <div className="mt-4">
  <button
    onClick={() => handlePayment(49900, "1-year")}
    className="
      w-full
      py-2.5
      rounded-xl
      bg-orange-500
      text-white
      font-semibold
      shadow-md
      hover:bg-orange-600
      hover:shadow-xl
      transition-all
      duration-300
    "
  >
    Buy Now
  </button>
</div>
</div>


    <div
      className="
        group
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-2
        transition-all
        duration-300
        lg:w-[25%]
        h-[356px]
        p-4
        flex
        flex-col
      "
    >
      <div className="flex justify-center mb-2">
        <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
          <FaPlusCircle className="text-pink-500 text-xl" />
        </div>
      </div>

      <h2 className="text-lg font-bold text-center text-gray-800">
        No postings left?
      </h2>

      <p className="text-center text-gray-500 text-sm mt-1">
        Buy top-ups plans.
      </p>

      <div className="border-t my-3"></div>

      <p className="text-center text-pink-500 text-sm font-medium mb-1">
        Select Number of postings
      </p>

      <div className="flex justify-center mt-2">
        <select
          className="w-36 h-9 rounded-lg border border-gray-300 text-center text-sm"
          value={selectedPosts}
          onChange={(e) => setSelectedPosts(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map(
            (number) => (
              <option key={number} value={number}>
                {number} post{number > 1 ? "s" : ""}
              </option>
            )
          )}
        </select>
      </div>

      <div className="text-center mt-4">
        <p className="text-2xl font-bold text-gray-900">
          ₹{selectedPosts * pricePerPost}
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={() =>
            handlePayment(
              selectedPosts * pricePerPost * 100,
              `${selectedPosts}-post`
            )
          }
          className="
            w-full
            py-2.5
            rounded-xl
            bg-gradient-to-r
            from-pink-500
            to-rose-500
            text-white
            font-semibold
            hover:shadow-xl
            transition-all
          "
        >
          Buy Now
        </button>
      </div>
    </div>
</div>

      <div className="w-[90%] lg:w-[80%] mx-auto mb-10">

  <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">

    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 blur-3xl opacity-40 rounded-full"></div>

    <div className="flex items-center gap-4 w-full lg:w-1/3 z-10">

      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
        <FaCrown className="text-blue-600 text-2xl" />
      </div>

      <div>
        <p className="text-xs text-gray-500 font-medium tracking-wide">
          ACTIVE PLAN
        </p>

        <h2 className="text-xl font-bold text-gray-800 capitalize leading-tight">
          {planType}
        </h2>
      </div>

    </div>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-10 w-full lg:w-1/3 z-10">

      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Your subscription ends in
        </p>
        <p className="text-2xl font-extrabold text-blue-600 mt-1">
          {TimeLeft(recruiter.subscription.expirationDate)} <span className="text-sm">days</span>
        </p>
      </div>

      <div className="hidden sm:block w-px h-10 bg-gray-200"></div>

      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Postings left
        </p>
        <p className="text-2xl font-extrabold text-green-600 mt-1">
          {recruiter.subscription.postsRemaining}
        </p>
      </div>

    </div>

    <div className="w-full lg:w-1/3 flex justify-end z-10">

      <button className="
        px-6 py-2.5
        rounded-xl
        border border-blue-500
        text-blue-600
        font-semibold
        hover:bg-blue-50
        hover:shadow-md
        transition-all duration-200
      ">
        View Details →
      </button>

    </div>

  </div>
</div>
    </div>
  );
};

export default RecPricing;
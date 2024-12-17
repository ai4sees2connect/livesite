import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../common/server_url";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecruiter } from "./context/recruiterContext";
import Spinner from "../common/Spinner";
import TimeLeft from "../common/TimeLeft";
import calculateDaysRemaining from '../common/calculateDaysRemaining'

const RecPricing = () => {
  const { recruiterId } = useParams();
  const { recruiter } = useRecruiter();
  const [selectedPosts, setSelectedPosts] = useState(1);
  const pricePerPost = 100;
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);


  const handlePayment = async (amount, planType) => {
    // If recruiter already has an active plan, show dialog
    if (recruiter?.subscription?.status === "active" && planType !== "top-up") {
      setPendingPlan({ amount, planType });
      setShowDialog(true);
      return;
    }
    // Proceed with payment directly for top-ups or new subscriptions
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
                amount:order.amount
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
    // Proceed with the payment after merging is confirmed
    if (pendingPlan) {
      initiatePayment(pendingPlan.amount, pendingPlan.planType);
    }
    setShowDialog(false);
  };

  const cancelMerge = () => {
    // Close dialog and reset pendingPlan
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

        <div className="border flex flex-col bg-white border-gray-300 lg:w-[25%] rounded-lg p-6 shadow-lg  ">
          <h2 className="text-xl font-semibold mt-4">Free Plan</h2>
          <hr />
          <p className="text-gray-600 my-4">Best for trial period</p>

          <p className="text-blue-600 mb-4">Posting: 2 per month</p>
          <p className="text-2xl font-bold">&#8377;0</p>
        </div>

        {/* 1 Month Plan */}
        <div className="border flex flex-col justify-between bg-white border-gray-300 lg:w-[25%]  rounded-lg p-6 shadow-lg   hover:scale-110 duration-300 relative">
          <div>
            <h2 className="text-xl font-semibold mt-4">1 Month Plan</h2>
            <hr />
            <p className="text-gray-600 my-4">Best for short-term hiring.</p>

            <p className="text-blue-600  mb-4">Total Posting: 5 per month</p>
            <p className="text-2xl font-bold">&#8377;99</p>
          </div>

          <button
            className=" bg-orange-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(9900, "1-month")}
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
            <p className="text-blue-600  mb-4">Total Posting: 8 per month</p>
            <p className="text-2xl font-bold">&#8377;199</p>
          </div>
          <button
            className=" bg-orange-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(19900, "3-month")}
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
            <p className="text-blue-600  mb-4">Total Posting: 10 per month</p>
            <p className="text-2xl font-bold">&#8377;499</p>
          </div>
          <button
            className=" bg-orange-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handlePayment(49900, "1-year")}
          >
            Buy Now
          </button>
        </div>


        <div className="border flex flex-col justify-between bg-white border-gray-300 rounded-lg lg:w-[35%] p-6 shadow-lg  relative">
          <div>
            <h2 className="text-xl font-semibold mt-4">No postings left?</h2>
            <hr />
            <p className="text-gray-600 my-4">Buy top-ups plans.</p>
            <p className="text-blue-600 mb-4">Select Number of postings</p>


            <select
              className="border border-gray-300 rounded-lg p-2 mb-4"
              value={selectedPosts}
              onChange={(e) => setSelectedPosts(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
                <option key={number} value={number}>
                  {number} post{number > 1 ? "s" : ""}
                </option>
              ))}
            </select>


            <p className="text-2xl font-bold">&#8377;{selectedPosts * pricePerPost}</p>
          </div>

          <button
            className="bg-orange-500 text-white py-2 px-4 rounded-lg"
            onClick={() =>
              handlePayment(selectedPosts * pricePerPost * 100, `${selectedPosts}-post`)
            }
          >
            Buy Now
          </button>
        </div>

      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-lg font-semibold mb-4">
              You already have an active plan. Do you want to merge this plan with the new chosen plan?
            </p>
            <div className="flex justify-around">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                onClick={confirmMerge}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                onClick={cancelMerge}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

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
          Postings left: {recruiter.subscription.postsRemaining}
        </p>
      </div>

    </div>
  );
};

export default RecPricing;

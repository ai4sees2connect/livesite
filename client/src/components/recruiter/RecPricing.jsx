import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../common/server_url";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecruiter } from "./context/recruiterContext";
import Spinner from "../common/Spinner";
import TimeLeft from "../common/TimeLeft";
import calculateDaysRemaining from '../common/calculateDaysRemaining';
import { 
  FaCheck, FaTimes, FaCrown, FaRocket, FaBolt, FaStar, 
  FaHeadset, FaChartLine, FaPaintBrush, FaSearch, FaCalendarAlt,
  FaPlus, FaInfoCircle
} from "react-icons/fa";

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

  if (!recruiter) {
    return <Spinner />;
  }

  let planType = "";
  switch (recruiter.subscription.planType) {
    case "free": planType = "Free Plan"; break;
    case "1-month": planType = "1 Month Plan"; break;
    case "3-month": planType = "3 Month Plan"; break;
    case "1-year": planType = "1 Year Plan"; break;
    default: planType = "Top-up";
  }

  // Reusable Feature Component
  const Feature = ({ included, icon, children }) => (
    <li className="flex items-center gap-2 text-sm py-1">
      {included ? (
        <span className="text-[var(--primary-color)]">{icon || <FaCheck />}</span>
      ) : (
        <FaTimes className="text-gray-300" />
      )}
      <span className={included ? "text-[var(--text-color)] font-medium" : "text-[var(--text-light)]"}>
        {children}
      </span>
    </li>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-light-color)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Status Banner */}
        <div className="bg-gradient-to-r mt-8 from-[var(--primary-color)] to-[var(--button-hover-color)] text-white py-6 px-4 rounded-2xl shadow-lg mb-12 text-center">
          <p className="text-lg md:text-xl font-semibold flex items-center justify-center gap-2">
            <FaCalendarAlt />
            {recruiter.subscription.expirationDate ? (
              `Your plan expires in ${TimeLeft(recruiter.subscription.expirationDate)} days...`
            ) : (
              `Your available postings will refresh after ${calculateDaysRemaining(recruiter.subscription.activationDate)} days`
            )}
          </p>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-3">Choose the Perfect Plan for Your Hiring Needs</h1>
          <p className="text-[var(--text-light)] text-lg">Transparent pricing. No hidden fees. Cancel anytime.</p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          
          {/* Free Plan */}
          <div className="bg-white rounded-3xl shadow-sm border border-[var(--border-color)] p-8 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-[var(--text-color)]">Free Plan</h3>
            <p className="text-[var(--text-light)] mt-1 text-sm">Best for trial period</p>
            <div className="mt-6 mb-6">
              <span className="text-4xl font-bold text-[var(--text-color)]">₹0</span>
              <span className="text-[var(--text-light)]"> / month</span>
            </div>
            <div className="bg-[var(--bg-light-color)] p-3 rounded-xl mb-6 border border-[var(--border-color)]">
              <p className="text-sm font-bold text-[var(--primary-color)] flex items-center gap-2">
                <FaRocket /> 2 Job Postings / month
              </p>
            </div>
            <ul className="space-y-2 mb-8 flex-1">
              <Feature included>2 Job Postings / month</Feature>
              <Feature included icon={<FaSearch />}>Basic Candidate Search</Feature>
              <Feature included icon={<FaHeadset />}>Standard Support</Feature>
              <Feature included={false}>Featured Listings</Feature>
              <Feature included={false}>Analytics Dashboard</Feature>
            </ul>
            <button className="w-full py-3 border-2 border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-bold hover:bg-[var(--bg-light-color)] transition-colors">
              Current Plan
            </button>
          </div>

          {/* 1 Month Plan */}
          <div className="bg-white rounded-3xl shadow-sm border border-[var(--border-color)] p-8 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-[var(--text-color)]">1 Month Plan</h3>
            <p className="text-[var(--text-light)] mt-1 text-sm">Best for short-term hiring</p>
            <div className="mt-6 mb-6">
              <span className="text-4xl font-bold text-[var(--text-color)]">₹1</span>
              <span className="text-[var(--text-light)]"> / month</span>
            </div>
            <div className="bg-[var(--bg-light-color)] p-3 rounded-xl mb-6 border border-[var(--border-color)]">
              <p className="text-sm font-bold text-[var(--primary-color)] flex items-center gap-2">
                <FaRocket /> 3 Job Postings / month
              </p>
            </div>
            <ul className="space-y-2 mb-8 flex-1">
              <Feature included>3 Job Postings / month</Feature>
              <Feature included icon={<FaSearch />}>Basic Candidate Search</Feature>
              <Feature included icon={<FaHeadset />}>Standard Support</Feature>
              <Feature included={false}>Featured Listings</Feature>
              <Feature included={false}>Analytics Dashboard</Feature>
            </ul>
            <button
              className="w-full bg-[var(--button-color)] text-white py-3 rounded-xl font-bold hover:bg-[var(--button-hover-color)] transition-colors shadow-md"
              onClick={() => handlePayment(100, "1-month")}
            >
              Buy Now
            </button>
          </div>

          {/* 3 Month Plan */}
          <div className="bg-white rounded-3xl shadow-sm border border-[var(--border-color)] p-8 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-[var(--text-color)]">3 Month Plan</h3>
            <p className="text-[var(--text-light)] mt-1 text-sm">Consistent hiring needs</p>
            <div className="mt-6 mb-6">
              <span className="text-4xl font-bold text-[var(--text-color)]">₹199</span>
              <span className="text-[var(--text-light)]"> / 3 months</span>
            </div>
            <div className="bg-[var(--bg-light-color)] p-3 rounded-xl mb-6 border border-[var(--border-color)]">
              <p className="text-sm font-bold text-[var(--primary-color)] flex items-center gap-2">
                <FaRocket /> 4 Job Postings / month
              </p>
            </div>
            <ul className="space-y-2 mb-8 flex-1">
              <Feature included>4 Job Postings / month</Feature>
              <Feature included icon={<FaSearch />}>Advanced Candidate Search</Feature>
              <Feature included icon={<FaHeadset />}>Priority Email Support</Feature>
              <Feature included icon={<FaChartLine />}>Basic Analytics</Feature>
              <Feature included={false}>Custom Branding</Feature>
            </ul>
            <button
              className="w-full bg-[var(--button-color)] text-white py-3 rounded-xl font-bold hover:bg-[var(--button-hover-color)] transition-colors shadow-md"
              onClick={() => handlePayment(19900, "3-month")}
            >
              Buy Now
            </button>
          </div>

          {/* 1 Year Plan (HIGHLIGHTED) */}
          <div className="relative bg-white rounded-3xl shadow-xl border-2 border-[var(--primary-color)] p-8 flex flex-col lg:scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--button-color)] text-white px-5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
              <FaCrown /> BEST VALUE
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-color)] mt-2">1 Year Plan</h3>
            <p className="text-[var(--text-light)] mt-1 text-sm">Ultimate growth for your company</p>
            <div className="mt-6 mb-6">
              <span className="text-4xl font-bold text-[var(--text-color)]">₹499</span>
              <span className="text-[var(--text-light)]"> / year</span>
            </div>
            <div className="bg-[var(--icon-bg-color)] p-4 rounded-xl mb-6 border border-[var(--border-color)]">
              <p className="text-sm font-bold text-[var(--primary-color)] flex items-center gap-2">
                <FaRocket /> 10 Job Postings / month
              </p>
              <p className="text-xs text-[var(--text-light)] mt-1">Total 120 postings annually</p>
            </div>
            <ul className="space-y-2 mb-8 flex-1">
              <Feature included icon={<FaRocket />}>10 Job Postings / month</Feature>
              <Feature included icon={<FaSearch />}>Advanced Candidate Search</Feature>
              <Feature included icon={<FaHeadset />}>Priority 24/7 Support</Feature>
              <Feature included icon={<FaStar />}>Featured Job Listings</Feature>
              <Feature included icon={<FaChartLine />}>Advanced Analytics Dashboard</Feature>
              <Feature included icon={<FaPaintBrush />}>Custom Company Branding</Feature>
            </ul>
            <button
              className="w-full bg-[var(--button-color)] text-white py-3 rounded-xl font-bold hover:bg-[var(--button-hover-color)] transition-colors shadow-md flex items-center justify-center gap-2"
              onClick={() => handlePayment(49900, "1-year")}
            >
              <FaBolt /> Upgrade Now
            </button>
          </div>
        </div>

        {/* Top-Up Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--border-color)] p-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-color)] flex items-center gap-2">
                <FaPlus className="text-[var(--primary-color)]" /> Need more postings right now?
              </h3>
              <p className="text-[var(--text-light)] mt-1">Buy top-up posts instantly. No subscription required.</p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-6 bg-[var(--bg-light-color)] p-6 rounded-2xl border border-[var(--border-color)]">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-[var(--text-color)] mb-2">Select Number of Postings</label>
              <select
                className="w-full p-3 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white text-[var(--text-color)]"
                value={selectedPosts}
                onChange={(e) => setSelectedPosts(Number(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
                  <option key={number} value={number}>
                    {number} post{number > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-sm text-[var(--text-light)]">Total Price</p>
              <p className="text-3xl font-bold text-[var(--text-color)]">₹{selectedPosts * pricePerPost}</p>
            </div>
            <button
              className="w-full lg:w-auto bg-[var(--button-color)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--button-hover-color)] transition-colors shadow-md flex items-center justify-center gap-2"
              onClick={() => handlePayment(selectedPosts * pricePerPost * 100, `${selectedPosts}-post`)}
            >
              <FaPlus /> Buy Top-up
            </button>
          </div>
        </div>

        {/* Active Plan Status Widget */}
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--border-color)] p-8">
          <h3 className="text-xl font-bold text-[var(--text-color)] mb-6 flex items-center gap-2">
            <FaInfoCircle className="text-[var(--primary-color)]" /> Current Subscription Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--bg-light-color)] p-5 rounded-2xl border border-[var(--border-color)]">
              <p className="text-sm text-[var(--text-light)] mb-1">Active Plan</p>
              <p className="text-xl font-bold text-[var(--primary-color)] capitalize">{planType}</p>
            </div>
            <div className="bg-[var(--bg-light-color)] p-5 rounded-2xl border border-[var(--border-color)]">
              <p className="text-sm text-[var(--text-light)] mb-1">Postings Remaining</p>
              <p className="text-xl font-bold text-[var(--text-color)]">{recruiter.subscription.postsRemaining}</p>
            </div>
            <div className="bg-[var(--bg-light-color)] p-5 rounded-2xl border border-[var(--border-color)]">
              <p className="text-sm text-[var(--text-light)] mb-1">Status</p>
              {recruiter.subscription.planType !== "free" ? (
                <p className="text-lg font-bold text-red-500">Expires in {TimeLeft(recruiter.subscription.expirationDate)} days</p>
              ) : (
                <p className="text-lg font-bold text-green-600">Refreshes in {calculateDaysRemaining(recruiter.subscription.activationDate)} days</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Merge Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[var(--icon-bg-color)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaInfoCircle className="text-2xl text-[var(--primary-color)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">Merge Plans?</h3>
            <p className="text-[var(--text-light)] mb-6">
              You already have an active plan. Do you want to merge this new plan with your existing subscription?
            </p>
            <div className="flex gap-4">
              <button
                className="flex-1 py-3 bg-gray-100 text-[var(--text-color)] font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                onClick={cancelMerge}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-[var(--button-color)] text-white font-semibold rounded-xl hover:bg-[var(--button-hover-color)] transition-colors shadow-md"
                onClick={confirmMerge}
              >
                Yes, Merge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecPricing;
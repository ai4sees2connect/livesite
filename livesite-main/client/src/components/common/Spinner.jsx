import React from "react";

const Spinner = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Animated Rotating Cube */}
      <div
        style={{
          position: "relative",
          width: "64px",
          height: "64px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, #3b82f6, #6366f1)",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            animation: "spin 2s linear infinite",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, #60a5fa, #a78bfa)",
            borderRadius: "8px",
            opacity: "0.75",
            boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
            animation: "spin 2s linear infinite",
          }}
        ></div>
      </div>

      {/* Loading Text */}
      <p
        style={{
          marginTop: "16px",
          fontSize: "18px",
          color: "#4b5563",
          opacity: 0,
          animation: "fadeIn 1s ease-in-out forwards",
        }}
      >
        Loading...
      </p>

      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            50% { transform: rotateX(180deg) rotateY(180deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
          }

          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;

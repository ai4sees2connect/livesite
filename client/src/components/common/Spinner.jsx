import React from 'react';
import './Spinner.css';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {/* Rotating cube loader */}
      <div className="relative w-14 h-14">
        {/* Cube 1 */}
        <div className="absolute inset-0 w-full h-full bg-blue-500 rounded-md animate-rotate-scale"></div>
        {/* Cube 2 */}
        <div className="absolute inset-0 w-full h-full bg-blue-400 rounded-md animate-rotate-scale delay-200"></div>
      </div>
    </div>
  );
};

export default Spinner;

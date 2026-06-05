import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import '../utilscss/SliderStyles.css'

const PerformanceSlider = ({ selectedPer,setSelectedPer }) => {

  // Marks for the slider
  const percen = {
    0: '0%',
    1: '60%',
    2: '70%',
    3: '80%',
    4: '90%',
  };

 

  return (
    <div className="w-full max-w-md mx-auto py-4 mt-5 mb-12">
      <h3 className="text-base mb-4">Minimum academic performance</h3>
      <div className="px-2 w-[86%] mx-auto">
        <Slider
          min={0}
          max={4}
          marks={percen}
          step={null} // Slider stops only at defined marks
          onChange={(value) => setSelectedPer(value)}
          value={selectedPer}
          
          className="custom-slider" // Add a custom class for custom CSS styling
        />
      </div>
      
    </div>
  );
};

export default PerformanceSlider;

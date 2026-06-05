import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import '../utilscss/SliderStyles.css'

const MatchingSlider = ({ selectedMatch,setSelectedMatch }) => {

  // Marks for the slider
  const matching = {
    0: 'All Applicants',
    1: 'Good match',
    2: 'Very Good match',
  };

 

  return (
    <div className="w-full max-w-md mx-auto py-4 mt-5 mb-12">
      <h3 className="text-base mb-4">Skill based matching</h3>
      <div className="px-2 w-[86%] mx-auto">
        <Slider
          min={0}
          max={2}
          marks={matching}
          step={null} // Slider stops only at defined marks
          onChange={(value) => setSelectedMatch(value)}
          value={selectedMatch}
          
          className="custom-slider" // Add a custom class for custom CSS styling
        />
      </div>
      
    </div>
  );
};

export default MatchingSlider;

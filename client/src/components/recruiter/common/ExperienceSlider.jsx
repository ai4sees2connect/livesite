import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import '../utilscss/SliderStyles.css'

const ExperienceSlider = ({ expFilter,setExpFilter }) => {

  // Marks for the slider
  const years = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  };

 

  return (
    <div className="w-full max-w-md mx-auto py-4 mt-5">
      <h3 className="text-base mb-4">Minimum work experience (in years)</h3>
      <div className="px-2">
        <Slider
          min={0}
          max={5}
          marks={years}
          step={null} // Slider stops only at defined marks
          onChange={(value) => setExpFilter(value)}
          value={expFilter}
          
          className="custom-slider" // Add a custom class for custom CSS styling
        />
      </div>
      
    </div>
  );
};

export default ExperienceSlider;

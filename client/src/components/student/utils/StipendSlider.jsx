import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../utilscss/SliderStyles.css';

const StipendSlider = ({ initialValue = 0, onChange }) => {
  const [selectedStipend, setSelectedStipend] = useState(initialValue);

  // Sync internal state if parent updates initial value
  useEffect(() => {
    setSelectedStipend(initialValue);
  }, [initialValue]);

  // Marks for the slider
  const marks = {
    0: '0k',
    2000: '2k',
    4000: '4k',
    6000: '6k',
    8000: '8k',
    10000: '10k',
  };

  const handleSliderChange = (value) => {
    setSelectedStipend(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 mt-5">
      <h3 className="text-base mb-4">Select Minimum Stipend</h3>
      <div className="px-2">
        <Slider
          min={0}
          max={10000}
          marks={marks}
          step={null} // Slider stops only at defined marks
          onChange={handleSliderChange}
          value={selectedStipend}
          className="custom-slider" // Custom CSS styling
        />
      </div>
    </div>
  );
};

export default StipendSlider;
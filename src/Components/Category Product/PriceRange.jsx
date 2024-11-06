/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

const PriceRange = ({ minPrice, maxPrice, setPriceRange }) => {
  const handleMinChange = (e) => {
    setPriceRange((prev) => ({ ...prev, min: Math.max(0, parseFloat(e.target.value)) })); // Ensure min is not negative
  };

  const handleMaxChange = (e) => {
    setPriceRange((prev) => ({ ...prev, max: Math.max(prev.min, parseFloat(e.target.value)) })); // Ensure max is not less than min
  };

  return (
    <div className='flex w-full justify-around'>
        <input type="number" value={minPrice} min="0" placeholder='Min Price' onChange={handleMinChange} className='w-[100px] border-gray-600 border h-8 text-lg outline-none text-center' />
        <input type="number" value={maxPrice} placeholder='Max Price' onChange={handleMaxChange} className='w-[100px] border-gray-600 border h-8 text-lg outline-none text-center' />
    </div>
  );
};

export default PriceRange;

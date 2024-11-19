/* eslint-disable react/prop-types */
const PriceRange = ({ minPrice, maxPrice, setPriceRange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: Math.max(name === 'min' ? 0 : prev.min, parseFloat(value) || 0),
    }));
  };

  return (
    <div className='flex w-full justify-around'>
      {['min', 'max'].map((type)=>(
        <input 
        key={type} 
        name={type} 
        type="" 
        value={type === 'min' ? minPrice : maxPrice} 
        placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} price`} 
        onChange={handleChange} 
        className='w-[100px] border-gray-600 border h-8 text-lg outline-none text-center' />
      ))}
    </div>
  );
};

export default PriceRange;

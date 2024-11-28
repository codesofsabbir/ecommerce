/* eslint-disable react/prop-types */
import { useState } from 'react'
import useAxios from '../../../Hooks/useAxios'

function DropDownOption({onFilter}) {
    const {data: categories = []} = useAxios('http://localhost:5001/categories')
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const handleCategoryChange = (e) => {
        const selected = e.target.value
        setSelectedCategory(selected.toLowerCase())
        setSelectedSubCategory("");
        const category = categories.find((cat)=> cat.name === selected);
        setFilteredSubCategories(category?.subcategories || []);
        onFilter(selected, "")
        console.log(selectedCategory)
    }
    const handleSubCategoryChange = (e) => {
        const selected = e.target.value;
        setSelectedSubCategory(selected);
        onFilter(selectedCategory, selected);
    };
  return (

    <>
        <h4 className='text-2xl font-sans'>Filter : </h4>
        <select
          name="Category"
          id="category"
          className="bg-gray-700 py-2 pl-3 rounded-md"
          onChange={handleCategoryChange}
          value={selectedCategory}
        >
          <option value="" disabled>
            Select a Category
          </option>
          {categories?.map((category, id) => (
            <option key={id} value={category.name} >
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="Sub-Category"
          id="sub-category"
          className="bg-gray-700 py-2 pl-3 rounded-md"
          disabled={!selectedCategory} 
          onChange={handleSubCategoryChange}
          value={selectedSubCategory}
        >
          <option value="" disabled>
            Select a Sub-Category
          </option>
          {filteredSubCategories?.map((subCat, id) => (
            <option key={id} value={subCat?.name}>
              {subCat?.name}
            </option>
          ))}
        </select>
      </>
  )
}

export default DropDownOption
/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from "react";
import useAxios from "../../../Hooks/useAxios";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { UserContext } from "../../../Hooks/UserContext";
function ProductsTable({products, loading, error, setViewProductId, setProductModalOpen}) {
	const {data: categories = []} = useAxios('http://localhost:5001/categories')
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredProducts, setFilterdProducts] = useState([])
	const [selectedCategory, setSelectedCategory] = useState("");
	const [filteredSubCategories, setFilteredSubCategories] = useState([]);
	const [selectedSubCategory, setSelectedSubCategory] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
  	const rowsPerPage = 10;
	useEffect(()=>{
		const results = products.filter((product)=> {
			const result = searchTerm.toLowerCase();
			return(
				product?.productName.toLowerCase().includes(result) ||
				product?.category.toLowerCase().includes(result) ||
				product?.subCategory.some((subCat) => subCat.toLowerCase().includes(result))
			)
		});
		const filterResult = selectedSubCategory
        ? results.filter((product) =>
              product?.subCategory.some(
                  (subCat) =>
                      subCat.toLowerCase() === selectedSubCategory.toLowerCase()
              )
          )
        : selectedCategory
        ? results.filter(
              (product) =>
                  product?.category.toLowerCase() ===
                  selectedCategory.toLowerCase()
          )
        : results;


    setFilterdProducts(filterResult);
    console.log("Selected Category:", selectedCategory);
	}, [products, searchTerm, selectedCategory, selectedSubCategory])


	const totalRows = filteredProducts?.length;
	const totalPages = Math.ceil(totalRows / rowsPerPage);
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
	const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	  };

	const handleCategoryChange = (e) => {
        const selected = e.target.value
        setSelectedCategory(selected.toLowerCase())
		setSelectedSubCategory("");
		const category = categories.find((cat) => cat.name.toLowerCase() === selected.toLowerCase());
        setFilteredSubCategories(category?.subcategories || []);
        console.log(selectedCategory)
    }

	const handleSubCategoryChange = (e) => {
        const selected = e.target.value;
        setSelectedSubCategory(selected);
    };

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure you want to delete this product?');
		if(confirmDelete){
			try {
				await axios.delete(`http://localhost:5001/productsInfo/${id}`);
				setFilterdProducts(prevProducts => prevProducts.filter(product => product.id !== id));
			} catch (error) {
				console.error('Error removing product:', error);
			}
		}
	}
	
  return (
	<motion.div
		className='dark:bg-gray-800 bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
		initial={{opacity: 0, y: 20}}
		animate={{ opacity: 1, y: 0}}
		transition={{delay: 0.2}}
	>
		
		<div className='flex justify-between items-center mb-6'>
			<h2 className='text-xl font-semibold dark:text-gray-100 text-[#1E1E1E]'>Product List</h2>
			<div className="flex gap-5">
				<button
					className="flex gap-3 items-center border dark:border-white border-[#1e1e1e] rounded-md px-5 py-2 text-left text-xs font-medium dark:text-gray-400 text-[#1e1e1e] uppercase tracking-wider"
					onClick={() => navigate("/add-product")}
				>
					<Plus color="#10B981" size={18} /> ADD
				</button>
			</div>
		</div>
		<div className='flex justify-center gap-5 items-center mb-6'>
			<select
				name="Category"
				id="category"
				className="bg-gray-700 py-2 pl-3 rounded-md"
				onChange={handleCategoryChange}
				value={selectedCategory}
			>
				<option value="">
					Select a Category
				</option>
				{categories?.map((category) => (
					<option key={category} value={category.name} >
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
				<option value="">
					Select a Sub-Category
				</option>
				{filteredSubCategories?.map((subCat) => (
					<option key={subCat?.id} value={subCat?.id || subCat?.name}>
					{subCat?.name}
					</option>
				))}
			</select>
			<div className="relative">
				<input 
					type="text" 
					placeholder='Search Products...'
					className='dark:bg-gray-700 outline-none bg-gray-400 text-[#1E1E1E] dark:text-white dark:placeholder-gray-400 placeholder:text-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
					onChange={(e)=> setSearchTerm(e.target.value)}
					value={searchTerm}
					name="searchterm"
				/>
				<Search 
					className='absolute left-3 top-2.5 dark:text-gray-400 text-[#1E1E1E]'
					size={18}
				/>
			</div>
		</div>
		{loading ? (
				<p className="text-center py-4 dark:text-gray-300 text-[#1e1e1e]">
					Loading products...
				</p>
			) : error ? (
				<p className="text-center py-4 dark:text-red-400 text-red-600">
					{error}
				</p>
			) : (
				<>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-700">
							<thead>
								<tr>
									{["name", "Category", "Sub Category", "Price", "Stock", "Sales", "Actions"].map(
										(header) =>(
											<th key={header}
												className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1e1e1e] uppercase tracking-wider"
											>
												{header}
											</th>
										)
									)}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{
									paginatedProducts?.map((product)=>(
										<motion.tr
											key={product.id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										>
											<td className="px-6 py-4 whitespace-normal text-sm font-medium dark:text-gray-100 text-[#1E1E1E] flex gap-2 items-center">
													<img src={product?.images[0]} alt="" className="w-10 h-10 rounded-full" />
													<p className="break-words">{product.productName}</p>
												</td>

												<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
													<ul>
														{product?.category}
													</ul>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
													<ul>
														{product?.subCategory?.map((cat, index) => (
															<li key={index} className=" capitalize">{cat}</li>
														))}
													</ul>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
													<span>{product?.productPrice}</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
													{
														product?.variants?.reduce((variantAcc, variant) => {
															const variantStock = variant?.colors?.reduce((colorAcc, color) => {
															return colorAcc + (Number(color?.stock) || 0);
															}, 0);
															return variantAcc + variantStock; 
														}, 0)
													}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
													{
														product?.variants?.reduce((variantAcc, variant) => {
															const variantSold = variant?.colors?.reduce((colorAcc, color) => {
															return colorAcc + (Number(color?.sold) || 0);
															}, 0);
															return variantAcc + variantSold; 
														}, 0)
													}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
												<button
													className="text-indigo-400 hover:text-indigo-300 mr-2"
													// onClick={() => navigate(`/edit-product/${product.id}`)}
												>
													<Edit size={18} />
												</button>
													<button
														className="text-red-400 hover:text-red-300 mr-2"
														onClick={() => handleDelete(product.id)}
													>
														<Trash2 size={18} />
													</button>
													<button>
														<Eye size={18} color="#10B981" onClick={()=>{
															setProductModalOpen(true);
															setViewProductId(product.id)
														}}/>
													</button>
												</td>
										</motion.tr>
									))
								}
							</tbody>
						</table>
					</div>
					<div className="flex justify-between items-center mt-4">
						<span>Showing {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows}</span>
						<div className="border border-gray-500 rounded-md">
							<button
								className={`px-3 py-1 ${
									currentPage === 1
									? "cursor-not-allowed opacity-50"
									: "hover:bg-gray-200 dark:hover:bg-gray-600"
								}`}
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
							>
								Previous
							</button>
							{pageNumbers.map((number, index) => {
								const isFirstFew = index < 3;
								const isLastFew = index >= totalPages - 3;
								const isNearCurrent = Math.abs(currentPage - number) <= 1;

								if (isFirstFew || isLastFew || isNearCurrent) {
									return (
										<button
											key={number}
											className={`px-3 py-1 border-l border-gray-500 ${
												currentPage === number
													? "bg-gray-600 text-white"
													: "hover:bg-gray-200 dark:hover:bg-gray-600"
											}`}
											onClick={() => handlePageChange(number)}
										>
											{number}
										</button>
									);
								}

								if (
									(index === 3 && !isNearCurrent && currentPage > 3) ||
									(index === totalPages - 4 && !isNearCurrent && currentPage < totalPages - 3)
								) {
									return (
										<span
											key={`ellipsis-${index}`}
											className="px-3 py-1 border-l border-gray-500 select-none"
										>
											...
										</span>
									);
								}

								return null;
							})}
							<button
								className={`px-3 py-1 border-l border-gray-500  ${
									currentPage === totalPages
									? "cursor-not-allowed opacity-50"
									: "hover:bg-gray-200 dark:hover:bg-gray-600"
								}`}
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								Next
							</button>
						</div>
					</div>
			  	</>
			)}
	</motion.div>
  )
}

export default ProductsTable
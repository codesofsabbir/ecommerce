import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const ProductEntryForm = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    productPrice: "",
    discountStatus: false,
    productDiscountAmount: "",
    brand: "",
    category: "",
    subCategory: [],
    variants: [],
    keyFeatures: [],
    images: [],
  });

  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5001/categories");
        const data = await response.json();
        setCategoriesData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true)
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
    setUploading(false)
    
  };

  const validateForm = () => {
    if (!formData.productName || !formData.productCode || !formData.productPrice) {
      alert("Please fill in all required fields.");
      return false;
    }
    return true;
  };
  const addKeyFeature = () => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, ""],
    }));
  };

  // Handle changes in key features
  const handleKeyFeatureChange = (index, value) => {
    const newKeyFeatures = [...formData.keyFeatures];
    newKeyFeatures[index] = value;
    setFormData((prev) => ({ ...prev, keyFeatures: newKeyFeatures }));
  };

  // Remove a key feature
  const removeKeyFeature = (index) => {
    const newKeyFeatures = formData.keyFeatures.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, keyFeatures: newKeyFeatures }));
  };


  // Add a new variant
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { type: "", colors: [{ color: "", stock: "", sold: 0 }] },
      ],
    }));
  };

  // Add a color to a specific variant
  const addColor = (variantIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].colors.push({ color: "", stock: "", sold: 0 });
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  // Handle changes in top-level fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, 
      [field]: 
            field === "productPrice" || field === "productDiscountAmount"
            ? parseFloat(value) || 0
            : value,
    }));
  };

  // Handle changes in variant fields
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  // Handle changes in color fields
  const handleColorChange = (variantIndex, colorIndex, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].colors[colorIndex][field] = field === "stock" ? parseInt(value, 10) || 0 : value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const { images } = formData;
    if (!images || images.length === 0) {
      alert("Please select images to upload!");
      return;
    }
    try {
      setUploading(true);
      const uploadedImages = await Promise.all(
        images.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append("image", file);
          const response = await axios.post(
            "https://api.imgbb.com/1/upload?key=de8324250d0b85384622d76aa6c1076b",
            uploadFormData
          );
          return response.data.data.url;
        })
      );
      const productData = {
        ...formData,
        id: uuidv4(),
        rating: 5,
        images: uploadedImages,
      };
  
      const response = await axios.post("http://localhost:5001/productsInfo", productData);

        alert("Product successfully submitted!");
        setFormData({
          productName: "",
          productCode: "",
          productPrice: "",
          discountStatus: false,
          productDiscountAmount: "",
          category: "",
          subCategory: [],
          variants: [],
          brand: "",
          keyFeatures: [],
          images: [],
        });
      
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Failed to submit product. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  

 

  return (
    <form
      className="bg-gray-900 text-white p-6 rounded-lg shadow-md max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

      {/* Product Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <input
          type="text"
          value={formData.productName}
          onChange={(e) => handleInputChange("productName", e.target.value)}
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Code and productPrice */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Product Code</label>
          <input
            type="text"
            value={formData.productCode}
            onChange={(e) => handleInputChange("productCode", e.target.value)}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="number"
            value={formData.productPrice}
            onChange={(e) => handleInputChange("productPrice", e.target.value)}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Discount Toggle */}
      <div className="flex items-center mb-6">
        <label className="text-sm font-medium mr-2">Discount</label>
        <input
          type="checkbox"
          checked={formData.discountStatus}
          onChange={(e) => handleInputChange("discountStatus", e.target.checked)}
          className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
        />
      </div>

      {/* Discount Amount */}
      {formData.discountStatus && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Discount Amount
          </label>
          <input
            type="number"
            value={formData.productDiscountAmount}
            onChange={(e) =>
              handleInputChange("productDiscountAmount", e.target.value)
            }
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Category</label>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <select
            value={formData.category}
            onChange={(e) => {
              handleInputChange("category", e.target.value);
              // handleInputChange("subcategories", []);
            }}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categoriesData.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>


      {formData.category && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Subcategories</label>
          <div className="flex flex-wrap gap-2">
            {categoriesData
              .find((cat) => cat.name === formData.category)
              ?.subcategories.map((subcat) => (
                <label key={subcat.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.subCategory.includes(subcat.name)}
                    onChange={(e) => {
                      const selected = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        subCategory: selected
                          ? [...prev.subCategory, subcat.name]
                          : prev.subCategory.filter((sc) => sc !== subcat.name),
                      }));
                    }}
                    className="mr-2"
                  />
                  {subcat.name}
                </label>
              ))}
          </div>
        </div>
      )}

      {/* Brand */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Brand</label>
        <input
          type="text"
          value={formData.brand}
          onChange={(e) => handleInputChange("brand", e.target.value)}
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Key Features */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Key Features</label>
        {formData.keyFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleKeyFeatureChange(index, e.target.value)}
              placeholder={`Feature ${index + 1}`}
              className="flex-1 p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeKeyFeature(index)}
              className="px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addKeyFeature}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          + Add Feature
        </button>
      </div>

      {/* Variants */}
      <div id="variantSection" className="mb-6">
        <label className="block text-sm font-medium mb-2">Variants</label>
        {formData.variants.map((variant, index) => (
          <div key={index} className="p-4 bg-gray-800 rounded-md mb-4">
            <input
              type="text"
              placeholder="Type"
              value={variant.type}
              onChange={(e) =>
                handleVariantChange(index, "type", e.target.value)
              }
              className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            {variant.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Color"
                  value={color.color}
                  onChange={(e) =>
                    handleColorChange(index, colorIndex, "color", e.target.value)
                  }
                  className="flex-1 p-2 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={color.stock}
                  onChange={(e) =>
                    handleColorChange(index, colorIndex, "stock", e.target.value)
                  }
                  className="flex-1 p-2 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => addColor(index)}
            >
              + Add Color
            </button>
          </div>
        ))}
        <button
          type="button"
          className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={addVariant}
        >
          + Add Variant
        </button>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Upload Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImageUpload(e)}
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none"
        />
        {uploading && <p className="text-blue-500 mt-2">Uploading images...</p>}
      </div>

      {/* Image Preview */}
      {formData.images.length > 0 && (
  <div className="mb-6">
    <label className="block text-sm font-medium mb-2">Preview Images</label>
    <div className="flex gap-2 flex-wrap">
      {formData.images.map((file, index) => (
        <div key={index} className="w-24 h-24 bg-gray-800 rounded-md overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt={`Uploaded ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  </div>
)}



      {/* Submit */}
      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Save Product
        </button>
      </div>
    </form>
  );
};

export default ProductEntryForm;

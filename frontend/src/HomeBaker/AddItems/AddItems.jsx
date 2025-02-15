import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";

const AddItems = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "cake",
  });

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);

    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
        }
      );

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "cake",
        });
        setImage(null);
        toast.success("Product Added Successfully");
      } else {
        toast.success("Product Added Successfully");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Image
          </label>
          <div className="relative">
            <label
              htmlFor="image"
              className="block w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 
                       transition-colors duration-200 cursor-pointer bg-gray-50 overflow-hidden"
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                </div>
              )}
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              className="hidden"
              required
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58231f] 
                         focus:border-transparent transition-colors duration-200"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-0.5">
                Description
              </label>
              <textarea
                name="description"
                value={data.description}
                onChange={onChangeHandler}
                rows="3" // reduced the rows to 3
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58231f] 
             focus:border-transparent transition-colors duration-200 resize-none"
                placeholder="Enter product description"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <select
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58231f] 
                         focus:border-transparent transition-colors duration-200"
                required
              >
                <option value="cake">Cake</option>
                <option value="cupcake">Cup Cake</option>
                <option value="donat">Donuts</option>
                <option value="macroon">Macaroons</option>
                <option value="waffel">Waffles</option>
                <option value="choclate">Chocolate</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price (Rs.)
              </label>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={onChangeHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58231f] 
                         focus:border-transparent transition-colors duration-200"
                placeholder="Enter price"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
  type="submit"
  disabled={isLoading}
  className="w-full md:w-auto px-8 py-3 bg-[#58231f] text-white rounded-lg hover:bg-[#58231f]/90 
           transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isLoading ? "Adding Product..." : "Add Product"}
</button>
      </form>
    </div>
  );
};

export default AddItems;
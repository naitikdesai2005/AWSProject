import React, { useEffect, useState } from "react";
import Product from "../Product/Product";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner"; // Import the loader

const ProductDisplay = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const url = "http://localhost:3000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/api/user/getallitem`);
        if (response.data.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleProducts((prevVisible) => prevVisible + 8);
      setLoadingMore(false);
    }, 1500);
  };

  // Handle scroll event for automatic loading
  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop === 0 && visibleProducts < products.length && !loadingMore) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visibleProducts, loadingMore, products.length]);

  return (
    <div className="mt-8 mb-5" id="product-display">
      {loading ? (
        <div className="flex justify-center items-center mt-8">
          <RotatingLines
            strokeColor="#f79c3e"
            strokeWidth="5"
            animationDuration="0.75"
            width="60"
            visible={true}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-screen-xl mx-auto mt-5">
          {products.slice(0, visibleProducts).map((item, index) => {
            if (category === "All" || category === item.category) {
              return (
                <Product
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            }
            return null;
          })}
        </div>
      )}

      {visibleProducts < products.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className={`px-6 py-2 ${
              loadingMore ? "bg-white" : "bg-[#f79c3e]"
            } text-white font-semibold rounded-lg transition duration-600`}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <RotatingLines
                strokeColor="#f79c3e"
                strokeWidth="5"
                animationDuration="0.75"
                width="30"
                visible={true}
              />
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;

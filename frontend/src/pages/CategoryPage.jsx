import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const CategoryPage = () => {
  const { category } = useParams(); // Get the category ID from the URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products for the selected category
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/products/category/${category}`
        );
        setProducts(response.data.data); // Assuming the API returns products in data field
      } catch (error) {
        setError("Error fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {loading && <div>Loading products...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="px-20 py-10">
            <h1 className="text-2xl font-bold mb-4">
              Products in this category
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
              {products.length > 0 ? (
                products.map((product) => (
                  <NavLink to={`/product/${product._id}`}>
                    <div
                      key={product._id}
                      className=" border cursor-pointer bg-white dark:bg-gray-900 hover:shadow-xl duration-300 transition-all rounded-lg overflow-hidden my-4"
                    >
                      <img
                        src={product.images[0]?.url} // Assuming products have an images array
                        alt={product.name}
                        className="w-full h-64 mb-4 rounded-t"
                      />
                      <div className="px-2">
                        <h3 className="text-lg font-bold mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-700">
                          {product.shortDescription}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-md">
                            ₹{product.variants[0]?.price}
                          </p>
                          <p className="text-sm instrument-sans line-through px-3 bg-[#1f1f1f] text-white rounded-lg">
                            ₹{product.variants[0]?.costPrice || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                ))
              ) : (
                <div className="text-gray-500">
                  No products found for this category.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;

import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import axios from "axios";
import { StarIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Layout from "../components/Layout/Layout";
import toast from "react-hot-toast";

// Define a mapping between color names and Tailwind CSS color classes
const colorClassMap = {
  Red: "bg-red-500",
  Blue: "bg-blue-500",
  Green: "bg-green-500",
  Yellow: "bg-yellow-500",
  Pink: "bg-pink-500",
  Black: "bg-black",
  White: "bg-white border",
  Gray: "bg-gray-500",
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description"); // Track active tab

  const { addToCart } = useCart();

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`https://ecom-app-mtio.onrender.com/api/products/${id}`);
      if (data.success) {
        setProduct(data.product);
        setSelectedImage(data.product.images?.[0]?.url || "");
        fetchSimilarProducts(data.product._id);
      }
      console.log(product.variants);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async (productId) => {
    try {
      const { data } = await axios.get(`https://ecom-app-mtio.onrender.com/api/products/similar/${productId}`);
      if (data.status) {
        setSimilarProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    // Find the selected variant based on the color and size (compare name if color and size are objects)
    const selectedVariant = product.variants?.find(
      (variant) =>
        variant.color._id === selectedColor && variant.size._id === selectedSize
    );

    // Check if the selected variant exists
    if (!selectedVariant) {
      toast.error("This color and size combination is not available.");
      return;
    }
    console.log(selectedVariant);
    // Add to cart if the variant exists
    addToCart(
      product,
      quantity,
      selectedColor,
      selectedSize,
      selectedVariant.price
    );

    toast.success("Item added to cart!");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  // Extract unique colors with their IDs from product variants
  const availableColors = [
    ...new Map(
      product.variants?.map((variant) => [variant.color._id, variant.color])
    ).values(),
  ];

  // Extract unique sizes with their IDs from product variants
  const availableSizes = [
    ...new Map(
      product.variants?.map((variant) => [variant.size._id, variant.size])
    ).values(),
  ];
    // Debugging: Check if available colors and sizes are being extracted
  console.log("Available Colors:", availableColors);
  console.log("Available Sizes:", availableSizes);

  return (
    <Layout>
      <div className="container mx-auto lg:px-44 lg:py-10 py-4 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left - Product Image */}
        <div>
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Product"
                className="w-full h-96 object-contain rounded-md"
              />
            )}
          </div>

          <div className="flex mt-4 space-x-3">
            {product.images?.length > 0 ? (
              product.images.map((image, idx) => (
                <img
                  key={idx}
                  onClick={() => handleImageClick(image.url)}
                  src={image.url}
                  alt={`Thumbnail ${idx}`}
                  className={`w-16 h-16 rounded-md cursor-pointer ${
                    selectedImage === image.url ? "ring-2 ring-black" : ""
                  }`}
                />
              ))
            ) : (
              <span>No images available</span>
            )}
          </div>
        </div>

        {/* Right - Product Details */}
        <div>
          <h1 className="text-4xl instrument-sans mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="text-yellow-500 w-5 h-5" />
            ))}
            <p className="text-sm text-gray-500">(1,234 reviews)</p>
          </div>

          {/* Price */}
          <div className="flex gap-4 mb-6">
            <span className="text-2xl instrument-sans">
              ${product.variants?.[0]?.price || product.price}
            </span>

            <p className="text-md instrument-sans line-through mt-2">
              ${product.variants[0]?.costPrice || "N/A"}
            </p>
            {/* Calculate and show discount if costPrice is greater than the price */}
            {product.variants?.[0]?.costPrice >
              product.variants?.[0]?.price && (
              <p className="text-md bg-[#D2EF9A] px-1 py-1 mt-1 rounded-lg">
                Save $
                {(
                  product.variants[0]?.costPrice -
                  product.variants[0]?.price
                ).toFixed(2)}{" "}
                (
                {(
                  ((product.variants[0]?.costPrice -
                    product.variants[0]?.price) /
                    product.variants[0]?.costPrice) *
                  100
                ).toFixed(0)}
                % Off)
              </p>
            )}
          </div>

          {/* Product Description */}
          <p className="text-gray-500 instrument-sans dark:text-white mb-6">
            {product.shortDescription}
          </p>

          {/* Colors */}
          <div className="mb-6">
            <h4 className="text-sm instrument-sans mb-2">Colors:</h4>
            <div className="flex space-x-4">
              {availableColors.length > 0 ? (
                availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color._id)} // Save the _id when color is selected
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color._id ? "ring-2 ring-black" : ""
                    } ${colorClassMap[color.name] || "bg-gray-300"}`}
                  ></button>
                ))
              ) : (
                <span>No colors available</span>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <h4 className="text-sm instrument-sans mb-2">Size:</h4>
            <div className="flex space-x-3">
              {availableSizes.length > 0 ? (
                availableSizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size._id)} // Save the _id when size is selected
                    className={`px-3 py-2 border rounded-md text-sm ${
                      selectedSize === size._id ? "border-black" : ""
                    }`}
                  >
                    {size.name} {/* Display size name */}
                  </button>
                ))
              ) : (
                <span>No sizes available</span>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">Quantity:</h4>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDecrement}
                className="p-2 border rounded-md"
              >
                <MinusIcon className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 border rounded-md">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-2 border rounded-md"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-6 flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="w-full px-5 py-3 bg-black text-white rounded-md"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full px-5 py-3 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              Buy it Now
            </button>
          </div>
        </div>
      </div>

      {/* Custom Tabs Section */}
      <div className="container mx-auto lg:px-44 lg:py-10 px-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md ${
                activeTab === "description"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500  dark:text-white hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md ${
                activeTab === "details"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 dark:text-white hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Product Details
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md ${
                activeTab === "reviews"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 dark:text-white hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </nav>
        </div>

        <div className="mt-4">
          {activeTab === "description" && (
            <div className=" rounded-md">
              <h3 className="text-lg instrument-sans">Description</h3>
              <p className="mt-4 text-gray-600 dark:text-white">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "details" && (
            <div className=" rounded-md">
              <h3 className="text-lg instrument-sans">Product Details</h3>
              <ul className="mt-4 list-disc list-inside text-gray-600 dark:text-white">
                <li>Price: ₹{product.variants?.[0]?.price || product.price}</li>
                <li>
                  Stock Quantity: {product.variants?.[0]?.quantity || "N/A"}
                </li>
                <li>Size: {selectedSize || "N/A"}</li>
                <li>Color: {selectedColor || "N/A"}</li>
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className=" rounded-md">
              <h3 className="text-lg instrument-sans">Reviews</h3>
              <p className="mt-4 text-gray-600 dark:text-white">
                {/* Add review components here or integrate with review API */}
                Customer reviews go here...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="py-10 lg:px-44 px-4">
        <h2 className="text-3xl instrument-sans mb-6">Similar Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProducts?.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <NavLink
                to={`/product/${similarProduct._id}`}
                key={similarProduct._id}
              >
                <div className="rounded-lg">
                  <img
                    src={similarProduct.images?.[0]?.url || ""}
                    alt={similarProduct.name}
                    className="w-full h-56 rounded-t-md mb-4"
                  />
                  <div className="ml-2">
                    <h3 className="text-xl instrument-sans">
                      {similarProduct.name}
                    </h3>
                    <div className="flex gap-2">
                      <p className="text-gray-600 mt-1 dark:text-white">
                        ${similarProduct.variants?.[0]?.price || "N/A"}
                      </p>
                      <p className="text-md instrument-sans mt-1 line-through  rounded-lg">
                        ${similarProduct.variants[0]?.costPrice || "N/A"}
                      </p>
                      {/* Calculate and show discount if costPrice is greater than the price */}
                      {similarProduct.variants?.[0]?.costPrice >
                        similarProduct.variants?.[0]?.price && (
                        <p className="text-sm bg-[#D2EF9A] px-1 py-1 rounded-lg">
                          Save $
                          {(
                            similarProduct.variants[0]?.costPrice -
                            similarProduct.variants[0]?.price
                          ).toFixed(2)}{" "}
                          (
                          {(
                            ((similarProduct.variants[0]?.costPrice -
                              similarProduct.variants[0]?.price) /
                              similarProduct.variants[0]?.costPrice) *
                            100
                          ).toFixed(0)}
                          % Off)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <p>No similar products available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;

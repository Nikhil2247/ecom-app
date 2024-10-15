import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import from react-redux
import { showProduct } from "../redux/features/productSlice"; // Import your fetch action
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const NewArrival = () => {
  const dispatch = useDispatch();
  const productsRef = useRef([]);
  const textRef = useRef([]);

  // Safely access products, loading, and error using optional chaining
  const {
    productDetail = [],
    loading,
    error,
  } = useSelector((state) => state.product);

  // Fetch products when the component mounts
  useEffect(() => {
    dispatch(showProduct());
  }, [dispatch]);

  // Debug: Log the fetched product details to ensure correct data is being fetched
  useEffect(() => {
    console.log("Product Details:", productDetail); // Check the structure of productDetail
  }, [productDetail]);

  // New Arrivals
  // Ensure productDetail is an array and filter products
  const newArrivalProducts = Array.isArray(productDetail)
    ? productDetail.filter((product) => {
        const categories = product?.category || [];
        if (!Array.isArray(categories)) return false; // Ensure categories is an array
        return categories.some((cat) => cat.slug === "new-arrivals");
      })
    : [];
  // Animate products on scroll using GSAP and ScrollTrigger
  // Animate products on scroll using GSAP and ScrollTrigger with Timeline
  useEffect(() => {
    if (productsRef.current.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: productsRef.current[0],
          end: "top 10%",
          scrub: 2,
          once: true,
        },
      });

      productsRef.current.forEach((el, index) => {
        if (el) {
          tl.fromTo(
            el,
            {
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            },
         
          );
        }
      });
    }
  }, [newArrivalProducts]);

  // GSAP animation for "New Arrivals" text
  useEffect(() => {
    gsap.fromTo(
      textRef.current.filter(Boolean), // Filter out any null refs
      { opacity: 0, y: 50 }, // Initial state
      {
        opacity: 1,
        y: 0,
        stagger: 0.2, // Stagger the animation of each word
        ease: "power3.out",
        duration: 1.5,
        scrollTrigger: {
          trigger: textRef.current[0], // Trigger when the first word enters the viewport
          // start: "top 90%", // Animation starts when top of the element hits 90% of the viewport
          end: "top 10%", // Animation ends when the bottom hits 20%
          once: true,
          scrub: 2, // Sync with scroll
          markers: false, // Set to `true` to see the trigger markers (useful for debugging)
        },
      }
    );
  }, []);

  return (
    <div className="dark:bg-gray-900">
      <div className="px-4 lg:px-16">
        <div className="flex gap-5 ">
          <h2 className="text-5xl instrument-sans">
            {["N", "e", "w", "A", "r", "r", "i", "v", "a", "l", "s"].map(
              (word, index) => (
                <span
                  key={index}
                  className="inline-block mr-2" // Separate the words
                  ref={(el) => (textRef.current[index] = el)} // Add ref for each word
                >
                  {word}
                </span>
              )
            )}
          </h2>
          <NavLink
            to={"/all-products"}
            className="mt-6 text-sm instrument-sans underline hover:text-[#1f1f1f]"
          >
            SEE ALL COLLECTIONS
          </NavLink>
        </div>

        {/* Show Loading Indicator */}
        {loading && <div className="text-center">Loading...</div>}

        {/* Show Error Message
        {error && (
          <div className="text-center text-red-500">
            {error.message || "Something went wrong!"}
          </div>
        )} */}

        {/* No products found */}
       {!loading && newArrivalProducts.length === 0 && (
          <p className="text-center">No New Arrivals Found</p>
        )}

        {/* Show products if they are loaded */}
        {!loading && newArrivalProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 ">
            {newArrivalProducts.map((product, index) => (
              <NavLink
                key={product._id} // Ensure correct key
                to={`/product/${product._id}`}
                className="group"
                ref={(el) => (productsRef.current[index] = el)}
              >
                <div className="w-full relative overflow-hidden">
                  <span className="absolute top-2 left-2 bg-[#D2EF9A] text-sm px-2 py-1 rounded-full">
                    {product.sale || "N/A"}
                  </span>
                  <img
                    alt={`https://ecom-app-mtio.onrender.com/uploads/${product.name || "Product Image"}`} // Fallback to product name
                    src={
                      product.images[0]?.url ||
                      "https://via.placeholder.com/150"
                    } // Fallback image
                    className="h-72 w-full  object-center"
                  />
                </div>
                <div className="px-2">
                  <h3 className="mt-4 text-lg instrument-sans">
                    {product.name}
                  </h3>
                  <div className="flex gap-2">
                    <p className="text-md mt-1">
                      ${product.variants[0]?.price}
                    </p>
                    <p className="text-md mt-1 instrument-sans line-through ">
                      ${product.variants[0]?.costPrice || "N/A"}
                    </p>
                    {/* Calculate and show discount if costPrice is greater than the price */}
                    {product.variants?.[0]?.costPrice >
                      product.variants?.[0]?.price && (
                      <p className="text-md bg-[#D2EF9A] px-1 py-1 rounded-lg">
                        {(
                          ((product.variants[0]?.costPrice -
                            product.variants[0]?.price) /
                            product.variants[0]?.costPrice) *
                          100
                        ).toFixed(0)}
                        % Off
                      </p>
                    )}
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrival;

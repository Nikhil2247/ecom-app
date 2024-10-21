import React from "react";
import Layout from "../components/Layout/Layout";
import { NavLink } from "react-router-dom";
import "animate.css";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  PhoneArrowDownLeftIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import HeroSection from "../components/Carousal";
import CategoryCarousal from "../components/CategoryCarousal";
import ProductTabs from "../components/ProductTab";
import ReviewCarousel from "../components/ReviewCarousal";
import ReviewModal from "../components/ReviewModal";
import BestSelling from "../components/BestSellingProduct";
import SizesComponent from "../components/GetSize";
import NewArrival from "../components/NewArrivalProduct";
import ProductCarousal from "../components/ProductCarousal";
import ProductSearch from "../components/ProductSearch";
import Marquee from "../components/Marquee";

const Home = () => {
  return (
    <>
      <Layout>
        {/* <ProductSearch/> */}
        {/**hero section */}
        <HeroSection />

        {/**Category Carousal */}
        <div className="pt-10 lg:px-20">
          <CategoryCarousal />
        </div>

        <div class="grid grid-cols-3 gap-4 p-8 bg-black text-center">
          <div class="flex flex-col items-center p-6 bg-gray-900">
           
            <h3 class="mt-4 text-lg font-semibold text-yellow-200">
              Excellence Fabrics
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              Bibendum arcu vitae elementum curtur vitae nunc purus gravida qui.
            </p>
          </div>

          <div class="flex flex-col items-center p-6 bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12 text-yellow-200"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 7.5v9M8.25 12h7.5M21 5.25a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v13.5a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V5.25z"
              />
            </svg>
            <h3 class="mt-4 text-lg font-semibold text-yellow-200">
              Made With Care
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              Commodo ulper a lacus vestibulum sed arcu non odio est.
            </p>
          </div>

          <div class="flex flex-col items-center p-6 bg-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12 text-yellow-200"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 15.75l1.5-1.5m1.5-3.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM19.5 19.5H4.5a.75.75 0 01-.75-.75V9A4.5 4.5 0 019 4.5h6A4.5 4.5 0 0119.5 9v9.75a.75.75 0 01-.75.75z"
              />
            </svg>
            <h3 class="mt-4 text-lg font-semibold text-yellow-200">
              Save Money
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              Aliquam malesuada bibendum arcu vitae elementum curabitur.
            </p>
          </div>

          <div class="flex flex-col items-center p-6 bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12 text-yellow-200"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.375 4.5h17.25M9.75 4.5v15a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-15a.75.75 0 00-.75-.75H3.375A1.125 1.125 0 002.25 4.5v15a1.125 1.125 0 001.125 1.125H18a1.125 1.125 0 001.125-1.125v-15A1.125 1.125 0 0018 3.375h-3a.75.75 0 01-.75.75H9.75zM15.75 4.5v15"
              />
            </svg>
            <h3 class="mt-4 text-lg font-semibold text-yellow-200">
              Perfection Cut
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              Viverra nibh cras pulvinar mattis dignissim convallis.
            </p>
          </div>

          <div class="flex flex-col items-center p-6 bg-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12 text-yellow-200"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.25 6.75v5.25h13.5V6.75M4.5 7.5v10.5m0 0h15v-10.5m-15 10.5V18m0 0v.75m15-.75V18m0 0v.75m-15-.75H4.125M19.875 18h-.375M4.5 18h-.375"
              />
            </svg>
            <h3 class="mt-4 text-lg font-semibold text-yellow-200">
              Tailored Fit
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              Woven into each piece for ultimate comfort and style.
            </p>
          </div>
        </div>

        <div className="pt-20">
          {" "}
          <Marquee />
        </div>

        {/**Best Selling */}
        <div className="pt-20">
          <NewArrival />
        </div>

        <div class="container mx-auto lg:px-32 px-4 pt-20 mb-20">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="relative overflow-hidden rounded-lg group">
              <img
                src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbanner%2F10.png&w=640&q=75"
                alt="Women's Fashion"
                class="w-full h-48  transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 px-4 py-12">
                <h2 class="text-xl font-semibold instrument-sans text-black">
                  Women's Fashion <br /> Must-Haves
                </h2>
                <a
                  href="#"
                  class="inline-block mt-2 text-md underline text-black hover:text-gray-800"
                >
                  Shop Now
                </a>
              </div>
            </div>

            <div class="relative overflow-hidden rounded-lg group ">
              <img
                src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbanner%2F11.png&w=640&q=75"
                alt="Men's Fashion"
                class="w-full h-48  transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 px-4 py-12">
                <h2 class="text-xl font-semibold instrument-sans text-black">
                  Latest Men's <br /> Fashion Essentials
                </h2>
                <a
                  href="#"
                  class="inline-block mt-2 text-md underline text-black hover:text-gray-800"
                >
                  Shop Now
                </a>
              </div>
            </div>

            <div class="relative overflow-hidden rounded-lg group">
              <img
                src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbanner%2F12.png&w=640&q=75"
                alt="Summer Sale"
                class="w-full h-48  transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 px-4 py-12">
                <h2 class="text-xl font-semibold instrument-sans text-black">
                  Summer Sale <br /> Collection
                </h2>
                <a
                  href="#"
                  class="inline-block mt-2 text-md underline text-black hover:text-gray-800"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* <div>
          <ProductCarousal />
        </div> */}

        <div
          className="bg-fixed h-[400px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://charlotte-fashion-1.myshopify.com/cdn/shop/files/bg2.jpg?v=1721313899')`,
          }}
        ></div>
        {/**category wise filter */}
        <div className="pt-20 px-4">
          <ProductTabs />
        </div>

        {/** new arrivals */}
        <div className="pt-20">
          <BestSelling />
        </div>

        {/** offers section */}
        <div class="container mx-auto px-4 pt-20">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="relative overflow-hidden rounded-lg shadow-md">
              <img
                src="https://cdn.midjourney.com/ecbd71d3-53be-44e8-8b15-15c3c7adedc2/0_1.png"
                alt="Best Sellers"
                class="w-full h-96 object-cover"
              />
              <div class="absolute inset-0 flex items-center justify-center ">
                <div class="text-center text-white">
                  <h2 class="text-3xl instrument-sans">Best Sellers</h2>
                  <a
                    href="#"
                    class="mt-4 inline-block text-lg font-medium underline"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>

            <div class="relative overflow-hidden rounded-lg shadow-md">
              <img
                src="https://cdn.midjourney.com/ecbd71d3-53be-44e8-8b15-15c3c7adedc2/0_2.png"
                alt="New Arrivals"
                class="w-full h-96 object-cover"
              />
              <div class="absolute inset-0 flex items-center justify-center ">
                <div class="text-center text-white">
                  <h2 class="text-3xl instrument-sans ">New Arrivals</h2>
                  <a
                    href="#"
                    class="mt-4 inline-block text-lg font-medium underline"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/**Review Section */}
        <div className="bg-[#F7F7F7] dark:bg-gray-900 lg:px-10 mt-5 py-20">
          <div>
            <h1 className="text-3xl text-center instrument-sans uppercase font-semibold ">
              What People Are Saying
            </h1>
          </div>

          <ReviewCarousel />
          <div className="mt-5">
            <ReviewModal />
          </div>
        </div>

        {/**about */}
        <div className="grid lg:grid-cols-3 grid-cols-1  bg-white dark:bg-gray-900 pt-20 mb-10 px-5 gap-5">
          <div className="flex">
            <CurrencyDollarIcon class="h-10 w-20 mt-10 mr-5 lg:ml-6 dark:text-white text-gray-800" />
            <div>
              {" "}
              <h3 className="text-lg lg:text-xl instrument-sans mt-6">
                Guarented Savings
              </h3>
              <p className="text-gray-400 font-light">
                If you don’t make your membership fee in savings, we’ll refund
                the difference
              </p>
            </div>
          </div>
          <div className="flex">
            <TruckIcon class="h-10 w-20 mt-10 mr-5  dark:text-white text-gray-800" />
            <div>
              {" "}
              <h3 className="text-lg lg:text-xl instrument-sans mt-6">
                Super Fast Delivery
              </h3>
              <p className="text-gray-400 font-light">
                If you don’t make your membership fee in savings, we’ll refund
                the difference
              </p>
            </div>
          </div>
          <div className="flex">
            <PhoneArrowDownLeftIcon class="h-10 w-20 mt-10 mr-4  dark:text-white text-gray-800" />
            <div>
              {" "}
              <h3 className="text-lg lg:text-xl instrument-sans mt-6">
                Friendly Support
              </h3>
              <p className="text-gray-400 font-light">
                Contact us anytime 24/7 hours and we will answer every query
              </p>
            </div>
          </div>
        </div>

        {/* * brands section
        <div className="grid lg:grid-cols-6 grid-cols-3 gap-x-10 gap-y-4 lg:ml-20 lg:px-0 px-8 py-10 ">
          <div className="">
            <img
              src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbrand%2F1.png&w=384&q=75"
              alt=""
              className="lg:h-8 h-5"
            />
          </div>
          <div className="">
            <img
              src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbrand%2F2.png&w=384&q=75"
              alt=""
              className="lg:h-8 h-5"
            />
          </div>
          <div className="">
            <img
              src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbrand%2F3.png&w=384&q=75"
              alt=""
              className="lg:h-8 h-5"
            />
          </div>
          <div className="">
            <img
              src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbrand%2F4.png&w=384&q=75"
              alt=""
              className="lg:h-8 h-5"
            />
          </div>
          <div className="">
            <img
              src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbrand%2F5.png&w=384&q=75"
              alt=""
              className="lg:h-8 h-5"
            />
          </div>
          <div className="">
            <img
              src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fbrand%2F6.png&w=384&q=75"
              alt=""
              className="lg:h-8 h-5"
            />
          </div>
        </div> */}

        {/* 
        <div>
          <SizesComponent />
        </div> */}
      </Layout>
    </>
  );
};

export default Home;

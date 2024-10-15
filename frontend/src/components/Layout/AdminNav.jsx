import React from "react";
import { useAuth } from "../../context/auth"; // Import the custom hook to access auth state

const AdminNav = ({ toggleTheme, currentTheme, breadcrumbTitle }) => {
  const { auth } = useAuth(); 


  return (
    <nav className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Left side - Dynamic Breadcrumb or title */}
      <div className="text-xl font-bold">
        {breadcrumbTitle} {/* Display dynamic breadcrumb title */}
      </div>

      {/* Right side - Admin name and theme toggler */}
      <div className="flex items-center space-x-4">
        {/* Admin Name */}
        <span className="font-medium uppercase text-xl">
          {auth?.user?.username}
        </span>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
        >
          {currentTheme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </nav>
  );
};

export default AdminNav;

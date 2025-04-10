import React, { useEffect, useState } from "react";

// This component shows categories for filtering stores, with a dropdown on phones and dark mode support
const Categories = ({ className, updateCategory, isDarkMode }) => {
  // Keeps track of the categories from the server, starts empty
  const [categories, setCategories] = useState([]);
  // Tracks which category the user picked, starts as null (no selection)
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Controls whether the dropdown is open or closed on phones, starts closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetches all categories from the server when the component loads
  const fetchCategories = async () => {
    try {
      // Get categories from the API
      const res = await fetch("http://localhost:3001/categories");
      const data = await res.json();
      // Save the categories to state
      setCategories(data);
    } catch (err) {
      // Show error if something goes wrong
      console.error("Failed to fetch categories", err);
    }
  };

  // Run fetchCategories once when the component loads
  useEffect(() => {
    fetchCategories();
  }, []); // Empty array means it runs only once

  // When a category is clicked
  const handleCategoryClick = (catId) => {
    // Scroll to the top of the page smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Mark this category as selected
    setSelectedCategory(catId);
    // Tell the parent (App.js) which category was picked
    updateCategory(catId);
    // Close the dropdown on phones after picking
    setIsDropdownOpen(false);
  };

  // When the Clear button is clicked for the selected category
  const handleClearCategory = (e) => {
    e.stopPropagation(); // Stop this click from triggering other actions
    // Scroll to the top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Remove the selected category
    setSelectedCategory(null);
    // Tell the parent to clear the category filter
    updateCategory(null);
  };

  // When the Clear All Filters button is clicked (same as clear category for now)
  const handleClearAll = () => {
    // Scroll to the top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Remove the selected category
    setSelectedCategory(null);
    // Tell the parent to clear the category filter
    updateCategory(null);
    // Close the dropdown on phones
    setIsDropdownOpen(false);
  };

  // Toggle the dropdown open or closed on phones
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // What the component shows on the screen
  return (
    // Main container with custom styles and dark mode background
    <div className={`${className} bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md`}>
      {/* Title, hidden on phones, with dark mode text */}
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 md:block hidden">
        Filter by Category
      </h2>

      {/* Dropdown button for phones, hidden on medium screens and up */}
      <div className="md:hidden">
        <button
          onClick={toggleDropdown}
          className="w-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold py-2 px-4 rounded-md flex justify-between items-center"
        >
          {/* Show selected category name or "Select Category" */}
          {selectedCategory
            ? categories.find((cat) => cat.id === selectedCategory)?.name || "Select Category"
            : "Select Category"}
          {/* Arrow to show it’s a dropdown */}
          <span>{isDropdownOpen ? "▲" : "▼"}</span>
        </button>

        {/* Dropdown menu, shows when open on phones */}
        {isDropdownOpen && (
          <ul className="mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 shadow-lg max-h-60 overflow-y-auto">
            {/* Loop through each category */}
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <li
                  key={category.id}
                  className={`cursor-pointer px-4 py-2 flex justify-between items-center ${
                    isSelected
                      ? "bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-indigo-200"
                      : "hover:bg-indigo-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                  }`}
                  onClick={() => handleCategoryClick(category.id)} // Select category on click
                >
                  {/* Category name */}
                  <span>{category.name}</span>
                  {/* Clear button if selected */}
                  {isSelected && (
                    <button
                      onClick={handleClearCategory}
                      className="text-indigo-800 dark:text-indigo-200 font-semibold text-sm"
                    >
                      Clear
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Full category list for larger screens (hidden on phones) */}
      <ul className="space-y-4 hidden md:block">
        {/* Loop through each category */}
        {categories.map((category) => {
          // Check if this category is selected
          const isSelected = selectedCategory === category.id;
          return (
            // Category item, clickable to select it
            <li
              key={category.id} // Unique key for React
              className={`cursor-pointer border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md transition flex justify-between items-center ${
                isSelected
                  ? "bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-indigo-200"
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
              }`}
              onClick={() => handleCategoryClick(category.id)} // Select category on click
            >
              {/* Category name and description */}
              <div>
                <p className="text-md font-medium text-gray-900 dark:text-gray-200">{category.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
              </div>
              {/* Show Clear button if this category is selected */}
              {isSelected && (
                <button
                  onClick={handleClearCategory}
                  className="ml-2 bg-indigo-200 dark:bg-indigo-500 hover:bg-indigo-300 dark:hover:bg-indigo-400 text-indigo-800 dark:text-indigo-200 font-semibold py-1 px-2 rounded text-sm"
                >
                  Clear
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Button to clear all filters, styled differently on phones */}
      <button
        onClick={handleClearAll}
        className="w-full mt-6 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-200 font-semibold py-2 px-4 rounded transition md:mt-6 md:py-2 md:px-4 md:text-base text-sm py-1"
      >
        Clear All Filters
      </button>
    </div>
  );
};

// Make this component usable in other files
export default Categories;
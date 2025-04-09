import React, { useEffect, useState } from "react";

// This component shows a list of categories for filtering stores
const Categories = ({ className, updateCategory }) => {
  // Keeps track of the categories from the server, starts empty
  const [categories, setCategories] = useState([]);
  // Tracks which category the user picked, starts as null (no selection)
  const [selectedCategory, setSelectedCategory] = useState(null);

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
  };

  // When the Clear button is clicked for the selected category
  const handleClearCategory = () => {
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
  };

  // What the component shows on the screen
  return (
    // Main container with custom styles from className, plus default styling
    <div className={`${className} bg-white rounded-lg p-4 shadow-md`}>
      {/* Title */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Filter by Category</h2>

      {/* List of categories */}
      <ul className="space-y-4">
        {/* Loop through each category */}
        {categories.map((category) => {
          // Check if this category is selected
          const isSelected = selectedCategory === category.id;
          return (
            // Category item, clickable to select it
            <li
              key={category.id} // Unique key for React
              className={`cursor-pointer border px-4 py-2 rounded-md transition flex justify-between items-center ${
                isSelected
                  ? "bg-indigo-100 text-indigo-800" // Blue if selected
                  : "bg-gray-50 hover:bg-indigo-100" // Gray normally, blue on hover
              }`}
              onClick={() => handleCategoryClick(category.id)} // Select category on click
            >
              {/* Category name and description */}
              <div>
                <p className="text-md font-medium text-gray-900">{category.name}</p>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              {/* Show Clear button if this category is selected */}
              {isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Don’t trigger category click
                    handleClearCategory(); // Clear this category
                  }}
                  className="ml-2 bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-semibold py-1 px-2 rounded text-sm"
                >
                  Clear
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Button to clear all filters */}
      <button
        onClick={handleClearAll}
        className="w-full mt-6 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded transition"
      >
        Clear All Filters
      </button>
    </div>
  );
};

// Make this component usable in other files
export default Categories;
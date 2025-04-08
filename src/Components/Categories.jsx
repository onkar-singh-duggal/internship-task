// src/Components/Categories.jsx

import React, { useEffect, useState } from "react";

const Categories = ({ className }) => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 8;

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/categories?_page=${page}&_limit=${limit}`
      );
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  return (
    <div className={`${className} my-[50px]`}>
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <li
            key={category.id}
            className="cursor-pointer border p-4 rounded shadow-sm bg-white hover:bg-gray-100 transition"
            onClick={() => {
              // Navigate or trigger filter manually here if using parent component state
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.dispatchEvent(
                new CustomEvent("categoryFilter", { detail: category.id })
              );
            }}
          >
            <p className="text-lg font-medium">{category.name}</p>
            <p className="text-sm text-gray-600">{category.description}</p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">{`Page: ${page}`}</span>
        <button onClick={handleNext} className="px-4 py-2 bg-gray-300 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default Categories;

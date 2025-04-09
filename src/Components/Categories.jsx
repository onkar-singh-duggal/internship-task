import React, { useEffect, useState, useRef, useCallback } from "react";

const Categories = ({ className }) => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 8;
  const observer = useRef();

  const lastCategoryRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/categories?_page=${page}&_limit=${limit}`
      );
      const data = await res.json();

      if (data.length < limit) setHasMore(false);
      setCategories((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const handleCategoryClick = (catId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Dispatch custom event to notify AllStores component
    window.dispatchEvent(new CustomEvent("categoryFilter", { detail: catId }));
  };

  useEffect(() => {
    const handleClearAll = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Dispatch custom event to clear the filter in AllStores component
      window.dispatchEvent(new CustomEvent("categoryFilter", { detail: null }));
    };

    window.addEventListener("clearAllFilters", handleClearAll);
    return () => window.removeEventListener("clearAllFilters", handleClearAll);
  }, []);

  return (
    <div className={`${className} bg-white rounded-lg p-4 shadow-md`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Filter by Category</h2>

      <ul className="space-y-4">
        {categories.map((category, index) => {
          const isLast = index === categories.length - 1;
          return (
            <li
              key={category.id}
              ref={isLast ? lastCategoryRef : null}
              className="cursor-pointer border px-4 py-2 rounded-md bg-gray-50 hover:bg-indigo-100 transition"
              onClick={() => handleCategoryClick(category.id)}
            >
              <p className="text-md font-medium text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-600">{category.description}</p>
            </li>
          );
        })}
      </ul>

      {!hasMore && (
        <p className="text-center mt-4 text-gray-500">No more categories to load</p>
      )}
    </div>
  );
};

export default Categories;

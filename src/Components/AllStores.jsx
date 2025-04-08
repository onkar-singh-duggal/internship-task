import React, { useEffect, useState } from "react";
import axios from "axios";
import StoreForm from "./StoreForm";

const AllStores = ({ className }) => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editStore, setEditStore] = useState(null);

  const limit = 6;

  const getStores = async () => {
    try {
      let url = `http://localhost:3001/stores?_page=${page}&_limit=${limit}`;

      if (sortOption !== "default") {
        const [sortField, sortOrder] = sortOption.split("_");
        url += `&_sort=${sortField}&_order=${sortOrder}`;
      }

      if (searchTerm) {
        url += `&name_like=${searchTerm}`;
      }

      if (categoryFilter) {
        url += `&cats=${categoryFilter}`;
      }

      const res = await axios.get(url);
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores", err);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    getStores();
  }, [page, sortOption, searchTerm, categoryFilter]);

  useEffect(() => {
    getCategories();
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setSortOption("default");
    setPage(1);
  };

  return (
    <div className={`my-6 px-4 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-slate-800">All Stores</h2>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="default">Sort: Default</option>
            <option value="name_asc">Sort: Name (A-Z)</option>
            <option value="name_desc">Sort: Name (Z-A)</option>
            <option value="id_asc">Sort: Oldest</option>
            <option value="id_desc">Sort: Newest</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Filter by Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search store..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleClearFilters}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg shadow transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          setEditStore(null);
          setShowForm(true);
        }}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow transition mb-6"
      >
        Add New Store
      </button>

      {showForm && (
        <StoreForm
          selectedStore={editStore}
          onSuccess={() => {
            setShowForm(false);
            getStores();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-slate-200 p-6 rounded-xl hover:shadow-md transition duration-300"
            >
              <h3 className="text-xl font-semibold text-slate-800">
                {store.name}
              </h3>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setEditStore(store);
                    setShowForm(true);
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg transition"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    if (
                      window.confirm("Are you sure you want to delete this store?")
                    ) {
                      await axios.delete(`http://localhost:3001/stores/${store.id}`);
                      getStores();
                    }
                  }}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-2 text-slate-500">No stores found</p>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-slate-600 font-medium">{`Page: ${page}`}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-4 py-2 rounded-lg transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllStores;

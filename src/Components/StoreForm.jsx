import React, { useState, useEffect } from "react";
import axios from "axios";

const StoreForm = ({ selectedStore, onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [cats, setCats] = useState(""); // category id
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (selectedStore) {
      setName(selectedStore.name || "");
      setCats(selectedStore.cats || "");
    } else {
      setName("");
      setCats("");
    }
  }, [selectedStore]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3001/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storeData = { name, cats };

    try {
      if (selectedStore) {
        await axios.put(`http://localhost:3001/stores/${selectedStore.id}`, storeData);
      } else {
        await axios.post("http://localhost:3001/stores", storeData);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving store:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 p-6 mb-6 rounded-xl shadow-md"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        {selectedStore ? "Edit Store" : "Add New Store"}
      </h3>

      <div className="mb-4">
        <label className="block text-slate-700 mb-2 font-medium">Store Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter store name"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-slate-700 mb-2 font-medium">Category</label>
        <select
          value={cats}
          onChange={(e) => setCats(e.target.value)}
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          {selectedStore ? "Update" : "Add"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-5 py-2 rounded-lg shadow transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StoreForm;

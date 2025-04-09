import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/stores/${id}`);
        setStore(response.data);
      } catch (error) {
        console.error("Error fetching store data", error);
      }
    };

    fetchStore();
  }, [id]);

  if (!store) return <p className="text-center text-slate-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">← Back to Stores</Link>

      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <img
          src={store.logo}
          alt={store.name}
          className="w-40 h-40 mx-auto object-contain mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800">{store.name}</h2>
        <p className="text-gray-600 mt-2">Status: <span className="font-medium">{store.status}</span></p>
        <p className="text-gray-600">Visits: {store.visits}</p>

        <div className="mt-4">
          {store.cashback_enabled === 1 ? (
            <p className="text-green-600 font-semibold text-lg">
              {store.rate_type === "upto" && "Up to "}
              {store.amount_type === "percent"
                ? `${store.cashback_percent}%`
                : `₹${store.cashback_amount}`} Cashback
            </p>
          ) : (
            <p className="text-red-500">No cashback available</p>
          )}
        </div>

        <a
          href={store.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Visit Store
        </a>
      </div>
    </div>
  );
};

export default StoreDetails;

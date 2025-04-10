import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// This component shows details of one store with dark mode support
const StoreDetails = ({ isDarkMode }) => {
  const { id } = useParams(); // Get the store ID from the URL
  const [store, setStore] = useState(null); // Store the store data in state

  // This runs when the page loads or when the ID changes
  useEffect(() => {
    const fetchStore = async () => {
      try {
        // Get the store data from the server using the ID
        const response = await axios.get(`http://localhost:3001/stores/${id}`);
        setStore(response.data); // Save the data in state
      } catch (error) {
        console.error("Error fetching store data", error);
      }
    };

    fetchStore(); // Call the function to get the data
  }, [id]);

  // Show a loading message if store data is not yet available
  if (!store) return <p className="text-center text-slate-500 dark:text-slate-400 mt-10">Loading...</p>;

  // Show the store details
  return (
    // Main container with padding and dark mode background from App.js
    <div className="max-w-3xl mx-auto p-6">
      {/* Back button to go to the main store list */}
      <Link
        to="/"
        className="text-blue-600 dark:text-blue-400 underline mb-4 inline-block hover:text-blue-800 dark:hover:text-blue-300"
      >
        ← Back to Stores
      </Link>

      {/* Store details card */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
        {/* Store logo image */}
        <img
          src={store.logo}
          alt={store.name}
          className="w-40 h-40 mx-auto object-contain mb-4"
        />

        {/* Store name */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{store.name}</h2>

        {/* Store status like "published", "draft", etc. */}
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Status: <span className="font-medium">{store.status}</span>
        </p>

        {/* Number of people who visited the store */}
        <p className="text-gray-600 dark:text-gray-400">Visits: {store.visits}</p>

        {/* Show cashback information if available */}
        <div className="mt-4">
          {store.cashback_enabled === 1 ? (
            <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
              {/* If rate type is "upto", then show "Up to" before amount */}
              {store.rate_type === "upto" && "Up to "}
              {/* Show percent or amount based on type */}
              {store.amount_type === "percent"
                ? `${store.cashback_percent}%`
                : `₹${store.cashback_amount}`} Cashback
            </p>
          ) : (
            <p className="text-red-500 dark:text-red-400">No cashback available</p>
          )}
        </div>

        {/* Button to visit the store's website */}
        <a
          href={store.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-blue-600 dark:bg-blue-700 text-white dark:text-gray-200 px-6 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          Visit Store
        </a>
      </div>
    </div>
  );
};

export default StoreDetails;
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios"; // Helps us talk to the server to get store data
import { FaBookmark, FaRegBookmark, FaArrowUp } from "react-icons/fa"; // Icons for bookmarking and scrolling up
import { useSearchParams, useNavigate } from "react-router-dom"; // Tools to handle URL stuff and move between pages
import { motion } from "framer-motion"; // For cool scrolling animations

// This component shows a list of stores with filters, dark mode, and scrolling animations
const AllStores = ({ className, selectedCategory, isDarkMode }) => {
  // Holds the list of stores we get from the server, starts empty
  const [stores, setStores] = useState([]);
  // Keeps track of which page of stores we’re loading, starts at 1
  const [page, setPage] = useState(1);
  // Tells us if there are more stores to load, starts as true
  const [hasMore, setHasMore] = useState(true);
  // Decides if the scroll-to-top button should show, starts as false
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Stores which stores are bookmarked, loads from local storage or starts empty
  const [bookmarkedStores, setBookmarkedStores] = useState(
    JSON.parse(localStorage.getItem("bookmarkedStores") || "[]")
  );

  // Lets us read and change the URL search parameters (like ?sort=popular)
  const [searchParams, setSearchParams] = useSearchParams();
  // Helps us go to other pages (like a store’s detail page)
  const navigate = useNavigate();

  // Filter settings, starting with values from the URL or defaults
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "default"); // How to sort stores
  const [alphabetFilter, setAlphabetFilter] = useState(searchParams.get("alpha") || null); // Filter by first letter
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || ""); // Filter by status
  const [cashbackFilter, setCashbackFilter] = useState(searchParams.get("cashback") === "1"); // Show only cashback stores
  const [promotedFilter, setPromotedFilter] = useState(searchParams.get("promoted") === "1"); // Show only promoted stores
  const [shareableFilter, setShareableFilter] = useState(searchParams.get("shareable") === "1"); // Show only shareable stores
  const [bookmarkedFilter, setBookmarkedFilter] = useState(searchParams.get("bookmarked") === "1"); // Show only bookmarked stores
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || ""); // Search by store name

  // Helps watch the last store for loading more (infinite scrolling)
  const observer = useRef();
  // How many stores to load at a time, set to 6
  const limit = 6;

  // Animation settings for store cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Start off-screen and invisible
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }, // Fade in and slide up smoothly
    },
  };

  // Animation settings for scroll-to-top button
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95, transition: { duration: 0.1 } }, // Bounce on click
  };

  // Updates the URL with the current filter settings
  const updateURLParams = () => {
    const params = {}; // Object to hold URL parameters
    if (sortOption !== "default") params.sort = sortOption;
    if (selectedCategory) params.category = selectedCategory;
    if (alphabetFilter) params.alpha = alphabetFilter;
    if (statusFilter) params.status = statusFilter;
    if (cashbackFilter) params.cashback = "1";
    if (promotedFilter) params.promoted = "1";
    if (shareableFilter) params.shareable = "1";
    if (bookmarkedFilter) params.bookmarked = "1";
    if (searchTerm) params.search = searchTerm;
    setSearchParams(params); // Put these in the URL
  };

  // When filters change, update the URL and reset the store list
  useEffect(() => {
    updateURLParams();
    setPage(1);
    setStores([]);
  }, [
    sortOption,
    selectedCategory,
    alphabetFilter,
    statusFilter,
    cashbackFilter,
    promotedFilter,
    shareableFilter,
    bookmarkedFilter,
    searchTerm,
  ]);

  // Watches the last store to load more when it’s visible
  const lastStoreRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // Adds or removes a store from the bookmark list
  const toggleBookmark = (id) => {
    const updated = bookmarkedStores.includes(id)
      ? bookmarkedStores.filter((storeId) => storeId !== id)
      : [...bookmarkedStores, id];
    setBookmarkedStores(updated);
    localStorage.setItem("bookmarkedStores", JSON.stringify(updated));
  };

  // Gets stores from the server based on filters
  const getStores = async (reset = false) => {
    try {
      let url = `http://localhost:3001/stores?_page=${page}&_limit=${limit}`;
      if (sortOption !== "default") {
        if (sortOption === "cashback") {
          url += `&cashback_enabled=1&_sort=cashback_percent&_order=desc`;
        } else if (sortOption === "popular") {
          url += `&_sort=visits&_order=desc`;
        } else {
          const [field, order] = sortOption.split("_");
          url += `&_sort=${field}&_order=${order}`;
        }
      }
      if (selectedCategory) url += `&cats=${selectedCategory}`;
      if (alphabetFilter) {
        if (alphabetFilter === "0-9") {
          url += `&name_like=^[0-9]`;
        } else {
          url += `&name_like=^${alphabetFilter}`;
        }
      }
      if (searchTerm) url += `&name_like=${searchTerm}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (cashbackFilter) url += `&cashback_enabled=1`;
      if (promotedFilter) url += `&is_promoted=1`;
      if (shareableFilter) url += `&is_shareable=1`;

      const res = await axios.get(url);
      let result = res.data;
      if (bookmarkedFilter) {
        result = result.filter((store) => bookmarkedStores.includes(store.id));
      }
      if (reset) {
        setStores(result);
      } else {
        setStores((prev) => [...prev, ...result]);
      }
      setHasMore(result.length === limit);
    } catch (err) {
      console.error("Error fetching stores", err);
    }
  };

  // Fetch stores when page or filters change
  useEffect(() => {
    getStores(page === 1);
  }, [
    page,
    sortOption,
    selectedCategory,
    alphabetFilter,
    statusFilter,
    cashbackFilter,
    promotedFilter,
    shareableFilter,
    searchTerm,
    bookmarkedFilter,
    bookmarkedStores,
  ]);

  // Show the scroll-to-top button when we scroll down a bit
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scrolls the page back to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // What the component shows on the screen
  return (
    <div className={`my-6 px-4 ${className} text-gray-800 dark:text-gray-200`}>
      {/* Top section with title and some filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">All Stores</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200"
          >
            <option value="default">Sort: Default</option>
            <option value="name_asc">Alphabetical (A-Z)</option>
            <option value="name_desc">Alphabetical (Z-A)</option>
            <option value="popular">Popular</option>
            <option value="cashback">Cashback</option>
          </select>
          <button
            onClick={() => {
              setSortOption("default");
              setAlphabetFilter(null);
              setStatusFilter("");
              setCashbackFilter(false);
              setPromotedFilter(false);
              setShareableFilter(false);
              setSearchTerm("");
              setBookmarkedFilter(false);
              setPage(1);
              setStores([]);
              setHasMore(true);
              setSearchParams({});
            }}
            className="bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* More filters like status and checkboxes */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200"
        >
          <option value="">All Status</option>
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
          <option value="trash">Trash</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={cashbackFilter}
            onChange={(e) => setCashbackFilter(e.target.checked)}
            className="text-indigo-600 dark:text-indigo-400"
          />
          Cashback Enabled
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={promotedFilter}
            onChange={(e) => setPromotedFilter(e.target.checked)}
            className="text-indigo-600 dark:text-indigo-400"
          />
          Promoted
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={shareableFilter}
            onChange={(e) => setShareableFilter(e.target.checked)}
            className="text-indigo-600 dark:text-indigo-400"
          />
          Share & Earn
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bookmarkedFilter}
            onChange={(e) => setBookmarkedFilter(e.target.checked)}
            className="text-indigo-600 dark:text-indigo-400"
          />
          Show Bookmarked
        </label>
      </div>

      {/* Alphabet buttons to filter by first letter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((char) => (
          <button
            key={char}
            onClick={() => setAlphabetFilter(char)}
            className={`px-3 py-1 rounded-md border border-slate-300 dark:border-slate-600 text-sm font-medium ${
              alphabetFilter === char
                ? "bg-slate-800 dark:bg-slate-600 text-white dark:text-gray-200"
                : "bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200"
            } hover:bg-slate-100 dark:hover:bg-gray-600 transition`}
          >
            {char}
          </button>
        ))}
        <button
          onClick={() => setAlphabetFilter(null)}
          className="px-3 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 text-sm font-medium"
        >
          Clear
        </button>
      </div>

      {/* Grid of store cards with animations */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative">
        {stores.length > 0 ? (
          stores.map((store, idx) => {
            const isLast = idx === stores.length - 1; // Check if this is the last store
            const isBookmarked = bookmarkedStores.includes(store.id); // Check if it’s bookmarked

            return (
              // Animated store card
              <motion.div
                key={store.id}
                ref={isLast ? lastStoreRef : null} // Watch the last one for scrolling
                className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative"
                variants={cardVariants} // Use the animation settings
                initial="hidden" // Start in hidden state
                whileInView="visible" // Animate to visible when in view
                viewport={{ once: true, amount: 0.2 }} // Trigger once when 20% is visible
              >
                {/* Bookmark button */}
                <button
                  onClick={() => toggleBookmark(store.id)}
                  className="absolute top-4 right-4 text-xl text-blue-500 dark:text-blue-300"
                  title="Bookmark"
                >
                  {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                </button>
                <div className="flex flex-col items-center text-center">
                  {/* Store logo */}
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-24 h-24 object-contain mb-4"
                  />
                  {/* Store name */}
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{store.name}</h3>
                  {/* Cashback info */}
                  <p
                    className={`text-sm mt-1 ${
                      store.cashback_enabled === 1
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {store.cashback_enabled === 1 && store.cashback_percent
                      ? `Up to ${store.cashback_percent}% Cashback`
                      : store.cashback_text
                      ? store.cashback_text
                      : "No cashback."}
                  </p>
                  {/* Number of visits */}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Visits: {store.visits || 0}
                  </p>
                  {/* Button to go to store details */}
                  <button
                    onClick={() => navigate(`/store/${store.id}`)}
                    className="bg-slate-800 dark:bg-slate-700 text-white dark:text-gray-200 px-4 py-2 rounded-md mt-4 text-sm w-full hover:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    Shop Now
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center col-span-4 text-slate-500 dark:text-slate-400">No stores found</p>
        )}
      </div>

      {/* Message when there are no more stores to load */}
      {!hasMore && (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-4">No more stores to load</p>
      )}

      {/* Animated scroll-to-top button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-slate-800 dark:bg-slate-700 text-white dark:text-gray-200 p-3 rounded-full shadow-lg transition"
          variants={buttonVariants} // Use the button animation settings
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          title="Scroll to top"
        >
          <FaArrowUp />
        </motion.button>
      )}
    </div>
  );
};

// Let other files use this component
export default AllStores;
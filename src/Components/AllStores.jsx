import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { FaBookmark, FaRegBookmark, FaArrowUp } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router-dom";

const AllStores = ({ className, selectedCategory }) => {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [bookmarkedStores, setBookmarkedStores] = useState(
    JSON.parse(localStorage.getItem("bookmarkedStores") || "[]")
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "default"
  );
  const [alphabetFilter, setAlphabetFilter] = useState(
    searchParams.get("alpha") || null
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );
  const [cashbackFilter, setCashbackFilter] = useState(
    searchParams.get("cashback") === "1"
  );
  const [promotedFilter, setPromotedFilter] = useState(
    searchParams.get("promoted") === "1"
  );
  const [shareableFilter, setShareableFilter] = useState(
    searchParams.get("shareable") === "1"
  );
  const [bookmarkedFilter, setBookmarkedFilter] = useState(
    searchParams.get("bookmarked") === "1"
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const observer = useRef();
  const limit = 6;

  const updateURLParams = () => {
    const params = {};
    if (sortOption !== "default") params.sort = sortOption;
    if (selectedCategory) params.category = selectedCategory;
    if (alphabetFilter) params.alpha = alphabetFilter;
    if (statusFilter) params.status = statusFilter;
    if (cashbackFilter) params.cashback = "1";
    if (promotedFilter) params.promoted = "1";
    if (shareableFilter) params.shareable = "1";
    if (bookmarkedFilter) params.bookmarked = "1";
    if (searchTerm) params.search = searchTerm;

    setSearchParams(params);
  };

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

  const toggleBookmark = (id) => {
    const updated = bookmarkedStores.includes(id)
      ? bookmarkedStores.filter((storeId) => storeId !== id)
      : [...bookmarkedStores, id];
    setBookmarkedStores(updated);
    localStorage.setItem("bookmarkedStores", JSON.stringify(updated));
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`my-6 px-4 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-slate-800">All Stores</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-slate-300 rounded px-3 py-2"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-slate-300 rounded px-3 py-2"
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
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2"
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
          />
          Cashback Enabled
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={promotedFilter}
            onChange={(e) => setPromotedFilter(e.target.checked)}
          />
          Promoted
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={shareableFilter}
            onChange={(e) => setShareableFilter(e.target.checked)}
          />
          Share & Earn
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bookmarkedFilter}
            onChange={(e) => setBookmarkedFilter(e.target.checked)}
          />
          Show Bookmarked
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((char) => (
          <button
            key={char}
            onClick={() => setAlphabetFilter(char)}
            className={`px-3 py-1 rounded-md border text-sm font-medium ${
              alphabetFilter === char
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-800"
            } hover:bg-slate-100 transition`}
          >
            {char}
          </button>
        ))}
        <button
          onClick={() => setAlphabetFilter(null)}
          className="px-3 py-1 rounded-md border bg-red-100 text-red-800 hover:bg-red-200 text-sm font-medium"
        >
          Clear
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative">
        {stores.length > 0 ? (
          stores.map((store, idx) => {
            const isLast = idx === stores.length - 1;
            const isBookmarked = bookmarkedStores.includes(store.id);

            return (
              <div
                key={store.id}
                ref={isLast ? lastStoreRef : null}
                className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative"
              >
                <button
                  onClick={() => toggleBookmark(store.id)}
                  className="absolute top-4 right-4 text-xl text-blue-500"
                  title="Bookmark"
                >
                  {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                </button>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-24 h-24 object-contain mb-4"
                  />
                  <h3 className="text-lg font-semibold text-slate-800">
                    {store.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      store.cashback_enabled === 1
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {store.cashback_enabled === 1 && store.cashback_percent
                      ? `Up to ${store.cashback_percent}% Cashback`
                      : store.cashback_text
                      ? store.cashback_text
                      : "No cashback."
                    }
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Visits: {store.visits || 0}
                  </p>
                  <button
                    onClick={() => navigate(`/store/${store.id}`)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-md mt-4 text-sm w-full hover:bg-slate-700"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-4 text-slate-500">
            No stores found
          </p>
        )}
      </div>

      {!hasMore && (
        <p className="text-center text-slate-500 mt-4">
          No more stores to load
        </p>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 transition"
          title="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default AllStores;
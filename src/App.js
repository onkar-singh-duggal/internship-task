import { Fragment, useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "./logo.jpg";

import Categories from "./Components/Categories";
import AllStores from "./Components/AllStores";
import StoreDetails from "./Components/StoreDetails";

// Dummy user data
const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

// Top navigation items
const navigation = [{ name: "Stores", href: "/", current: true }];
const userNavigation = [];

// Helper function to add classes conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null); // For selected category from sidebar
  const [isDarkMode, setIsDarkMode] = useState(false); // Tracks light or dark mode

  // Update selected category when user clicks one
  const updateCategory = (category) => {
    setSelectedCategory(category);
  };

  // Add or remove "dark" class from <html> when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    // Main container with dark mode background
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navbar */}
      <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
        {({ open }) => (
          <>
            {/* Navbar content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* Left part: Logo and navigation links */}
                <div className="flex items-center space-x-4">
                  <Link to="/">
                    <img className="h-8 w-auto" src={logo} alt="Logo" />
                  </Link>
                  {/* Desktop navigation links */}
                  <div className="hidden sm:flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 dark:border-indigo-400"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-500",
                          "text-sm font-medium px-3 py-2"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right part: notification, theme toggle, and user profile */}
                <div className="flex items-center space-x-4">
                  {/* Notification bell */}
                  <button className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition">
                    <BellIcon className="h-6 w-6" />
                  </button>

                  {/* Theme toggle button */}
                  <button
                    onClick={toggleTheme}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm"
                  >
                    {isDarkMode ? "Light" : "Dark"}
                  </button>

                  {/* User Profile Dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.imageUrl}
                        alt={user.name}
                      />
                      <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-200 font-medium">
                        {user.name}
                      </span>
                    </Menu.Button>

                    {/* Dropdown content */}
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black dark:ring-gray-500 ring-opacity-5 focus:outline-none">
                        {/* If no menu items */}
                        {userNavigation.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No actions
                          </div>
                        ) : (
                          userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100 dark:bg-gray-600" : "",
                                    "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Mobile menu button */}
                <div className="-mr-2 flex sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu items */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100",
                      "block border-l-4 pl-3 pr-4 py-2 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Routing for pages */}
      <Routes>
        {/* Home page route – store list with categories */}
        <Route
          path="/"
          element={
            <main className="py-10 bg-gray-100 dark:bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-6">
                  🏬 Stores Gallery
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Sidebar: category list */}
                  <div className="lg:col-span-1">
                    <Categories updateCategory={updateCategory} isDarkMode={isDarkMode} />
                  </div>
                  {/* Main area: list of all stores */}
                  <div className="lg:col-span-3">
                    <AllStores selectedCategory={selectedCategory} isDarkMode={isDarkMode} />
                  </div>
                </div>
              </div>
            </main>
          }
        />

        {/* Store details page route */}
        <Route path="/store/:id" element={<StoreDetails isDarkMode={isDarkMode} />} />
      </Routes>
    </div>
  );
}
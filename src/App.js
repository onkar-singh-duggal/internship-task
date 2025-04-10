import { Fragment, useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import logo from "./logo.jpg";

import Categories from "./Components/Categories";
import AllStores from "./Components/AllStores";
import StoreDetails from "./Components/StoreDetails";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [{ name: "Stores", href: "/", current: true }];
const userNavigation = [];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// 🔄 Theme Toggle Button
function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-white dark:bg-gray-800 shadow-md"
    >
      <AnimatePresence mode="wait">
        {isDarkMode ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Sun className="text-yellow-400" size={22} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Moon className="text-gray-800" size={22} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const updateCategory = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Disclosure as="nav" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center space-x-4">
                  <Link to="/">
                    <img className="h-8 w-auto rounded-lg shadow-sm" src={logo} alt="Logo" />
                  </Link>
                  <div className="hidden sm:flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                            : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400",
                          "text-sm font-semibold px-3 py-2 transition-all duration-200"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="text-gray-400 dark:text-gray-300 hover:text-indigo-500 transition">
                    <BellIcon className="h-6 w-6" />
                  </button>

                  <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2">
                      <img
                        className="h-8 w-8 rounded-full shadow-sm"
                        src={user.imageUrl}
                        alt={user.name}
                      />
                      <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-200 font-medium">
                        {user.name}
                      </span>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

                <div className="-mr-2 flex sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                      "block px-3 py-2 rounded-md text-base font-medium"
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

      <Routes>
        <Route
          path="/"
          element={
            <main className="py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6"
                >
                  🏬 Explore Top Stores
                </motion.h1>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                  >
                    <Categories updateCategory={updateCategory} isDarkMode={isDarkMode} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                  >
                    <AllStores selectedCategory={selectedCategory} isDarkMode={isDarkMode} />
                  </motion.div>
                </div>
              </div>
            </main>
          }
        />
        <Route path="/store/:id" element={<StoreDetails isDarkMode={isDarkMode} />} />
      </Routes>
    </div>
  );
}

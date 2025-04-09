import { Fragment, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

import Categories from "./Components/Categories";
import AllStores from "./Components/AllStores";
import StoreDetails from "./Components/StoreDetails"; // 👈 import StoreDetails

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

export default function App() {
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Function to update selected category
  const updateCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Disclosure as="nav" className="bg-white shadow sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* Left: Logo + Navigation */}
                <div className="flex items-center space-x-4">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Logo"
                  />
                  <div className="hidden sm:flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "text-indigo-600 border-b-2 border-indigo-500"
                            : "text-gray-600 hover:text-gray-800 hover:border-gray-300",
                          "text-sm font-medium px-3 py-2"
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right: Icons & Profile */}
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <BellIcon className="h-6 w-6" />
                  </button>
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.imageUrl}
                        alt={user.name}
                      />
                      <span className="hidden sm:block text-sm text-gray-700 font-medium">
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No actions
                          </div>
                        ) : (
                          userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
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
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile nav links */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
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

      {/* Routes */}
      <Routes>
        {/* Home - Store Listing */}
        <Route
          path="/"
          element={
            <main className="py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  🏬 Stores Gallery
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-1">
                    <Categories updateCategory={updateCategory} />
                  </div>
                  <div className="lg:col-span-3">
                    <AllStores selectedCategory={selectedCategory} />
                  </div>
                </div>
              </div>
            </main>
          }
        />

        {/* Store Details Page */}
        <Route path="/store/:id" element={<StoreDetails />} />
      </Routes>
    </div>
  );
}

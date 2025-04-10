# README for Store Filter Project
# This file tells you how to set up and run this project step-by-step.
# It also explains what features we added to the code.

# What This Project Does
# This is a simple React app that shows a list of stores. You can filter them by categories, 
# sort them, search them, and bookmark your favorites. It works on phones and computers.

# Project GitHub Link
# You can find all the code here: https://github.com/onkar-singh-duggal/internship-task

# --- How to Set Up and Run ---

# 1. Things You Need First
# Before starting, make sure you have these installed on your computer:
# - Node.js (version 14 or higher) - This runs the React app.
# - npm (comes with Node.js) - This helps install project stuff.
# - Git (optional) - To download the code from GitHub.
# - A text editor like VS Code - To edit the files.

# 2. Get the Project Files
# Use the GitHub link to get the files:
# - Open a terminal (command line).
# - Go to a folder where you want the project.
# - Run: git clone https://github.com/onkar-singh-duggal/internship-task
# - This downloads the project into a folder called "internship-task".
# - Go into that folder: cd internship-task
# - If you don’t have Git, download the zip from the GitHub page and unzip it.

# 3. Set Up the Project
# Open your terminal and go to the project folder (e.g., cd internship-task).
# Run this command to install everything the app needs:
npm install
# This adds React, axios, react-icons, react-router-dom, and Tailwind CSS stuff.
# Note: If you don’t have a package.json yet, run: npm init -y first, then add these:
# - npm install react react-dom axios react-icons react-router-dom
# - For Tailwind, follow step 4.

# 4. Set Up Tailwind CSS
# We use Tailwind for styling. If it’s not set up yet:
# - Run: npm install -D tailwindcss
# - Run: npx tailwindcss init
# - In tailwind.config.js, add this under content:
#   content: ["./src/**/*.{js,jsx,ts,tsx}"],
# - Create a file src/index.css and add:
#   @tailwind base;
#   @tailwind components;
#   @tailwind utilities;
# - In your main index.js or App.js, import this CSS file: import './index.css';

# 5. Set Up the Fake Server (API)
# The app gets data from http://localhost:3001. We’ll use json-server for this:
# - Install it: npm install -g json-server
# - Create a file called db.json in the project folder.
# - Add this to db.json (example data):
#   {
#     "stores": [
#       {"id": 1, "name": "Store A", "logo": "logo.jpg", "cashback_enabled": 1, "cashback_percent": 5, "visits": 100, "cats": 1, "status": "publish"},
#       {"id": 2, "name": "Store B", "logo": "logo.jpg", "cashback_enabled": 0, "visits": 50, "cats": 2, "status": "draft"}
#     ],
#     "categories": [
#       {"id": 1, "name": "Electronics", "description": "Gadgets and tech"},
#       {"id": 2, "name": "Clothing", "description": "Fashion items"}
#     ]
#   }
# - Start the server: json-server --watch db.json --port 3001
# - Keep this running in a separate terminal.

# 6. Put the Code in Place
# Make sure these files are in your src folder:
# - Categories.jsx (for the category sidebar)
# - AllStores.jsx (for the store list)
# - Also add a logo.jpg file in src/assets/ (used in AllStores.jsx).
# - In your App.js, use them like this:
#   import React, { useState } from "react";
#   import Categories from "./Categories";
#   import AllStores from "./AllStores";
#   function App() {
#     const [selectedCategory, setSelectedCategory] = useState(null);
#     return (
#       <div className="flex">
#         <Categories className="w-1/4" updateCategory={setSelectedCategory} />
#         <AllStores className="w-3/4" selectedCategory={selectedCategory} />
#       </div>
#     );
#   }
#   export default App;

# 7. Run the App
# In your terminal, in the project folder:
# - Run: npm start
# - This opens the app in your browser at http://localhost:3000.
# - Make sure the json-server is running too (step 5).

# --- What We Added to the Code ---

# 1. Project Setup
# - Made sure the app works with React, Tailwind CSS, and a fake server (json-server).
# - Everything connects properly with Categories.jsx and AllStores.jsx.

# 2. Sidebar Categories
# - Shows a list of categories in Categories.jsx.
# - Fetches them from http://localhost:3001/categories when the page loads.

# 3. Main Section
# - Shows a list of stores in AllStores.jsx.
# - Loads 6 stores at first (page 1) from http://localhost:3001/stores.

# 4. Infinite Scroll
# - In AllStores.jsx, when you scroll to the bottom, it loads more stores (6 at a time).
# - Stops when there are no more stores (shows "No more stores to load").

# 5. Category Filter
# - In Categories.jsx, click a category to filter stores in AllStores.jsx.
# - The selected category turns blue, and a "Clear" button shows next to it.
# - Tells AllStores.jsx which category to filter by using updateCategory.

# 6. Store Sorting
# - In AllStores.jsx, a dropdown lets you sort stores by:
#   - Default (no sort)
#   - Name (A-Z or Z-A)
#   - Popularity (most visits)
#   - Cashback (highest percent)

# 7. Store Filters
# - In AllStores.jsx, you can filter stores by:
#   - Category (from Categories.jsx)
#   - Status (publish, draft, trash)
#   - Alphabet (A-Z or 0-9 buttons)
#   - Checkboxes for cashback enabled, promoted, and share & earn enabled.

# 8. Store Search
# - In AllStores.jsx, a search bar lets you type a store name to filter the list.

# 9. Bookmark Stores
# - In AllStores.jsx, click a bookmark icon to save a store.
# - Saved stores are stored in local storage and show a filled bookmark icon.
# - A checkbox filters to show only bookmarked stores.

# 10. URL Parameters
# - In AllStores.jsx, filters, sort, and search are saved in the URL (like ?sort=popular).
# - This lets you share the URL and keep the same view.

# --- Extra Stuff We Added ---

# 11. Responsive Design
# - In Categories.jsx, on phones it turns into a dropdown instead of a list.
# - On bigger screens, it stays a full list with descriptions.
# - AllStores.jsx works fine on all screen sizes with a grid layout.

# 12. Scroll to Top
# - In AllStores.jsx, a button appears when you scroll down to go back to the top.

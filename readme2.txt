README for Store Filter Project

What This Project Is
This is a simple app made with React that shows a list of stores. You can sort them, search for them, filter them by categories (like Electronics or Clothing), and save your favorites. It works on phones and computers and has smooth animations when you scroll.

Where to Find the Code
You can see all the code here: https://github.com/onkar-singh-duggal/internship-task

setup and whole project in video -https://app.usebubbles.com/ny6WtVgooKxudTBgigBnSN

How to Set Up and Run the Project

Things You Need First
- Node.js: This makes the app work. Get it from nodejs.org (use version 14 or higher).
- A Terminal: This is where you type commands. Use Command Prompt on Windows or Terminal on Mac.
- A Text Editor (optional): Like VS Code, if you want to look at or change the code.


Setup Steps
# Step 1: Clone the repo
git clone https://github.com/onkar-singh-duggal/internship-task
cd internship-task

# Step 2: Install dependencies
npm install

# Step 3: Start the app
npm start


What We Added to the App

1. Categories List
   - A sidebar shows categories like Electronics. Click one to filter the stores.

2. Store List
   - Shows all stores. It starts with 6 and loads more as you scroll down.

3. Sorting
   - Use a dropdown to sort stores by name, popularity (visits), or cashback amount.

4. Filters
   - Filter stores by category, status (like publish or draft), or if they have cashback.

5. Search
   - Type a store name in the search bar to find it quickly.

6. Bookmarks
   - Click a bookmark icon to save a store. Saved stores stay saved on your computer.

7. Works on Phones
   - On small screens, the category list becomes a dropdown. The store list adjusts too.

8. Dark Mode
   - Switch between light and dark themes with a button.

9. Store Details
   - Click a store to see more about it, like its logo, visits, or cashback.

10. Fun Animations
    - Stores fade in as you scroll. A “Back to Top” button appears and moves smoothly.

That’s It!
Now you can run the app and play with it. It’s simple and fun to use!



---------------------------------------------------------------------------------------------------------
              Extra Features & Creative Additions
# Added some extra features beyond the given requirements to improve the app and showcase creativity:

# Back to Top button appears while scrolling and scrolls up smoothly.

# Smooth fade-in animations for stores using CSS transitions.

# Bookmark system powered by LocalStorage to retain favorites even after page refresh.

# Mobile-first responsive design that adapts well to various screen sizes.

# Clean and modular code structure with clear comments for easy understanding.

# Empty results, loading states, and error handling implemented for a better user experience.

# Tailwind CSS used throughout for a modern and visually appealing UI.

# Alphabetical filtering (A–Z) added for quick store filtering based on the first letter.

# "Clear All Filters" button provided to reset filters and return to default view.

# Debounced search and efficient rendering techniques used to enhance performance.
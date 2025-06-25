# To-Do List: Point Shop System

🎨 UI Structure
- [x] Add "Shop" page to /pages/Shop.jsx
- [x] Add shop tab/category navigation: Banners, Icons, Themes
- [x] Show user's current point balance in top-right

🛍️ Shop Sections
- [x] Load static shop item data from /data/shopItems.json
- [x] For each category:
  - [x] Display item cards (preview, name, cost, "Buy" button)
  - [x] Separate into static/animated or color/pattern

🎁 Purchase Logic
- [x] Check if item is already owned
- [x] If not owned, deduct correct amount of points only
- [x] Show confirmation modal or toast on purchase
- [x] Save item as owned in localStorage (per category)
- [x] Prevent re-purchase of same item

🧑‍🎨 Profile Integration
- [x] Add "Owned Items" section in EditProfile.jsx
- [x] Let user choose and apply owned:
  - [x] Profile icon
  - [x] Profile banner
  - [x] App theme
- [x] Save current selections in profile data

🌌 Extra Details
- [x] Animate all buttons on hover (glow + twinkle)
- [x] Add floating particles or gradient animations in shop background
- [x] Update sidebar menu to show shop icon 🛒 
# ✈️ TripVault – Travel Memory Journal

**TripVault** is a full‑stack travel memory journal built as part of the **CodGen TripVault Virtual Internship**. It allows users to register, log in, create trips with photos, rate their experiences, and share their travel memories publicly.

> 🚀 **Live Demo**: [tripvault-pearl.vercel.app](https://tripvault-pearl.vercel.app/login)  
> ⚙️ **Backend API**: [tripvault-omrt.onrender.com](https://tripvault-omrt.onrender.com)

---

## 📸 Screenshots

*Add a screenshot of your dashboard here*  
![Dashboard Screenshot](screenshot.png)

---

## 🧰 Tech Stack

### Frontend
- **React** (Vite) – fast development & build tool
- **React Router** – client‑side routing
- **Axios** – HTTP requests with interceptors
- **react‑toastify** – toast notifications

### Backend
- **Node.js** + **Express** – RESTful API server
- **MongoDB Atlas** – cloud NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT** – authentication & session management
- **bcryptjs** – password hashing
- **Cloudinary** + **Multer** – image upload & storage

### Deployment
- **Render** – backend hosting (free tier)
- **Vercel** – frontend hosting (free tier)

---

## ✨ Features

### 🔐 Authentication (Week 1)
- User registration with name, unique username, email & hashed password
- Login with JWT token generation
- Protected routes (dashboard only accessible with valid token)
- Persistent login via `localStorage`

### 📝 Trip Management (Week 2)
- Full CRUD operations for trips
- Each trip includes: title, destination, start/end dates, description, rating (1–5)
- Trips are linked to the authenticated user
- Ownership checks prevent unauthorised access
- Dashboard displays trips as horizontally scrollable sticky notes

### 📸 Photo Uploads (Week 3)
- Upload multiple photos per trip using **Cloudinary**
- First uploaded photo becomes the trip **cover image**
- All photos displayed in a responsive grid on the trip detail modal
- Image preview before upload

### 👤 Public Profiles (Week 3)
- Anyone can view a user's profile at `/profile/:username` (no login required)
- Public profiles show: name, username, bio, and all trips
- Sensitive fields (email, password) are excluded from public routes
- Users can edit their bio and username from the dashboard

### 🎨 UI/UX (Week 4)
- Warm, travel‑themed design with wooden board background
- Sticky notes with pushpin effect for trip cards
- Responsive navbar with hamburger menu (mobile‑friendly)
- Loading spinners & toast notifications (success/error)
- Footer with GitHub link
- Fully responsive on all screen sizes (375px+)

---

## 📂 Folder Structure

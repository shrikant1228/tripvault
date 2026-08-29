# TripVault - Travel Memory Journal

A full-stack travel memory journal built as part of the CodGen TripVault Internship. Users can register, log in, create trips with photos, and share their travel memories publicly.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **File Storage**: Cloudinary (cloud media hosting)
- **File Upload**: Multer

## Features

### Week 1 – Authentication
- User registration with password hashing (bcryptjs)
- Login with JWT token generation
- Protected dashboard route
- Persistent login state (localStorage)
- Responsive professional UI with travel theme

### Week 2 – Trip Management (CRUD)
- Create, Read, Update, Delete trips
- Each trip includes: title, destination, dates, description, rating (1-5)
- Trips are linked to the authenticated user
- Ownership checks prevent unauthorized access
- Dashboard displays trips as horizontally scrollable sticky notes

### Week 3 – Photo Uploads & Public Profiles
- **Photo Uploads**: Users can upload multiple photos per trip using Cloudinary
- **Cover Images**: First uploaded photo becomes trip cover image
- **Photo Grid**: All photos displayed in a grid on trip detail modal
- **Public Profiles**: Anyone can view user profiles at `/profile/:username`
- **Profile Management**: Users can edit bio and username from dashboard
- **Security**: Public routes exclude sensitive fields (email, password)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tripvault

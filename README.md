# 🌐 BlogSphere

_A Modern Full-Stack Blogging Platform_

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.10-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 🚀 Project Overview

**BlogSphere** is a comprehensive, modern blogging platform built with cutting-edge technologies. It provides users with an intuitive interface to create, publish, and manage blog posts while fostering community engagement through comments, likes, and user following systems.

---

## 🎨 Features in Detail

### 🔐 Authentication System

- **JWT-based authentication** with secure token handling
- **Password hashing** using bcrypt
- **Email verification** for new accounts
- **Password reset** functionality via email
- **Profile management** with avatar uploads

### 📝 Blog Management

- **Rich text editor** with Markdown support
- **Image uploads** with Cloudinary integration
- **SEO-friendly URLs** with auto-generated slugs
- **Draft and publish** workflow
- **Edit and delete** capabilities for authors
- **View tracking** for analytics

### 🌟 Social Features

- **Like system** with real-time updates
- **Comment system** with author information
- **User following** mechanism
- **Profile pages** with user statistics
- **Activity feeds** for followed users

### 🔍 Search & Discovery

- **Full-text search** across blog content
- **Popular posts** based on views
- **Author filtering** and discovery
- **Responsive pagination** for large datasets

---

## 🛠️ Technology Stack

### **Frontend**

- **React 18.3.1** - Modern framework
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Efficient form handling
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications
- **React Markdown** - Markdown rendering
- **HTML React Parser** - HTML parsing and rendering

### **Backend**

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Cloudinary** - Image storage and management
- **Multer** - File upload middleware
- **Yup** - Schema validation
- **Nodemailer** - Email service
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

### **Development Tools**

- **Prettier** - Code formatting
- **Bun** - Package manager (client)
- **NPM** - Package manager (server)
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **Git** - Version control

---

## 📁 Project Structure

```
BlogSphere/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Header/      # Navigation components
│   │   │   ├── BlogCard.jsx # Blog post cards
│   │   │   ├── BlogForm.jsx # Blog creation/editing
│   │   │   ├── BlogPost.jsx # Individual blog display
│   │   │   ├── Comment.jsx  # Comment system
│   │   │   ├── LikeBtn.jsx  # Like functionality
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx     # Landing page
│   │   │   ├── Blogs.jsx    # Blog listing
│   │   │   ├── Blog.jsx     # Individual blog view
│   │   │   ├── Profile.jsx  # User profiles
│   │   │   └── ...
│   │   ├── features/        # Redux slices
│   │   │   └── auth/        # Authentication state
│   │   ├── api/             # API integration
│   │   └── store/           # Redux store configuration
│   ├── public/              # Static assets
│   └── ...
├── server/                   # Node.js Backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── blog.controller.js
│   │   │   ├── comment.controller.js
│   │   │   └── user.controller.js
│   │   ├── models/          # Database schemas
│   │   │   ├── user.model.js
│   │   │   ├── blog.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── like.model.js
│   │   │   └── follow.model.js
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── schemas/         # Validation schemas
│   └── public/              # File uploads
└── ...
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Cloudinary Account** (for image uploads)
- **Email Service** (for forgot password)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dhruvdankhara/BlogSphere.git
   cd BlogSphere
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   bun install
   # or npm install
   ```

4. **Environment Setup**

   Create `.env` file in the server directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/blogsphere

   # JWT
   JWT_SECRET=your-super-secret-jwt-key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password

   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

   Create `.env` file in the client directory:

   ```env
   VITE_SERVER_URL=http://localhost:8000/api/v1
   ```

### Running the Application

1. **Start the server**

   ```bash
   cd server
   npm run dev
   ```

2. **Start the client**

   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

---

## 📱 Responsive Design

BlogSphere is fully responsive and optimized for:

- **Desktop** - Full-featured experience
- **Tablet** - Optimized layout and navigation
- **Mobile** - Touch-friendly interface and gestures

---

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcrypt
- **Input Validation** with Yup schemas
- **CORS Protection** for cross-origin requests
- **File Upload Security** with Multer
- **Rate Limiting** for API endpoints
- **SQL Injection Protection** with Mongoose

---

## 🚀 Deployment

#### Frontend (Vercel)

#### Backend (Render)

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password/:token` - Reset password

### Blog Endpoints

- `GET /api/v1/blog` - Get all blogs
- `POST /api/v1/blog` - Create blog post
- `GET /api/v1/blog/:slug` - Get single blog
- `PUT /api/v1/blog/:slug` - Update blog post
- `DELETE /api/v1/blog/:slug` - Delete blog post
- `POST /api/v1/blog/:id/like` - Like blog post
- `POST /api/v1/blog/:id/unlike` - Unlike blog post

### User Endpoints

- `GET /api/v1/user/:username` - Get user profile
- `POST /api/v1/user/:username/follow` - Follow user
- `POST /api/v1/user/:username/unfollow` - Unfollow user

---

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

## 📈 Project Statistics

- **Total Lines of Code**: 10,000+
- **Components**: 25+
- **API Endpoints**: 20+
- **Database Models**: 6

---

<div align="center">

**Made with ❤️ by dhruvdankhara**

[⭐ Star this repository](https://github.com/dhruvdankhara/BlogSphere) if you found it helpful!

</div>

---

_Last updated: December 2025_

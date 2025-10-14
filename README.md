# 📚 Library Management System

A modern, full-featured Library Management System built with React 19, Redux Toolkit, and Vite. This application provides a complete solution for managing book rentals, wishlists, and user profiles with a clean, minimalist design.

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.9-764ABC.svg)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4.svg)](https://tailwindcss.com/)

## ✨ Features

### 🔐 Authentication System

- Secure login with JSONPlaceholder API integration
- Protected routes with automatic redirection
- Session persistence across browser refreshes
- User-specific data isolation

### 📖 Book Catalog Management

- Browse 100+ books with detailed information
- Real-time search and filtering by title, author, or description
- Visual availability indicators (Available/Rented)
- Responsive card-based layout

### ❤️ Wishlist Feature

- Add/remove books from personal wishlist
- Filter to view wishlist-only books
- Wishlist counter in navigation and profile
- Visual feedback with heart icons

### 📅 Book Rental System

- One-click book rental functionality
- 24-hour rental period with automatic due date calculation
- Real-time countdown timer (hours, minutes, seconds)
- Overdue detection with visual indicators
- Return books before due date
- Active and completed rentals sections

### 👤 User Profile Management

- Display user information from JSONPlaceholder
- Profile picture upload with preview
- File validation (type and size)
- Rental statistics dashboard:
  - Total rentals
  - Active rentals
  - Completed rentals
  - Wishlist count
- Recent rental history

### 🧭 Navigation & UI/UX

- Responsive navigation bar (mobile, tablet, desktop)
- Mobile hamburger menu with smooth transitions
- Active route highlighting
- Loading states for all API calls
- Comprehensive error handling
- Toast notifications for user feedback
- Modern minimalist design with Inter font
- Slate color scheme throughout

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library with latest features
- **Vite** - Next-generation frontend build tool
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Reusable component library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Testing

- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **jsdom** - DOM environment for tests

### APIs

- **JSONPlaceholder** - Mock REST API for users and books data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/abhishekgogoi/Library_Management_System
cd library-management-system
```

2. **Install dependencies**

```bash
npm install
```

## 💻 Running the Application

### Development Mode

**Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5137`

### Production Build

```bash
npm run build
```

The optimized production files will be in the `dist` folder.

## 🧪 Running Tests

### Run all tests

```bash
npm run test
```

### Run tests in watch mode

```bash
npm test
```

### Run tests with coverage

```bash
cd frontend
npm run test:coverage
```

## 📜 Available Scripts

### Scripts

| Script                  | Description                   |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Start development server      |
| `npm run build`         | Build for production          |
| `npm run preview`       | Preview production build      |
| `npm test`              | Run tests in watch mode       |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint`          | Lint code with ESLint         |

## 🎯 Key Features Breakdown

### 1. User-Specific Data Isolation

Each user has completely isolated data:

- **Global Data**: Book availability (shared across all users)
- **User-Specific Data**: Rentals, wishlist, profile image
- **Storage Structure**:
  ```
  localStorage:
    authState
    booksState (global)
    rentalsState_1 (User 1's rentals)
    rentalsState_2 (User 2's rentals)
    wishlistState_1 (User 1's wishlist)
    wishlistState_2 (User 2's wishlist)
    profileState_1 (User 1's profile)
    profileState_2 (User 2's profile)
  ```

### 2. Real-Time Countdown Timer

- Calculates remaining time from 24-hour rental period
- Updates every second
- Shows hours, minutes, and seconds
- Displays "Overdue" when time expires
- Visual indicators for overdue books

### 3. Responsive Design

- **Mobile** (< 768px): Hamburger menu, optimized layout
- **Tablet** (768px - 1024px): Compact navigation
- **Desktop** (> 1024px): Full navigation bar

### 4. Error Handling

- Network error detection
- API error handling with retry functionality
- Form validation with user feedback
- Loading states for all async operations
- Toast notifications for all actions

## 👥 User Guide

### Getting Started

1. **Login**: Use any username from JSONPlaceholder users

   - Examples: `Bret`, `Antonette`, `Samantha`, `Karianne`, `Kamren`

2. **Browse Books**: View the catalog of 100 books

   - Use the search bar to filter books
   - Click the heart icon to add to wishlist

3. **Rent Books**: Click "Rent Book" button

   - Available books can be rented instantly
   - Rented books show 24-hour countdown timer

4. **Manage Rentals**: Navigate to "My Rentals"

   - View active rentals with countdown
   - Return books before due date
   - View rental history

5. **Manage Profile**: Go to "Profile" page
   - View user information
   - Upload profile picture with preview
   - Check rental statistics

### Sample Users

| Username  | Name             | ID  |
| --------- | ---------------- | --- |
| Bret      | Leanne Graham    | 1   |
| Antonette | Ervin Howell     | 2   |
| Samantha  | Clementine Bauch | 3   |
| Karianne  | Patricia Lebsack | 4   |
| Kamren    | Chelsey Dietrich | 5   |

## 🎨 Design System

### Colors

- **Primary**: Slate (50-900)
- **Accent**: Red (for wishlist)
- **Success**: Green (for available books)
- **Error**: Red (for errors and overdue)

### Typography

- **Font Family**: Inter
- **Sizes**:
  - Headings: 2xl - 5xl
  - Body: base - lg
  - Small: sm - xs

## 🔒 Data Persistence

- **Authentication State**: Persists across browser sessions
- **User-Specific Data**: Stored per user ID in localStorage
- **Book Availability**: Global state shared across all users
- **Automatic Data Loading**: User data loads on login and page refresh

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

Abhishek Gogoi

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Vite](https://vitejs.dev/) - Build Tool
- [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/UI](https://ui.shadcn.com/) - Component Library
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Mock API
- [Lucide](https://lucide.dev/) - Icons

---

**Made with ❤️ using React 19 + Vite**

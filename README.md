# 🍔 Food Delivery App

A complete full-stack food delivery application built with React (Vite), Node.js (Express), and Supabase (PostgreSQL). Features include customer ordering, shopping cart management, order tracking, admin dashboard, and restaurant manager interface.

## 🚀 Features

### Customer Features
-   **Browse Restaurants**: View a list of available restaurants with cuisines and ratings.
-   **Menu Exploration**: Detailed menu pages with categories (Starter, Main, Dessert, Drink) and beautiful images.
-   **Shopping Cart**: Add items, adjust quantities, and view real-time totals.
-   **Checkout**: Seamless checkout process with order summary and delivery details form.
-   **Real-time Order Tracking**: Track order status from "Pending" to "Delivered" with live updates.

### Admin & Management Features
-   **Admin Dashboard (`/admin`)**: View all orders, filter by status, search customers, and update order statuses (e.g., confirm, prepare, deliver).
-   **Restaurant Manager (`/manager`)**: 
    -   Add/Edit/Delete Restaurants.
    -   Manage Menu Items (including images, prices, availability).
    -   Toggle Restaurant Open/Closed status.
    -   View recent orders per restaurant.

## 🛠️ Tech Stack

-   **Frontend**: React 18, Vite, CSS3 (Custom responsive design)
-   **Backend**: Node.js, Express.js
-   **Database**: Supabase (PostgreSQL)
-   **API Client**: Axios
-   **Routing**: React Router DOM v6

## 📋 Prerequisites

-   **Node.js** (v14 or higher)
-   **npm** (Node Package Manager)
-   **Supabase Account** (for the database)

## ⚙️ Setup & Installation

### 1. Database Setup (Supabase)
1.  Create a new project on [Supabase.com](https://supabase.com/).
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Copy the SQL commands from `food-delivery/SUPABASE_SETUP.md` in this repository.
4.  Paste and run them to create tables (`restaurants`, `menu_items`, `orders`, `order_items`) and security policies.

### 2. Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd food-delivery/server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `food-delivery/server/` with your Supabase credentials:
    ```env
    PORT=5000
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  Seed the database with sample data (optional but recommended):
    ```bash
    npm run seed
    ```
5.  Start the server:
    ```bash
    npm start
    ```
    *Server runs on `http://localhost:5000`*

### 3. Frontend Setup
1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd food-delivery/client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *Client runs on `http://localhost:3000`*

## 📱 Usage

1.  Open `http://localhost:3000` in your browser.
2.  **Customer**: Browse and place an order.
3.  **Admin**: Navigate to `http://localhost:3000/admin` to manage orders.
4.  **Manager**: Navigate to `http://localhost:3000/manager` to manage restaurants.

## 📁 Project Structure

```
food-delivery/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/           # Axios setup
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Cart Context
│   │   ├── pages/         # Page components (Customer, Admin, etc.)
│   │   └── ...
│   └── ...
├── server/                 # Node.js Backend
│   ├── config/            # Supabase client config
│   ├── controllers/       # Route logic
│   ├── routes/            # API endpoints
│   ├── seed.js            # Database seeder script
│   └── server.js          # Express app entry point
└── SUPABASE_SETUP.md       # Database schema instructions
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

# Food Delivery Management System

A complete full-stack food delivery application with a Node.js/Express backend and a Vanilla JS frontend.

## Project Structure

```
food-delivery/
├── server/                 # Backend Node.js/Express
│   ├── config/             # Database configuration
│   ├── models/             # Mongoose models (Restaurant, MenuItem, Order)
│   ├── routes/             # API routes
│   ├── seed.js             # Database seeder script
│   ├── server.js           # Main server entry point
│   └── .env                # Environment variables
└── client/                 # Frontend (HTML/CSS/JS)
    ├── css/                # Styles
    ├── js/                 # Client-side logic
    ├── index.html          # Customer View
    ├── admin.html          # Admin Dashboard
    └── restaurant.html     # Restaurant Manager View
```

## Setup Instructions

1.  **Install Dependencies**
    Navigate to the server directory and install the required packages:
    ```bash
    cd server
    npm install
    ```

2.  **Configuration**
    The `.env` file is already created in the `server` directory. Ensure it contains your valid MongoDB connection string:
    ```
    MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/fooddelivery
    PORT=5000
    ```
    *Replace `<user>`, `<pass>`, and the cluster URL with your actual MongoDB Atlas credentials.*

3.  **Seed Database**
    Populate the database with initial restaurants and menu items:
    ```bash
    npm run seed
    ```
    You should see "Seeded successfully!" in the console.

4.  **Run the Server**
    Start the backend server (which also serves the frontend):
    ```bash
    npm run dev
    ```
    or
    ```bash
    npm start
    ```

5.  **Access the Application**
    Open your browser and navigate to:
    [http://localhost:5000](http://localhost:5000)

## Features

*   **Customer View (`/`)**: Browse restaurants, view menus, add items to cart, and place orders.
*   **Admin Dashboard (`/admin.html`)**: View live order stats, manage order statuses, and filter orders. Auto-refreshes every 30 seconds.
*   **Restaurant Manager (`/restaurant.html`)**: Manage specific restaurants, toggle open/close status, and add/edit/delete menu items.

## Technologies

*   **Backend**: Node.js, Express.js, Mongoose
*   **Database**: MongoDB Atlas
*   **Frontend**: HTML5, CSS3, Vanilla JavaScript
# restaurant-menu

import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'
import CartSidebar from './components/CartSidebar'
import CustomerPage from './pages/CustomerPage/CustomerPage'
import MenuPage from './pages/MenuPage/MenuPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage'
import AdminPage from './pages/AdminPage/AdminPage'
import RestaurantManagerPage from './pages/RestaurantManagerPage/RestaurantManagerPage'
import './App.css'

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false)

    const toggleCart = () => setIsCartOpen(!isCartOpen)

    return (
        <RouterWrapper>
            <CartProvider>
                <ToastProvider>
                    <Navbar onCartClick={toggleCart} />
                    <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                    <div className="app-content">
                        <Routes>
                            <Route path="/" element={<CustomerPage />} />
                            <Route path="/menu/:restaurantId" element={<MenuPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/manager" element={<RestaurantManagerPage />} />
                        </Routes>
                    </div>
                </ToastProvider>
            </CartProvider>
        </RouterWrapper>
    )
}

// Wrapper to provide Router context to everything inside
function RouterWrapper({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>
}

export default App

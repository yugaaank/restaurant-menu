import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Navbar.css'

const Navbar = ({ onCartClick }) => {
    const { cartCount } = useCart()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    🍕 FoodExpress
                </Link>

                <button className="navbar-toggle" onClick={toggleMenu}>
                    ☰
                </button>

                <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                        Browse
                    </Link>
                    <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                        Admin
                    </Link>
                    <Link to="/manager" className={location.pathname === '/manager' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                        Manager
                    </Link>
                </div>

                <button className="navbar-cart-btn" onClick={onCartClick}>
                    🛒
                    {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
                </button>
            </div>
        </nav>
    )
}

export default Navbar

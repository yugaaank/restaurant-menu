import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartSidebar.css'

const CartSidebar = ({ isOpen, onClose }) => {
    const { cart, restaurantName, cartTotal, updateQuantity, removeFromCart } = useCart()
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('sidebar-open')
        } else {
            document.body.classList.remove('sidebar-open')
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleCheckout = () => {
        onClose()
        navigate('/checkout')
    }

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <h3>Your Cart 🛒</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <span role="img" aria-label="sad">😢</span>
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-restaurant">
                            Ordering from: <strong>{restaurantName}</strong>
                        </div>

                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item.menuItemId} className="cart-item">
                                    <div className="item-left-col">
                                        <div className="cart-item-img" style={{ backgroundImage: `url(${item.image})` }} />
                                        <div className="item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="item-controls">
                                        <button onClick={() => updateQuantity(item.menuItemId, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.menuItemId, 1)}>+</button>
                                        <button className="remove-btn" onClick={() => removeFromCart(item.menuItemId)}>🗑</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total">
                                <span>Total:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary btn-block" onClick={handleCheckout}>
                                Checkout →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CartSidebar

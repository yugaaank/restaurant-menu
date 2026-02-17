import React from 'react';
import { useCart } from '../context/CartContext';
import './MenuItemCard.css';

const MenuItemCard = ({ item, restaurantId, restaurantName }) => {
    const { addToCart, cart, updateQuantity } = useCart();

    const cartItem = cart.find(cartItem => cartItem.menuItem === item._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = () => {
        addToCart({
            menuItem: item._id,
            name: item.name,
            price: item.price
        }, restaurantId, restaurantName);
    };

    return (
        <div className={`menu-item-card ${!item.isAvailable ? 'unavailable' : ''}`}>
            <div className="menu-item-img-container">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="menu-item-img" />
                ) : (
                    <div className="menu-item-placeholder"></div>
                )}
                {!item.isAvailable && <div className="unavailable-overlay">Unavailable</div>}
            </div>

            <div className="menu-item-details">
                <div className="menu-item-header">
                    <h3 className="menu-item-title">{item.name}</h3>
                    <span className="menu-item-price">₹{item.price.toFixed(2)}</span>
                </div>
                <p className="menu-item-desc">{item.description}</p>

                <div className="menu-item-actions">
                    {quantity > 0 ? (
                        <div className="item-qty-controls">
                            <button onClick={() => updateQuantity(item._id, quantity - 1)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => updateQuantity(item._id, quantity + 1)}>+</button>
                        </div>
                    ) : (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleAdd}
                            disabled={!item.isAvailable}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;

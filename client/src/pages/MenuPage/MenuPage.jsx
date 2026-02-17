import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useCart } from '../../context/CartContext'
import Spinner from '../../components/Spinner'
import './MenuPage.css'

const MenuPage = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const { addToCart, cart, updateQuantity, removeFromCart } = useCart()

    const [restaurant, setRestaurant] = useState(null)
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('All')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restRes, menuRes] = await Promise.all([
                    api.get(`/restaurants/${restaurantId}`),
                    api.get(`/menu/restaurant/${restaurantId}`)
                ])
                setRestaurant(restRes.data)
                setMenuItems(menuRes.data)
            } catch (err) {
                console.error("Failed to load restaurant data", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [restaurantId])

    if (loading) return <Spinner fullPage />
    if (!restaurant) return <div className="empty-state"><h3>Restaurant not found</h3></div>

    const categories = ['All', ...new Set(menuItems.map(i => i.category))]

    const filteredItems = activeCategory === 'All'
        ? menuItems
        : menuItems.filter(i => i.category === activeCategory)

    const getCartItem = (itemId) => cart.find(x => x.menuItemId === itemId)

    return (
        <div className="menu-page">
            <div className="menu-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${restaurant.image})` }}>
                <div className="container">
                    <button onClick={() => navigate(-1)} className="back-btn" style={{ color: 'white' }}>← Back</button>
                    <div className="hero-content">
                        <h1 style={{ color: 'white' }}>{restaurant.name}</h1>
                        <p style={{ color: '#e0e0e0' }}>{restaurant.cuisine} • {restaurant.address}</p>
                        {restaurant.is_open ? <span className="open-badge">Open Now</span> : <span className="closed-badge">Closed</span>}
                    </div>
                </div>
            </div>

            <div className="category-bar">
                <div className="container">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? 'active' : ''}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container menu-grid-container">
                <div className="menu-grid grid-2">
                    {filteredItems.map(item => {
                        const cartItem = getCartItem(item.id)
                        return (
                            <div key={item.id} className={`menu-item-card ${!item.is_available ? 'unavailable' : ''}`}>
                                <div className="item-image" style={{ backgroundImage: `url(${item.image || 'https://via.placeholder.com/150'})` }}>
                                    {item.image ? '' : <span className="emoji-placeholder">🍔</span>}
                                </div>
                                <div className="item-details">
                                    <span className="category-pill">{item.category}</span>
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <div className="price-row">
                                        <span className="price">${parseFloat(item.price).toFixed(2)}</span>
                                        {!item.is_available ? (
                                            <button disabled className="btn btn-sm">Unavailable</button>
                                        ) : cartItem ? (
                                            <div className="qty-control">
                                                <button onClick={() => updateQuantity(item.id, -1)}>–</button>
                                                <span>{cartItem.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => addToCart({
                                                    menuItemId: item.id,
                                                    name: item.name,
                                                    price: parseFloat(item.price),
                                                    image: item.image
                                                }, restaurant.id, restaurant.name)}
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MenuPage

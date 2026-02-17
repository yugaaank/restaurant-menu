import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toast'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import './CheckoutPage.css'

const CheckoutPage = () => {
    const { cart, restaurantName, restaurantId, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        address: '',
        note: ''
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/')
        }
    }, [cart, navigate])

    const validate = () => {
        const newErrors = {}
        if (!formData.customerName.trim()) newErrors.customerName = 'Name is required'
        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = 'Phone is required'
        } else if (!/^\d{10,}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
            newErrors.customerPhone = 'Enter a valid phone number (min 10 digits)'
        }
        if (!formData.address.trim()) newErrors.address = 'Address is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            const orderData = {
                customer_name: formData.customerName,
                customer_phone: formData.customerPhone,
                address: formData.address,
                note: formData.note,
                restaurant_id: restaurantId,
                items: cart.map(i => ({
                    menu_item_id: i.menuItemId,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity
                })),
                total_amount: cartTotal
            }

            const res = await api.post('/orders', orderData)

            clearCart()
            showToast('Order placed successfully! 🎉', 'success')
            navigate(`/order-success/${res.data.id}`)
        } catch (err) {
            console.error(err)
            showToast(err.response?.data?.error || 'Failed to place order', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) return null

    return (
        <div className="container checkout-container">
            <div className="checkout-grid">
                {/* Left Column: Order Summary */}
                <div className="summary-col">
                    <div className="card summary-card">
                        <h3>Order Summary</h3>
                        <p className="summary-restaurant">from <strong>{restaurantName}</strong></p>

                        <div className="summary-items">
                            {cart.map(item => (
                                <div key={item.menuItemId} className="summary-item-row">
                                    <div className="summary-item-details">
                                        <div className="summary-item-img" style={{ backgroundImage: `url(${item.image})` }} />
                                        <span className="badge">{item.quantity}x</span>
                                        <span className="summary-item-name">{item.name}</span>
                                    </div>
                                    <div className="summary-item-controls">
                                        <div className="qty-buttons">
                                            <button className="btn-tiny" onClick={() => updateQuantity(item.menuItemId, -1)}>–</button>
                                            <button className="btn-tiny" onClick={() => updateQuantity(item.menuItemId, 1)}>+</button>
                                        </div>
                                        <button className="btn-tiny remove" onClick={() => removeFromCart(item.menuItemId)}>🗑</button>
                                        <span className="summary-price">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-total footer">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <button onClick={() => navigate(-1)} className="change-order-link">
                            ← Change order
                        </button>
                    </div>
                </div>

                {/* Right Column: Delivery Details */}
                <div className="form-col">
                    <div className="card form-card">
                        <h3>Delivery Details</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name*</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                    className={errors.customerName ? 'error' : ''}
                                />
                                {errors.customerName && <span className="error-msg">{errors.customerName}</span>}
                            </div>

                            <div className="form-group">
                                <label>Phone Number*</label>
                                <input
                                    type="tel"
                                    value={formData.customerPhone}
                                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                    className={errors.customerPhone ? 'error' : ''}
                                />
                                {errors.customerPhone && <span className="error-msg">{errors.customerPhone}</span>}
                            </div>

                            <div className="form-group">
                                <label>Delivery Address*</label>
                                <textarea
                                    rows="3"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className={errors.address ? 'error' : ''}
                                />
                                {errors.address && <span className="error-msg">{errors.address}</span>}
                            </div>

                            <div className="form-group">
                                <label>Note (Optional)</label>
                                <textarea
                                    rows="2"
                                    placeholder="Any special instructions?"
                                    value={formData.note}
                                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                                {loading ? <span className="flex-center"><Spinner size="sm" /> Placing order...</span> : 'Place Order 🎉'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage

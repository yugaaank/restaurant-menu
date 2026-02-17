import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import './OrderSuccessPage.css'

const OrderSuccessPage = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [trackId, setTrackId] = useState('')
    const [lastUpdated, setLastUpdated] = useState(0)

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`)
            setOrder(res.data)
            setLastUpdated(0)
        } catch (err) {
            setError('Failed to load order')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
        const interval = setInterval(() => {
            fetchOrder()
        }, 15000)

        const timer = setInterval(() => {
            setLastUpdated(prev => prev + 1)
        }, 1000)

        return () => {
            clearInterval(interval)
            clearInterval(timer)
        }
    }, [orderId])

    if (loading) return <Spinner fullPage />
    if (error) return <div className="empty-state"><h3>⚠️ {error}</h3></div>
    if (!order) return null

    const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']
    const currentStepIndex = steps.indexOf(order.status)
    const isCancelled = order.status === 'cancelled'

    return (
        <div className="order-success-page">
            <div className="success-header">
                <div className="check-animation">
                    <svg viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
                <h1>Order Placed! 🎉</h1>
                <p>Your food is being prepared</p>
            </div>

            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="card order-card">
                    <div className="order-card-header">
                        <h3>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                        <span className="order-time">{new Date(order.created_at).toLocaleString()}</span>
                    </div>

                    <div className="customer-info">
                        <p><strong>{order.customer_name}</strong> ({order.customer_phone})</p>
                        <p className="address">{order.address}</p>
                        {order.note && <p className="note">"{order.note}"</p>}
                    </div>

                    <div className="order-items-list">
                        {order.order_items.map(item => (
                            <div key={item.id} className="order-item-row">
                                <div className="item-left">
                                    <div className="order-item-img" style={{ backgroundImage: `url(${item.menu_items?.image})` }} />
                                    <span>{item.name} <span className="badge">x{item.quantity}</span></span>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="order-total-row">
                        <span>Total</span>
                        <span>${order.total_amount.toFixed(2)}</span>
                    </div>

                    <div className="divider" />

                    <div className="status-section">
                        <div className="status-row">
                            <span className="status-label">Current Status:</span>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="last-updated">Last updated: {lastUpdated} seconds ago</p>
                    </div>
                </div>

                {!isCancelled && (
                    <div className="progress-tracker">
                        {steps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex
                            const isCurrent = index === currentStepIndex
                            return (
                                <div key={step} className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                    <div className="step-dot"></div>
                                    <span className="step-label">{step.replace(/_/g, ' ')}</span>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="action-buttons">
                    <Link to="/" className="btn btn-primary btn-block">Order More Food</Link>

                    <div className="track-order-input">
                        <input
                            type="text"
                            placeholder="Track another order ID"
                            value={trackId}
                            onChange={e => setTrackId(e.target.value)}
                        />
                        <button onClick={() => window.location.href = `/order-success/${trackId}`}>Track</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccessPage

import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import StatCard from '../../components/StatCard'
import { useToast } from '../../components/Toast'
import './AdminPage.css'

const AdminPage = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const { showToast } = useToast()
    const [lastRefreshed, setLastRefreshed] = useState(new Date())

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders')
            setOrders(res.data)
            setLastRefreshed(new Date())
        } catch (err) {
            console.error(err)
            showToast('Failed to load orders', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
        const interval = setInterval(fetchOrders, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleStatusUpdate = async (orderId, newStatus) => {
        // Optimistic update
        const previousOrders = [...orders]
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus })
            showToast('Status updated successfully', 'success')
        } catch (err) {
            console.error(err)
            showToast('Failed to update status', 'error')
            setOrders(previousOrders) // Revert
        }
    }

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'All' || o.status === filter
        const matchesSearch = o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesFilter && matchesSearch
    })

    // Stats calculation
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const inProgressOrders = orders.filter(o => ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length

    const today = new Date().toISOString().split('T')[0]
    const deliveredToday = orders.filter(o =>
        o.status === 'delivered' && o.created_at.startsWith(today)
    ).length

    if (loading) return <Spinner fullPage />

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>📋 Admin Dashboard</h1>
                    <span className="last-refreshed">Last updated: {lastRefreshed.toLocaleTimeString()}</span>
                </div>

                <div className="stats-row">
                    <StatCard icon="📦" label="Total Orders" value={totalOrders} borderColor="#6366F1" />
                    <StatCard icon="⏳" label="Pending" value={pendingOrders} borderColor="#F59E0B" />
                    <StatCard icon="🔥" label="In Progress" value={inProgressOrders} borderColor="#3B82F6" />
                    <StatCard icon="✅" label="Delivered Today" value={deliveredToday} borderColor="#10B981" />
                </div>

                <div className="controls-row">
                    <div className="status-filters">
                        {['All', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
                            <button
                                key={s}
                                className={`filter-pill ${filter === s ? 'active' : ''}`}
                                onClick={() => setFilter(s)}
                            >
                                {s === 'All' ? 'All' : s.replace(/_/g, ' ')}
                            </button>
                        ))}
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search customer..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="orders-list">
                    {filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <div>📭</div>
                            <h3>No {filter !== 'All' ? filter.replace(/_/g, ' ') : ''} orders found</h3>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order.id} className={`order-card status-border-${order.status}`}>
                                <div className="order-row header">
                                    <span className="order-id">#{order.id.slice(0, 8).toUpperCase()}</span>
                                    <span className="restaurant-name">{order.restaurants?.name}</span>
                                    <span className="time-ago">{new Date(order.created_at).toLocaleString()}</span>
                                </div>

                                <div className="order-row customer">
                                    <span>👤 {order.customer_name}</span>
                                    <span>📞 {order.customer_phone}</span>
                                </div>

                                <div className="order-row items">
                                    {order.order_items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                </div>

                                <div className="order-row footer">
                                    <span className="order-total">${order.total_amount.toFixed(2)}</span>
                                    <StatusBadge status={order.status} />
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="out_for_delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminPage

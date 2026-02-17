import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../components/Toast'
import './RestaurantManagerPage.css'

const RestaurantManagerPage = () => {
    const [restaurants, setRestaurants] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const [menuItems, setMenuItems] = useState([])
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)

    // Modals state
    const [isRestModalOpen, setIsRestModalOpen] = useState(false)
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    const { showToast } = useToast()

    // Forms state
    const [restForm, setRestForm] = useState({ name: '', cuisine: '', address: '', image: '', is_open: true })
    const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: 'Main', image: '', is_available: true })

    useEffect(() => {
        fetchRestaurants()
    }, [])

    useEffect(() => {
        if (selectedRestaurant) {
            fetchRestaurantDetails(selectedRestaurant.id)
        }
    }, [selectedRestaurant])

    const fetchRestaurants = async () => {
        try {
            const res = await api.get('/restaurants')
            setRestaurants(res.data)
            setLoading(false)
        } catch (err) {
            console.error(err)
            showToast('Failed to load restaurants', 'error')
        }
    }

    const fetchRestaurantDetails = async (id) => {
        try {
            const [menuRes, ordersRes] = await Promise.all([
                api.get(`/menu/restaurant/${id}`),
                api.get(`/orders/restaurant/${id}`)
            ])
            setMenuItems(menuRes.data)
            setRecentOrders(ordersRes.data)
        } catch (err) {
            console.error(err)
            showToast('Failed to load details', 'error')
        }
    }

    const handleCreateRestaurant = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/restaurants', restForm)
            setRestaurants([res.data, ...restaurants])
            setSelectedRestaurant(res.data)
            setIsRestModalOpen(false)
            setRestForm({ name: '', cuisine: '', address: '', image: '', is_open: true })
            showToast('Restaurant created', 'success')
        } catch (err) {
            showToast('Failed to create restaurant', 'error')
        }
    }

    const handleDeleteRestaurant = async () => {
        if (!window.confirm('Delete this restaurant?')) return
        try {
            await api.delete(`/restaurants/${selectedRestaurant.id}`)
            setRestaurants(prev => prev.filter(r => r.id !== selectedRestaurant.id))
            setSelectedRestaurant(null)
            showToast('Restaurant deleted', 'success')
        } catch (err) {
            showToast('Failed to delete', 'error')
        }
    }

    const handleToggleOpen = async () => {
        try {
            const updated = { ...selectedRestaurant, is_open: !selectedRestaurant.is_open }
            await api.put(`/restaurants/${selectedRestaurant.id}`, { is_open: updated.is_open })
            setSelectedRestaurant(updated)
            setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r))
            showToast(`Restaurant is now ${updated.is_open ? 'OPEN' : 'CLOSED'}`, 'info')
        } catch (err) {
            showToast('Failed to update status', 'error')
        }
    }

    const handleSaveMenuItem = async (e) => {
        e.preventDefault()
        try {
            if (editingItem) {
                // Update
                const res = await api.put(`/menu/${editingItem.id}`, menuForm)
                setMenuItems(prev => prev.map(i => i.id === editingItem.id ? res.data : i))
                showToast('Item updated', 'success')
            } else {
                // Create
                const res = await api.post('/menu', { ...menuForm, restaurant_id: selectedRestaurant.id })
                setMenuItems([...menuItems, res.data])
                showToast('Item created', 'success')
            }
            setIsMenuModalOpen(false)
            setMenuForm({ name: '', description: '', price: '', category: 'Main', image: '', is_available: true })
            setEditingItem(null)
        } catch (err) {
            showToast('Failed to save item', 'error')
        }
    }

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Delete this item?')) return
        try {
            await api.delete(`/menu/${id}`)
            setMenuItems(prev => prev.filter(i => i.id !== id))
            showToast('Item deleted', 'success')
        } catch (err) {
            showToast('Failed to delete item', 'error')
        }
    }

    const openMenuModal = (item = null) => {
        if (item) {
            setEditingItem(item)
            setMenuForm({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                image: item.image,
                is_available: item.is_available
            })
        } else {
            setEditingItem(null)
            setMenuForm({ name: '', description: '', price: '', category: 'Main', image: '', is_available: true })
        }
        setIsMenuModalOpen(true)
    }

    if (loading) return <Spinner fullPage />

    return (
        <div className="manager-page">
            {/* LEFT SIDEBAR */}
            <div className="manager-sidebar">
                <div className="sidebar-header">
                    <h2>Restaurants</h2>
                    <button className="btn btn-outline btn-sm w-100" onClick={() => setIsRestModalOpen(true)}>+ Add New</button>
                </div>
                <div className="restaurant-list">
                    {restaurants.map(r => (
                        <div
                            key={r.id}
                            className={`sidebar-item ${selectedRestaurant?.id === r.id ? 'active' : ''}`}
                            onClick={() => setSelectedRestaurant(r)}
                        >
                            <div className={`status-dot ${r.is_open ? 'green' : 'red'}`} />
                            <div>
                                <div className="r-name">{r.name}</div>
                                <div className="r-cuisine">{r.cuisine}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="manager-content">
                {!selectedRestaurant ? (
                    <div className="empty-state">
                        <div>🏪</div>
                        <h3>Select a restaurant to manage</h3>
                    </div>
                ) : (
                    <div className="dashboard-content">

                        {/* Section 1: Info Card */}
                        <div className="card info-card">
                            <div className="info-header">
                                <div>
                                    <h1 className="flex-center-row">{selectedRestaurant.name}
                                        <span className={`status-badge-lg ${selectedRestaurant.is_open ? 'open' : 'closed'}`}>
                                            {selectedRestaurant.is_open ? 'Open' : 'Closed'}
                                        </span>
                                    </h1>
                                    <p className="text-muted">{selectedRestaurant.cuisine} • {selectedRestaurant.address}</p>
                                </div>
                                <div className="card-actions">
                                    <button className="btn btn-outline" onClick={handleToggleOpen}>
                                        {selectedRestaurant.is_open ? 'Close Restaurant' : 'Open Restaurant'}
                                    </button>
                                    <button className="btn btn-danger" onClick={handleDeleteRestaurant}>Delete</button>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Menu Items */}
                        <div className="section-header">
                            <h3>Menu Items</h3>
                            <button className="btn btn-primary" onClick={() => openMenuModal()}>+ Add Item</button>
                        </div>

                        <div className="menu-items-grid">
                            {menuItems.map(item => (
                                <div key={item.id} className="manager-item-card card">
                                    <div className="item-img" style={{ backgroundImage: `url(${item.image || ''})`, backgroundColor: '#eee' }}>
                                        {!item.image && '🍔'}
                                    </div>
                                    <div className="item-info-col">
                                        <h4>{item.name}</h4>
                                        <p className="desc">{item.description}</p>
                                        <span className="price">${parseFloat(item.price).toFixed(2)}</span>
                                    </div>
                                    <div className="item-actions-col">
                                        <button className="icon-btn" onClick={() => openMenuModal(item)}>✏️</button>
                                        <button className="icon-btn text-red" onClick={() => handleDeleteItem(item.id)}>🗑</button>
                                        <label className="toggle-label">
                                            <span style={{ fontSize: '0.8rem' }}>Avail</span>
                                            <input
                                                type="checkbox"
                                                checked={item.is_available}
                                                onChange={async () => {
                                                    try {
                                                        await api.put(`/menu/${item.id}`, { is_available: !item.is_available })
                                                        setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, is_available: !item.is_available } : i))
                                                        showToast('Availability updated', 'success')
                                                    } catch (e) { showToast('Failed', 'error') }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 3: Recent Orders */}
                        <div className="section-header">
                            <h3>Recent Orders</h3>
                        </div>
                        {recentOrders.length === 0 ? <p className="text-muted">No orders yet.</p> : (
                            <div className="recent-orders-list">
                                {recentOrders.map(order => (
                                    <div key={order.id} className="card recent-order-card">
                                        <div className="ro-header">
                                            <span className="ro-id">#{order.id.slice(0, 6)}</span>
                                            <span className="ro-time">{new Date(order.created_at).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="ro-body">
                                            <div>{order.customer_name}</div>
                                            <div>{order.order_items?.length} items • ${order.total_amount}</div>
                                        </div>
                                        <div className="ro-footer">
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Restaurant Modal */}
            <Modal isOpen={isRestModalOpen} onClose={() => setIsRestModalOpen(false)} title="Add Restaurant">
                <form onSubmit={handleCreateRestaurant}>
                    <div className="form-group">
                        <label>Name</label>
                        <input required type="text" value={restForm.name} onChange={e => setRestForm({ ...restForm, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Cuisine</label>
                        <input required type="text" value={restForm.cuisine} onChange={e => setRestForm({ ...restForm, cuisine: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input required type="text" value={restForm.address} onChange={e => setRestForm({ ...restForm, address: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" value={restForm.image} onChange={e => setRestForm({ ...restForm, image: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Create</button>
                </form>
            </Modal>

            {/* Menu Item Modal */}
            <Modal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} title={editingItem ? 'Edit Item' : 'Add Item'}>
                <form onSubmit={handleSaveMenuItem}>
                    <div className="form-group">
                        <label>Name</label>
                        <input required type="text" value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input required type="number" step="0.01" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}>
                            <option value="Starter">Starter</option>
                            <option value="Main">Main</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Drink">Drink</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" value={menuForm.image} onChange={e => setMenuForm({ ...menuForm, image: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Save</button>
                </form>
            </Modal>

        </div>
    )
}

export default RestaurantManagerPage

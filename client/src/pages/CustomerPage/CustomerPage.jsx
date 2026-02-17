import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import './CustomerPage.css'

const CustomerPage = () => {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await api.get('/restaurants')
                setRestaurants(res.data)
            } catch (err) {
                setError('Failed to load restaurants')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchRestaurants()
    }, [])

    const filteredRestaurants = restaurants.filter(r => {
        const matchesCuisine = filter === 'All' || r.cuisine === filter
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCuisine && matchesSearch
    })

    const cuisines = ['All', 'Italian', 'American', 'Japanese', 'Indian', 'Chinese']

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '20px' }}>
                <div className="skeleton-grid">
                    {[...Array(6)].map((_, i) => <div key={i} className="skeleton card" style={{ height: 300 }} />)}
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="empty-state"><h3>⚠️ {error}</h3></div>
    }

    return (
        <div className="customer-page">
            <div className="hero-section">
                <div className="container">
                    <h1>🍕 Order Food You Love</h1>
                    <p>Fresh food delivered to your door</p>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search restaurants..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="cuisine-filters">
                    {cuisines.map(c => (
                        <button
                            key={c}
                            className={`filter-pill ${filter === c ? 'active' : ''}`}
                            onClick={() => setFilter(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {filteredRestaurants.length === 0 ? (
                    <div className="empty-state">
                        <div>🍽️</div>
                        <h3>No restaurants found</h3>
                    </div>
                ) : (
                    <div className="restaurant-grid grid-3">
                        {filteredRestaurants.map(r => (
                            <Link to={r.is_open ? `/menu/${r.id}` : '#'} key={r.id} className="restaurant-card">
                                <div className="card-image" style={{ backgroundImage: `url(${r.image || 'https://via.placeholder.com/500'})` }}>
                                    <span className="cuisine-tag">{r.cuisine}</span>
                                    <span className={`status-tag ${r.is_open ? 'open' : 'closed'}`}>
                                        {r.is_open ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                                <div className="card-content">
                                    <h3>{r.name}</h3>
                                    <p>{r.address}</p>
                                    <button className="btn btn-primary btn-block" disabled={!r.is_open}>
                                        {r.is_open ? 'Order Now →' : 'Closed'}
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerPage

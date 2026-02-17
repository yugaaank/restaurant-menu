import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
    return (
        <div className="restaurant-card">
            <div className="card-img-container">
                {restaurant.image ? (
                    <img src={restaurant.image} alt={restaurant.name} className="card-img" />
                ) : (
                    <div className="card-img-placeholder"></div>
                )}
                {!restaurant.isOpen && <div className="closed-overlay">Closed</div>}
            </div>
            <div className="card-body">
                <div className="card-header">
                    <h3 className="card-title">{restaurant.name}</h3>
                    <span className="badge">{restaurant.cuisine}</span>
                </div>
                <p className="card-address">{restaurant.address}</p>
                <div className="card-footer">
                    <span className={`status-dot ${restaurant.isOpen ? 'open' : 'closed'}`}>
                        {restaurant.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    {restaurant.isOpen ? (
                        <Link to={`/menu/${restaurant._id}`} className="btn btn-primary btn-sm">
                            Order Now
                        </Link>
                    ) : (
                        <button className="btn btn-secondary btn-sm" disabled>
                            Closed
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;

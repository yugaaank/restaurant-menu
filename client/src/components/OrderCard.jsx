import React, { useState } from 'react';
import axios from '../api/axios';
import StatusBadge from './StatusBadge';
import './OrderCard.css';

const OrderCard = ({ order, isAdmin = false, onStatusChange }) => {
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setUpdating(true);
        try {
            await axios.put(`/orders/${order._id}/status`, { status: newStatus });
            if (onStatusChange) onStatusChange(order._id, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="order-card">
            <div className="order-header">
                <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                <span className="order-time">{timeAgo(order.createdAt)}</span>
            </div>

            <div className="order-details">
                <div className="order-info-row">
                    <span className="info-label">Customer:</span>
                    <span className="info-value">
                        {order.customerName} <span className="text-muted">({order.customerPhone})</span>
                    </span>
                </div>
                <div className="order-info-row">
                    <span className="info-label">Restaurant:</span>
                    <span className="info-value">{order.restaurant?.name || 'Unknown'}</span>
                </div>

                <div className="order-items-list">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-summary">
                            <span className="item-qty">{item.quantity}x</span>
                            <span className="item-name">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-footer">
                <div className="order-total">₹{order.totalAmount.toFixed(2)}</div>

                {isAdmin ? (
                    <div className="status-select-container">
                        <select
                            value={order.status}
                            onChange={handleStatusChange}
                            disabled={updating}
                            className={`status-select ${order.status}`}
                        >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                ) : (
                    <StatusBadge status={order.status} />
                )}
            </div>
        </div>
    );
};

export default OrderCard;

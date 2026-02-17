import React from 'react'
import './StatCard.css'

const StatCard = ({ icon, label, value, borderColor }) => {
    return (
        <div className="stat-card" style={{ borderLeftColor: borderColor }}>
            <div className="stat-info">
                <h4 className="stat-value">{value}</h4>
                <span className="stat-label">{label}</span>
            </div>
            <div className="stat-icon">{icon}</div>
        </div>
    )
}

export default StatCard

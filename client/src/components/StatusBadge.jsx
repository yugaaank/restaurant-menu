import React from 'react'
import './StatusBadge.css'

const StatusBadge = ({ status }) => {
    const formatStatus = (s) => {
        return s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    return (
        <span className={`badge status-${status}`}>
            {formatStatus(status)}
        </span>
    )
}

export default StatusBadge

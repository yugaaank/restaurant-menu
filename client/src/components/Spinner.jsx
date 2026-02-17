import React from 'react'
import './Spinner.css'

const Spinner = ({ size = 'md', fullPage = false }) => {
    if (fullPage) {
        return (
            <div className="spinner-overlay">
                <div className={`spinner spinner-${size}`} />
            </div>
        )
    }
    return <div className={`spinner spinner-${size}`} />
}

export default Spinner

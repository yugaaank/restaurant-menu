import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import restaurantRoutes from './routes/restaurants.js'
import menuRoutes from './routes/menu.js'
import orderRoutes from './routes/orders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

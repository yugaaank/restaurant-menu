import express from 'express'
import * as orderController from '../controllers/orderController.js'

const router = express.Router()

router.get('/restaurant/:restaurantId', orderController.getByRestaurant)
router.get('/', orderController.getAll)
router.get('/:id', orderController.getOne)
router.post('/', orderController.create)
router.put('/:id/status', orderController.updateStatus)

export default router

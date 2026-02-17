import express from 'express'
import * as restaurantController from '../controllers/restaurantController.js'

const router = express.Router()

router.get('/', restaurantController.getAll)
router.get('/:id', restaurantController.getOne)
router.post('/', restaurantController.create)
router.put('/:id', restaurantController.update)
router.delete('/:id', restaurantController.remove)

export default router

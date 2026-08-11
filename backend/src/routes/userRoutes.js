import { Router } from 'express'

import { changePassword, getProfile, getUserById, updateProfile } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import { validateChangePassword, validateUpdateProfile } from '../middleware/validation.js'

const router = Router()

router.get('/profile', protect, getProfile)
router.get('/me', protect, getProfile)
router.put('/profile', protect, validateUpdateProfile, updateProfile)
router.put('/change-password', protect, validateChangePassword, changePassword)
router.get('/:id', getUserById)

export default router
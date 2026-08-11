import { Router } from 'express'

import { loginUser, logoutUser, registerUser } from '../controllers/authController.js'
import { validateLogin, validateRegister } from '../middleware/validation.js'

const router = Router()

router.post('/register', validateRegister, registerUser)
router.post('/login', validateLogin, loginUser)
router.post('/logout', logoutUser)

export default router
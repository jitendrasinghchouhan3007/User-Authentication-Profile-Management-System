import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'
import { httpError } from '../utils/httpError.js'

export function formatUserPayload(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    bio: user.bio,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export async function registerUser(req, res, next) {
  try {
    const { name, email, password, bio } = req.body

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() })

    if (existingUser) {
      return next(httpError(409, 'An account with this email address already exists'))
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      bio: bio?.trim() || undefined,
    })

    const token = generateToken(user._id.toString())

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: formatUserPayload(user),
    })
  } catch (error) {
    next(error)
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.trim().toLowerCase() })

    if (!user || !(await user.comparePassword(password.trim()))) {
      return next(httpError(401, 'Invalid email or password'))
    }

    const token = generateToken(user._id.toString())

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUserPayload(user),
    })
  } catch (error) {
    next(error)
  }
}

export async function logoutUser(req, res) {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}
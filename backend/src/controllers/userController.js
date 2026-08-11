import User from '../models/User.js'
import { httpError } from '../utils/httpError.js'
import { formatUserPayload } from './authController.js'

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return next(httpError(404, 'User profile not found'))
    }

    res.status(200).json({
      success: true,
      user: formatUserPayload(user),
    })
  } catch (error) {
    next(error)
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, bio } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return next(httpError(404, 'User not found'))
    }

    if (name !== undefined) user.name = name.trim()
    if (bio !== undefined) user.bio = bio.trim()

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserPayload(user),
    })
  } catch (error) {
    next(error)
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return next(httpError(404, 'User not found'))
    }

    const isMatch = await user.comparePassword(currentPassword.trim())
    if (!isMatch) {
      return next(httpError(400, 'Current password is incorrect'))
    }

    if (currentPassword.trim() === newPassword.trim()) {
      return next(httpError(400, 'New password must be different from current password'))
    }

    user.password = newPassword.trim()
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return next(httpError(404, 'User not found'))
    }

    res.status(200).json({
      success: true,
      user: formatUserPayload(user),
    })
  } catch (error) {
    next(error)
  }
}
import { httpError } from '../utils/httpError.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return next(httpError(400, 'Name is required'))
  }
  if (name.trim().length < 2) {
    return next(httpError(400, 'Name must be at least 2 characters long'))
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return next(httpError(400, 'Email is required'))
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return next(httpError(400, 'Please provide a valid email address'))
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    return next(httpError(400, 'Password is required'))
  }
  if (password.trim().length < 6) {
    return next(httpError(400, 'Password must be at least 6 characters long'))
  }

  next()
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body

  if (!email || typeof email !== 'string' || !email.trim()) {
    return next(httpError(400, 'Email is required'))
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    return next(httpError(400, 'Password is required'))
  }

  next()
}

export function validateUpdateProfile(req, res, next) {
  const { name } = req.body

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      return next(httpError(400, 'Name cannot be empty'))
    }
    if (name.trim().length < 2) {
      return next(httpError(400, 'Name must be at least 2 characters long'))
    }
  }

  next()
}

export function validateChangePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || typeof currentPassword !== 'string' || !currentPassword.trim()) {
    return next(httpError(400, 'Current password is required'))
  }
  if (!newPassword || typeof newPassword !== 'string' || !newPassword.trim()) {
    return next(httpError(400, 'New password is required'))
  }
  if (newPassword.trim().length < 6) {
    return next(httpError(400, 'New password must be at least 6 characters long'))
  }

  next()
}

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
  const { isAuthenticated, register } = useAuth()
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formValues.name.trim() || !formValues.email.trim() || !formValues.password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (formValues.name.trim().length < 2) {
      setError('Name must be at least 2 characters long.')
      return
    }

    if (formValues.password.trim().length < 6) {
      setError('Password should be at least 6 characters long.')
      return
    }

    try {
      setBusy(true)
      setError('')
      await register({
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password.trim(),
        bio: formValues.bio.trim() || undefined,
      })
      navigate('/')
    } catch (registerError) {
      setError(registerError.message || 'Could not create your account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Create Account</p>
      <h1>Join the Platform</h1>
      <p className="auth-card__copy">
        Register your account to manage your profile and update security settings.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-group" htmlFor="register-name">
          <span>Name</span>
          <input
            id="register-name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </label>

        <label className="field-group" htmlFor="register-email">
          <span>Email</span>
          <input
            id="register-email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />
        </label>

        <label className="field-group" htmlFor="register-password">
          <span>Password</span>
          <input
            id="register-password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Choose a password (min 6 characters)"
            required
          />
        </label>

        <label className="field-group" htmlFor="register-bio">
          <span>Short Bio (Optional)</span>
          <textarea
            id="register-bio"
            name="bio"
            rows="3"
            value={formValues.bio}
            onChange={handleChange}
            placeholder="Tell us a little about yourself"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="button" disabled={busy}>
          {busy ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="auth-card__footer">
        Already registered?{' '}
        <Link to="/login" className="text-link">
          Log in here
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage
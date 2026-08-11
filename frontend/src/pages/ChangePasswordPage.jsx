import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function ChangePasswordPage() {
  const { changePassword } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from your current password.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    try {
      setBusy(true)
      setError('')
      setSuccess('')
      const msg = await changePassword({ currentPassword, newPassword })
      setSuccess(msg || 'Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      setError(err.message || 'Could not update password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Account Security</p>
      <h1>Change Your Password</h1>
      <p className="auth-card__copy">
        Update your password to ensure secure authentication. Passwords are encrypted using bcrypt hashing.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-group" htmlFor="current-password">
          <span>Current Password</span>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value)
              if (error) setError('')
              if (success) setSuccess('')
            }}
            placeholder="Enter your current password"
            required
          />
        </label>

        <label className="field-group" htmlFor="new-password">
          <span>New Password</span>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value)
              if (error) setError('')
              if (success) setSuccess('')
            }}
            placeholder="Min 6 characters"
            required
          />
        </label>

        <label className="field-group" htmlFor="confirm-new-password">
          <span>Confirm New Password</span>
          <input
            id="confirm-new-password"
            type="password"
            value={confirmNewPassword}
            onChange={(event) => {
              setConfirmNewPassword(event.target.value)
              if (error) setError('')
              if (success) setSuccess('')
            }}
            placeholder="Re-enter new password"
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}
        {success ? (
          <p style={{ color: 'var(--sage-main)', margin: 0, fontWeight: 700 }}>
            {success}
          </p>
        ) : null}

        <button type="submit" className="button" disabled={busy}>
          {busy ? 'Updating password...' : 'Update Password'}
        </button>
      </form>
    </section>
  )
}

export default ChangePasswordPage

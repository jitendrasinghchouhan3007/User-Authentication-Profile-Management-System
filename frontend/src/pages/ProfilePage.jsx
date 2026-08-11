import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function ProfilePage() {
  const { user, updateProfile } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Name is required.')
      return
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long.')
      return
    }

    try {
      setBusy(true)
      setError('')
      setSuccess('')
      const updatedUser = await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
      })
      setName(updatedUser.name)
      setBio(updatedUser.bio || '')
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.message || 'Could not update profile.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Profile Management</p>
      <h1>Manage Your Profile</h1>
      <p className="auth-card__copy">
        Update your display name and public bio. Your registered email address serves as your primary account identifier.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-group" htmlFor="profile-email">
          <span>Email Address (Read-only)</span>
          <input
            id="profile-email"
            type="email"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.7, cursor: 'not-allowed' }}
          />
        </label>

        <label className="field-group" htmlFor="profile-name">
          <span>Full Name</span>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError('')
              if (success) setSuccess('')
            }}
            placeholder="Your full name"
            required
          />
        </label>

        <label className="field-group" htmlFor="profile-bio">
          <span>Bio / Description</span>
          <textarea
            id="profile-bio"
            rows="4"
            value={bio}
            onChange={(event) => {
              setBio(event.target.value)
              if (error) setError('')
              if (success) setSuccess('')
            }}
            placeholder="Tell us a little about yourself"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}
        {success ? (
          <p style={{ color: 'var(--sage-main)', margin: 0, fontWeight: 700 }}>
            {success}
          </p>
        ) : null}

        <button type="submit" className="button" disabled={busy}>
          {busy ? 'Saving profile...' : 'Save Profile'}
        </button>
      </form>
    </section>
  )
}

export default ProfilePage

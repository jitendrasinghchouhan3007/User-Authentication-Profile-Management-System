import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
  const { user } = useAuth()

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently'

  return (
    <div className="stack-lg">
      {/* Hero Panel */}
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard Overview</p>
          <h1>Welcome, {user?.name}!</h1>
          <p className="hero-panel__copy">
            You are securely authenticated into your account. Use this dashboard to manage your user profile or update your security credentials.
          </p>
        </div>

        <div className="hero-panel__actions">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/profile" className="button">
              Manage Profile
            </Link>
            <Link to="/change-password" className="button button--ghost">
              Change Password
            </Link>
          </div>
        </div>
      </section>

      {/* Account Details Card */}
      <section className="surface-card">
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Account Details</p>
            <h2>Authenticated Session Summary</h2>
          </div>
        </div>

        <div className="toolbar-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="blog-card" style={{ minHeight: 'auto' }}>
            <span className="eyebrow">Full Name</span>
            <h2>{user?.name}</h2>
            <p className="blog-card__excerpt">Registered account holder name</p>
          </div>

          <div className="blog-card" style={{ minHeight: 'auto' }}>
            <span className="eyebrow">Email Address</span>
            <h2 style={{ fontSize: '1.4rem' }}>{user?.email}</h2>
            <p className="blog-card__excerpt">Primary account login identifier</p>
          </div>

          <div className="blog-card" style={{ minHeight: 'auto' }}>
            <span className="eyebrow">Account Role</span>
            <h2 style={{ textTransform: 'capitalize' }}>{user?.role || 'User'}</h2>
            <p className="blog-card__excerpt">Access control permission tier</p>
          </div>

          <div className="blog-card" style={{ minHeight: 'auto' }}>
            <span className="eyebrow">Member Since</span>
            <h2>{formattedDate}</h2>
            <p className="blog-card__excerpt">Account creation registration date</p>
          </div>
        </div>
      </section>

      {/* Profile & Security Quick Actions */}
      <section className="surface-card">
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Quick Actions</p>
            <h2>Profile & Security Settings</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="blog-card" style={{ minHeight: 'auto' }}>
            <h2>Edit Profile</h2>
            <p className="blog-card__excerpt">
              {user?.bio ? `Bio: "${user.bio}"` : 'Update your display name and bio information.'}
            </p>
            <div className="blog-card__footer">
              <Link to="/profile" className="button button--ghost">
                Go to Profile &rarr;
              </Link>
            </div>
          </div>

          <div className="blog-card" style={{ minHeight: 'auto' }}>
            <h2>Change Password</h2>
            <p className="blog-card__excerpt">
              Update your password using bcrypt salt encryption to maintain secure account access.
            </p>
            <div className="blog-card__footer">
              <Link to="/change-password" className="button button--ghost">
                Go to Password Settings &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage

import { createContext, useEffect, useState } from 'react'
import { authApi, userApi } from '../api/client'

const AuthContext = createContext(null)
const storageKey = 'auth-vault-session'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      userApi
        .getProfile()
        .then((res) => {
          if (res.user) {
            setUser(res.user)
            setToken(storedToken)
          } else {
            localStorage.removeItem('token')
            setToken('')
            setUser(null)
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
          setToken('')
          setUser(null)
        })
        .finally(() => {
          setIsAuthReady(true)
        })
    } else {
      setIsAuthReady(true)
    }
  }, [])

  async function login(credentials) {
    const data = await authApi.login(credentials)
    if (data.token) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
    }
    return data.user
  }

  async function register(profile) {
    const data = await authApi.register(profile)
    if (data.token) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
    }
    return data.user
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Ignore error during logout
    } finally {
      localStorage.removeItem('token')
      setToken('')
      setUser(null)
    }
  }

  async function updateProfile(payload) {
    const res = await userApi.updateProfile(payload)
    if (res.user) {
      setUser(res.user)
    }
    return res.user
  }

  async function changePassword(payload) {
    const res = await userApi.changePassword(payload)
    return res.message
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isAuthReady,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
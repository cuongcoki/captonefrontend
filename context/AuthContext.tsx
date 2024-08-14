'use client'

// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

// ** Config
import authConfig from '@/configs/auth'

// ** Types
import { AuthValuesType } from './types'
import { UsersType } from '@/types/userTypes'
import { authService } from '@/auth/authService'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UsersType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const storedRefreshToken = window.localStorage.getItem(authConfig.onTokenExpiration)

      if (!storedToken || !storedRefreshToken) {
        router.push('/sign-in')
        setLoading(false)
        return
      }

      const decodedToken: any = jwtDecode(storedToken)
      const currentTime = Date.now() / 1000
      console.log('decodedToken', decodedToken)
      if (decodedToken.exp < currentTime) {
        try {
          const response = await authService.refreshToken()
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data
          console.log("Authssseiver ========== ",response.data.data)
          authService.setLocalStorageWhenLogin({
            user: JSON.parse(window.localStorage.getItem(authConfig.userData) || '{}'),
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          })
          setUser(JSON.parse(window.localStorage.getItem(authConfig.userData) || '{}'))
        } catch (error) {
          console.error('Failed to refresh token', error)
          handleLogout()
        }
      } else {
        setUser(JSON.parse(window.localStorage.getItem(authConfig.userData) || '{}'))
      }

      setLoading(false)
    }

    initAuth()

    const interval = setInterval(() => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        const decodedToken: any = jwtDecode(storedToken)
        const currentTime = Date.now() / 1000

        if (decodedToken.exp < currentTime + 60) { // Refresh token 1 minute before it expires
          authService.refreshToken().then(response => {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data

            authService.setLocalStorageWhenLogin({
              user: JSON.parse(window.localStorage.getItem(authConfig.userData) || '{}'),
              accessToken: newAccessToken,
              refreshToken: newRefreshToken
            })
            setUser(JSON.parse(window.localStorage.getItem(authConfig.userData) || '{}'))
          }).catch(error => {
            console.error('Failed to refresh token', error)
            handleLogout()
          })
        }
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [])

  const handleLogin = (data: UsersType, rememberMe: boolean, accessToken: string, refreshToken: string) => {
    setUser({ ...data, accessToken })
    setLoading(false)
    authService.setLocalStorageWhenLogin({ accessToken, refreshToken, user: { ...data, accessToken } })
    setLoading(false)
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.onTokenExpiration)
    router.push('/sign-in')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

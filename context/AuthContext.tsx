'use client'

// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import

// ** Config
import authConfig from '@/configs/auth'

// ** Types
import { AuthValuesType } from './types'
import { UsersType } from '@/types/userTypes'
import { useRouter } from 'next/navigation'
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
      
      if (!storedToken) {
        router.push('/sign-in')
      } else {
        setUser(JSON.parse(window.localStorage.getItem(authConfig.userData) || '{}'))
      }
      setLoading(false)
    }

    initAuth()
   
  }, [])

  const handleLogin = (data: UsersType, rememberMe: boolean, accessToken: string, refreshToken: string) => {
    setUser({ ...data, accessToken })
    setLoading(false)
    authService.setLocalStorageWhenLogin({ accessToken, refreshToken, user: { ...data, accessToken } })
    setLoading(false);
  }

  const handleLogout = () => {

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

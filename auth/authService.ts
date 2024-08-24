// ** Auth config import
import jwtConfig from '@/configs/auth'

// ** Jsonwebtoken import
import jwt from 'jsonwebtoken'

// ** Axios import
import axios from 'axios'
import { UsersType } from '@/types/userTypes'
import { endPointConstant } from '@/constants/endpoint'
import { jwtDecode } from 'jwt-decode'

// ** Types
export type LoginPayload = {
  user: UsersType
  accessToken: string
  refreshToken: string
}

export const authService = {
  refreshToken: async () => {
    const apiUrl = `${endPointConstant.BASE_URL}/auth/refresh-token`
    const storedToken = window.localStorage.getItem(jwtConfig.storageTokenKeyName)
  
    if (!storedToken) {
      throw new Error('No token found')
    }
  
    const payload: any = jwtDecode(storedToken)
    console.log("Payload ====== ===", payload)
  
    const refreshToken = localStorage.getItem(jwtConfig.onTokenExpiration) // Đảm bảo key đúng
    if (!refreshToken) {
      throw new Error('No refresh token found')
    }
  
    const data = {
      userId: payload?.UserID,
      refreshToken: refreshToken
    }
    console.log("Request data:", data)
  
    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log("authService response:", response.data)
  
      // Kiểm tra phản hồi API để đảm bảo chứa các token mới
      if (response.data && response.data.data) {
        return response
      } else {
        throw new Error('Invalid response from refresh token API')
      }
    } catch (err: any) {
      console.error('authService Error refreshing token:', err.response ? err.response.data : err)
      throw err
    }
  },
  setLocalStorageWhenLogin: (payload: LoginPayload) => {
    localStorage.setItem(jwtConfig.userData, JSON.stringify(payload.user))
    localStorage.setItem(jwtConfig.storageTokenKeyName, payload.accessToken)
    localStorage.setItem(jwtConfig.onTokenExpiration, payload.refreshToken)
  },
  removeLocalStorageWhenLogout: () => {
    localStorage.removeItem(jwtConfig.userData)
    localStorage.removeItem(jwtConfig.expires)
    localStorage.removeItem(jwtConfig.storageTokenKeyName)
    localStorage.removeItem(jwtConfig.onTokenExpiration)
  },
  updateUser: (payload: any) => {
    localStorage.setItem(jwtConfig.userData, JSON.stringify(payload.user))
  },
  updateStorageWhenRefreshToken: (payload: LoginPayload) => {
    localStorage.setItem(jwtConfig.storageTokenKeyName, payload.accessToken)
    localStorage.setItem(jwtConfig.onTokenExpiration, payload.refreshToken)
  }
}

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
    const payload:any = jwtDecode(storedToken || '') 
    console.log("Pyloadđ ====== ===",payload)
    const refreshTokenApi = axios.create({
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = {
      userId: payload?.UserID,
      refreshToken: localStorage.getItem(jwtConfig.onTokenExpiration)
    }

    try {
      const response = await refreshTokenApi.post(apiUrl, data)
      console.log("response=====response=====response",response.data)
      return response
    } catch (err: any) {
      console.error('Error refreshing token:', err.response ? err.response.data : err)
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

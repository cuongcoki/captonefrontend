import { UsersType } from "@/types/userTypes"


export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  id: string
  password: string
  rememberMe?: boolean
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UsersType | null
  setLoading: (value: boolean) => void
  setUser: (value: UsersType | null) => void
  login: (data: UsersType, rememberMe: boolean, accessToken: string, refreshToken: string) => void
}


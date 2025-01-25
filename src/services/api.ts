import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export interface User {
  id?: string
  name: string
  email: string
  phone: string
  secondaryEmail?: string
  cnpj?: string
  street?: string
  number?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
  latitude?: number
  longitude?: number
}

export interface ApiError {
  message: string
  status: number
}

export const userService = {
  async create(data: Pick<User, 'name' | 'email' | 'phone'>) {
    try {
      const response = await api.post<User>('/users', data)
      return response.data
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Erro ao criar usuário',
        status: error.response?.status || 500
      } as ApiError
    }
  },

  async validateField(field: 'email' | 'phone', value: string) {
    try {
      const response = await api.get(`/users/validate?${field}=${value}`)
      return response.data
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Erro ao validar campo',
        status: error.response?.status || 500
      } as ApiError
    }
  },

  async verifyEmail(userId: string, code: string) {
    try {
      const response = await api.post(`/users/verify-email/${userId}`, { code })
      return response.data
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Erro ao verificar e-mail',
        status: error.response?.status || 500
      } as ApiError
    }
  },

  async resendVerificationCode(email: string) {
    try {
      const response = await api.post('/users/resend-verification', { email })
      return response.data
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Erro ao reenviar código',
        status: error.response?.status || 500
      } as ApiError
    }
  },

  async getAddressByCep(cep: string) {
    try {
      const response = await api.get(`/users/address/${cep}`)
      return response.data
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Erro ao buscar endereço',
        status: error.response?.status || 500
      } as ApiError
    }
  },

  async updateUser(userId: string, data: Partial<User>) {
    try {
      const response = await api.put(`/users/${userId}`, data)
      return response.data
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Erro ao atualizar usuário',
        status: error.response?.status || 500
      } as ApiError
    }
  }
} 
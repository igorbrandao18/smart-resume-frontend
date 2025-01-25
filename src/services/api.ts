import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export interface User {
  id: string
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

interface CnpjResponse {
  cnpj_raiz: string
  razao_social: string
  capital_social: string
  porte: {
    id: string
    descricao: string
  }
  natureza_juridica: {
    id: string
    descricao: string
  }
  estabelecimento: {
    cnpj: string
    tipo: string
    nome_fantasia: string
    situacao_cadastral: string
    data_situacao_cadastral: string
    data_inicio_atividade: string
    tipo_logradouro: string
    logradouro: string
    numero: string
    complemento: string | null
    bairro: string
    cep: string
    ddd1: string
    telefone1: string
    email: string
    atividade_principal: {
      id: string
      descricao: string
    }
    estado: {
      id: number
      nome: string
      sigla: string
    }
    cidade: {
      id: number
      nome: string
    }
  }
}

class ApiError extends Error {
  status: number

  constructor(error: any) {
    super(error.response?.data?.message || 'Erro ao processar requisição')
    this.status = error.response?.status || 500
  }
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

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    try {
      const response = await api.put(`/users/${userId}`, data)
      return response.data
    } catch (error: any) {
      throw new ApiError(error)
    }
  },

  async getCnpjData(cnpj: string): Promise<CnpjResponse> {
    try {
      const response = await api.get(`/users/cnpj/${cnpj}`)
      return response.data
    } catch (error: any) {
      throw new ApiError(error)
    }
  },
} 
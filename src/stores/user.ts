import { defineStore } from 'pinia'
import type { User } from '@/services/api'

interface UserState {
  currentUser: Partial<User> | null
  verificationEmail: string | null
  verificationUserId: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    verificationEmail: null,
    verificationUserId: null
  }),
  
  actions: {
    setCurrentUser(user: Partial<User>) {
      this.currentUser = user
    },
    setVerificationData(email: string, userId: string) {
      this.verificationEmail = email
      this.verificationUserId = userId
    },
    clearUser() {
      this.currentUser = null
      this.verificationEmail = null
      this.verificationUserId = null
    }
  }
}) 
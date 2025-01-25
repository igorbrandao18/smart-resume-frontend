<template>
  <div class="verify-email-page">
    <div class="form-container">
      <div class="form-header">
        <img :src="notoriunLogo" alt="Notoriun" class="logo" />
        <h1 class="title">Verifique seu e-mail</h1>
        <p class="subtitle">
          Digite o código de 6 dígitos que enviamos para <br>
          <strong>{{ userStore.verificationEmail }}</strong>
        </p>
      </div>

      <v-form @submit.prevent="handleSubmit" class="form-content">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
              <v-text-field
                v-model="code"
                label="Código de verificação"
                placeholder="Digite o código"
                :rules="[rules.required, rules.length]"
                maxlength="6"
                type="text"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                class="custom-field text-center"
                :loading="isLoading"
                :error-messages="error"
                hide-details="auto"
              />

              <div class="d-flex flex-column align-center mt-8">
                <v-btn
                  type="submit"
                  color="primary"
                  size="x-large"
                  min-width="200"
                  :loading="isLoading"
                  :disabled="code.length < 6 || isLoading"
                  class="elevation-2 mb-6"
                >
                  <v-icon start icon="mdi-check" class="mr-2" />
                  Verificar código
                </v-btn>

                <div class="text-center">
                  <span class="text-medium-emphasis">Não recebeu o código?</span>
                  <v-btn
                    variant="text"
                    color="primary"
                    class="ml-1"
                    :disabled="isResending"
                    @click="resendCode"
                  >
                    Reenviar código
                    <v-progress-circular
                      v-if="isResending"
                      indeterminate
                      size="20"
                      width="2"
                      color="primary"
                      class="ml-2"
                    />
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userService } from '@/services/api'
import notoriunLogo from '@/assets/notoriun.svg'

const router = useRouter()
const userStore = useUserStore()
const code = ref('')
const isLoading = ref(false)
const isResending = ref(false)
const error = ref('')

// Redireciona se não houver dados de verificação
if (!userStore.verificationEmail || !userStore.verificationUserId) {
  router.push('/register')
}

const rules = {
  required: (v: string) => !!v || 'Código é obrigatório',
  length: (v: string) => v.length === 6 || 'Código deve ter 6 dígitos'
}

const handleSubmit = async () => {
  if (code.value.length < 6) return
  error.value = ''

  try {
    isLoading.value = true
    // Verifica o código e navega imediatamente após sucesso
    await userService.verifyEmail(userStore.verificationUserId!, code.value)
    router.push('/complete-profile')
  } catch (err: any) {
    error.value = err.message
    console.error('Erro ao verificar código:', err)
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (!userStore.verificationEmail) return
  error.value = ''
  
  try {
    isResending.value = true
    await userService.resendVerificationCode(userStore.verificationEmail)
  } catch (err: any) {
    error.value = err.message
    console.error('Erro ao reenviar código:', err)
  } finally {
    isResending.value = false
  }
}
</script>

<style scoped>
.verify-email-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 2rem auto;
  overflow: hidden;
}

.form-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  padding: 3rem;
  text-align: center;
  color: white;
}

.logo {
  height: 40px;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
}

.form-content {
  padding: 3rem;
}

.custom-field {
  transition: all 0.3s ease;
}

.custom-field:hover {
  transform: translateY(-1px);
}

:deep(.v-field) {
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

:deep(.v-field:hover) {
  background-color: #fafafa !important;
}

:deep(.v-field--focused) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

:deep(.v-label) {
  font-size: 0.95rem;
  font-weight: 500;
}

:deep(.v-field__input) {
  font-size: 1.5rem !important;
  letter-spacing: 0.5rem;
}
</style> 
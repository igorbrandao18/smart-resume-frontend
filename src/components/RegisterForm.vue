<template>
  <v-form @submit.prevent="handleSubmit">
    <v-container class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="formData.name"
            label="Nome completo*"
            placeholder="Digite seu nome completo"
            variant="outlined"
            color="primary"
            bg-color="grey-lighten-4"
            :error-messages="errors.name"
            @update:model-value="validateField('name')"
            class="custom-field"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="formData.email"
            label="E-mail profissional*"
            placeholder="Digite seu e-mail"
            variant="outlined"
            color="primary"
            bg-color="grey-lighten-4"
            type="email"
            :error-messages="errors.email"
            @update:model-value="validateField('email')"
            @blur="validateEmailAvailability"
            class="custom-field"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="formData.phone"
            label="Celular*"
            placeholder="(00) 00000-0000"
            variant="outlined"
            color="primary"
            bg-color="grey-lighten-4"
            :error-messages="errors.phone"
            @input="handlePhoneInput"
            @blur="validatePhoneAvailability"
            class="custom-field"
          />
        </v-col>

        <v-col cols="12" class="mt-4">
          <v-btn
            type="submit"
            color="primary"
            size="x-large"
            block
            :loading="isLoading"
            :disabled="isLoading || !isFormValid"
            class="elevation-2"
          >
            <v-icon start icon="mdi-check" class="mr-2" />
            Criar minha conta
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '@/services/api'
import { formatPhone } from '@/utils/masks'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const form = ref(null)
const isLoading = ref(false)

const formData = reactive({
  name: '',
  email: '',
  phone: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  form: ''
})

const rules = {
  required: (v: string) => !!v || 'Este campo é obrigatório',
  name: (v: string) => {
    if (!v) return true
    if (v.length < 3) return 'Nome deve ter pelo menos 3 caracteres'
    if (!/^[a-zA-ZÀ-ÿ\s]*$/.test(v)) return 'Nome deve conter apenas letras'
    return true
  },
  email: (v: string) => {
    if (!v) return true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Digite um e-mail válido'
    return true
  },
  phone: (v: string) => {
    if (!v) return true
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(v)) return 'Digite um número válido'
    return true
  }
}

const validateField = async (field: keyof typeof formData) => {
  const value = formData[field]
  const fieldRules = [rules.required, rules[field as keyof typeof rules]]
  
  // Limpa erro anterior
  errors[field] = ''
  
  // Validação básica
  for (const rule of fieldRules) {
    const result = rule(value)
    if (result !== true) {
      errors[field] = result
      return false
    }
  }

  // Validação de disponibilidade apenas no blur
  return true
}

const validateEmailAvailability = async () => {
  if (!formData.email || errors.email) return

  try {
    const result = await userService.validateField('email', formData.email)
    errors.email = result.available ? '' : 'Este e-mail já está em uso'
  } catch (error: any) {
    errors.email = error.message
  }
}

const validatePhoneAvailability = async () => {
  if (!formData.phone || errors.phone) return

  try {
    const result = await userService.validateField('phone', formData.phone)
    errors.phone = result.available ? '' : 'Este número já está em uso'
  } catch (error: any) {
    errors.phone = error.message
  }
}

const isFormValid = computed(() => {
  return !Object.values(errors).some(error => error) && 
         Object.values(formData).every(value => value)
})

const handleSubmit = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    // Prepara os dados do usuário
    const userData = {
      ...formData,
      phone: formData.phone.replace(/\D/g, '')
    }
    
    // Cria o usuário e atualiza a store imediatamente
    const user = await userService.create(userData)
    
    if (user?.id) {
      // Atualiza store antes da navegação
      userStore.setCurrentUser(user)
      userStore.setVerificationData(user.email, user.id)
      
      // Navega para a verificação
      router.push('/verify-email')
    }
  } catch (error: any) {
    console.error('Error creating user:', error)
    errors.form = Array.isArray(error.message) ? error.message[0] : error.message
  } finally {
    isLoading.value = false
  }
}

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  formData.phone = formatPhone(value)
}
</script>

<style scoped>
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
</style> 
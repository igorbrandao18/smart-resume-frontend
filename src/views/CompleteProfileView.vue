<template>
  <div class="complete-profile-page">
    <div class="form-container">
      <div class="form-header">
        <img :src="notoriunLogo" alt="Notoriun" class="logo" />
        <h1 class="title">Complete seu cadastro</h1>
        <p class="subtitle">Preencha as informações abaixo para continuar</p>
      </div>

      <v-form @submit.prevent="handleSubmit" class="form-content">
        <v-container>
          <div class="section-title">
            <v-icon icon="mdi-office-building" color="primary" size="24" class="mr-2" />
            <span>Informações da Instituição</span>
          </div>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.cnpj"
                label="Número do CNPJ*"
                placeholder="Digite o número do CNPJ"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.name"
                label="Nome da Instituição*"
                placeholder="Digite o nome da Instituição"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.phone"
                label="Telefone de Contato*"
                placeholder="(00) 00000-0000"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.email"
                label="Email da Instituição*"
                placeholder="instituicao@financeira.com.br"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                class="custom-field"
              />
            </v-col>
          </v-row>

          <div class="section-title mt-8">
            <v-icon icon="mdi-map-marker" color="primary" size="24" class="mr-2" />
            <span>Localização</span>
          </div>

          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="formData.zipCode"
                label="CEP*"
                placeholder="Digite o CEP"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                :error-messages="errors.zipCode"
                @blur="handleCepBlur"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="formData.state"
                label="Estado*"
                placeholder="Estado"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                :readonly="isLoadingAddress"
                :loading="isLoadingAddress"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="formData.city"
                label="Cidade*"
                placeholder="Cidade"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                :readonly="isLoadingAddress"
                :loading="isLoadingAddress"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.street"
                label="Endereço*"
                placeholder="Exemplo: Avenida Brasil"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                :readonly="isLoadingAddress"
                :loading="isLoadingAddress"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="formData.number"
                label="Número*"
                placeholder="Exemplo: 123"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="formData.complement"
                label="Complemento"
                placeholder="Exemplo: Sala 01"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                class="custom-field"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="formData.neighborhood"
                label="Bairro*"
                placeholder="Exemplo: Centro"
                variant="outlined"
                color="primary"
                bg-color="grey-lighten-4"
                :readonly="isLoadingAddress"
                :loading="isLoadingAddress"
                class="custom-field"
              />
            </v-col>
          </v-row>

          <v-row class="mt-8">
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                type="submit"
                color="primary"
                size="x-large"
                min-width="200"
                :loading="isLoading"
                class="elevation-2"
              >
                <v-icon start icon="mdi-check" class="mr-2" />
                Salvar e Continuar
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userService } from '@/services/api'
import styles from '@/styles/components.module.css'
import notoriunLogo from '@/assets/notoriun.svg'

const router = useRouter()
const userStore = useUserStore()
const isLoading = ref(false)
const isLoadingAddress = ref(false)

// Removendo temporariamente a proteção da rota para teste
// if (!userStore.currentUser?.id) {
//   router.push('/register')
// }

const formData = reactive({
  cnpj: '',
  name: '',
  phone: '',
  email: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: ''
})

const errors = reactive({
  zipCode: ''
})

const handleCepBlur = async () => {
  if (!formData.zipCode || formData.zipCode.length < 8) return
  
  try {
    isLoadingAddress.value = true
    const address = await userService.getAddressByCep(formData.zipCode.replace(/\D/g, ''))
    
    formData.street = address.logradouro
    formData.neighborhood = address.bairro
    formData.city = address.localidade
    formData.state = address.uf
    formData.zipCode = address.cep
    
    errors.zipCode = ''
  } catch (error: any) {
    errors.zipCode = 'CEP não encontrado'
    console.error('Erro ao buscar CEP:', error)
  } finally {
    isLoadingAddress.value = false
  }
}

const handleSubmit = async () => {
  if (!userStore.currentUser?.id) return
  
  try {
    isLoading.value = true
    
    await userService.updateUser(userStore.currentUser.id, {
      ...formData,
      cnpj: formData.cnpj.replace(/\D/g, ''),
      zipCode: formData.zipCode.replace(/\D/g, '')
    })
    
    router.push('/map')
  } catch (error: any) {
    console.error('Error updating user:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.complete-profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-container {
  width: 100%;
  max-width: 1200px;
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
}

.form-content {
  padding: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
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
</style> 
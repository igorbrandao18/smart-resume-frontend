<script setup lang="ts">
import RegisterForm from '@/components/RegisterForm.vue'
import notoriunLogo from '@/assets/notoriun.svg'
</script>

<template>
  <div class="register-page">
    <div class="form-container">
      <div class="form-header">
        <img :src="notoriunLogo" alt="Notoriun" class="logo" />
        <h1 class="title">Crie sua conta</h1>
        <p class="subtitle">Preencha seus dados para começar sua jornada profissional</p>
      </div>

      <div class="form-content">
        <RegisterForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
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
}

.form-content {
  padding: 3rem;
}
</style> 
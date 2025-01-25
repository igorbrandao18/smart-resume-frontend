<template>
  <div :class="styles.pageContainer">
    <div :class="styles.formCard">
      <div :class="styles.formHeader">
        <div :class="styles.formLogo">
          <v-icon icon="mdi-account" size="24" color="white" />
        </div>
        <h1 :class="styles.formTitle">
          Login
        </h1>
        <p :class="styles.formSubtitle">
          Entre com suas credenciais para acessar sua conta
        </p>
      </div>

      <!-- TODO: Implementar formulário de login -->
      <v-form>
        <v-container class="pa-0">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" class="mt-2">
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
              >
                <v-icon start icon="mdi-login" class="mr-1" />
                Entrar
              </v-btn>
            </v-col>

            <v-col cols="12" class="text-center">
              <span class="text-medium-emphasis text-body-2">Não tem uma conta?</span>
              <v-btn
                variant="text"
                density="comfortable"
                class="ml-1"
                to="/register"
              >
                Criar conta
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>

    <div :class="styles.appFooter">
      <div class="text-body-2 text-medium-emphasis">
        © {{ new Date().getFullYear() }} Smart Resume. Todos os direitos reservados.
      </div>
      <div :class="styles.footerLinks">
        <v-btn variant="text" density="comfortable" to="/terms">
          Termos de Uso
        </v-btn>
        <v-btn variant="text" density="comfortable" to="/privacy">
          Política de Privacidade
        </v-btn>
        <v-btn variant="text" density="comfortable" to="/support">
          Suporte
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from '@/styles/components.module.css'
</script> 
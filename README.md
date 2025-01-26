# Smart Resume Frontend

Um aplicativo web moderno desenvolvido com Vue 3 + TypeScript para gerenciamento de perfis profissionais, com funcionalidades avançadas de geolocalização usando ArcGIS.

Desenvolvido por Igor Brandão.

## 🚀 Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Adiciona tipagem estática ao JavaScript
- **Vite** - Build tool e dev server
- **Vuetify** - Framework de componentes UI
- **ArcGIS API** - Para funcionalidades de mapa e geolocalização
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento da aplicação

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 16 ou superior)
- pnpm (gerenciador de pacotes)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_PORT=5173
VITE_BASE_URL=/
VITE_ARCGIS_API_KEY=sua_api_key_aqui
```

### Instalação

1. Clone o repositório:
```sh
git clone https://github.com/igorbrandao18/smart-resume-frontend.git
cd smart-resume-frontend
```

2. Instale as dependências:
```sh
pnpm install
```

3. Inicie o servidor de desenvolvimento:
```sh
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 📦 Build para Produção

Para criar uma build otimizada para produção:

```sh
pnpm build
```

## 🧪 Testes

### Testes Unitários
```sh
pnpm test:unit
```

### Testes E2E
```sh
# Desenvolvimento
pnpm test:e2e:dev

# Produção
pnpm test:e2e
```

## 🔍 Linting

Para verificar e corrigir problemas de código:

```sh
pnpm lint
```

## 🌟 Funcionalidades

- **Autenticação de Usuário**
  - Login/Registro
  - Verificação de email
  - Recuperação de senha

- **Perfil Completo**
  - Informações da instituição
  - Geolocalização com ArcGIS
  - Busca e validação de CNPJ
  - Autopreenchimento de endereço via CEP

- **Mapa Interativo**
  - Seleção de localização por clique
  - Busca de endereço
  - Geolocalização automática
  - Animações suaves de pin
  - Zoom automático

## 🎨 Design

- Interface moderna e responsiva
- Animações suaves
- Temas claros/escuros
- Componentes Vuetify personalizados

## 📱 Responsividade

O aplicativo é totalmente responsivo e otimizado para:
- Desktops
- Tablets
- Smartphones

## 🔒 Segurança

- Validação de dados
- Proteção contra XSS
- Sanitização de inputs
- Tokens JWT
- Refresh tokens

## 👥 Autor

- **Igor Brandão** - *Desenvolvimento Full Stack* - [@igorbrandao18](https://github.com/igorbrandao18)

## 📞 Suporte

Para suporte, abra uma issue no repositório: https://github.com/igorbrandao18/smart-resume-frontend

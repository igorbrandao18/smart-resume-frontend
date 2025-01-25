<template>
  <div class="complete-profile-page">
    <div class="form-container">
      <!-- Header com efeito de gradiente animado -->
      <div class="form-header">
        <div class="header-content">
          <div class="logo-container">
            <img :src="notoriunLogo" alt="Notoriun" class="logo" />
          </div>
          <h1 class="title">Complete seu cadastro</h1>
          <p class="subtitle">Preencha as informações abaixo para continuar</p>
        </div>
        <div class="header-background"></div>
      </div>

      <v-form @submit.prevent="handleSubmit" class="form-content">
        <v-container>
          <!-- Card de Informações da Instituição -->
          <div class="form-card institution-card">
            <div class="card-header">
              <div class="header-icon">
                <v-icon icon="mdi-office-building" color="primary" size="32" />
              </div>
              <div class="header-text">
                <h2>Informações da Instituição</h2>
                <p>Dados principais do seu estabelecimento</p>
              </div>
            </div>

            <v-row class="card-content">
              <v-col cols="12" md="6">
                <div class="input-group">
                  <label class="input-label">CNPJ*</label>
                  <v-text-field
                    v-model="formData.cnpj"
                    placeholder="00.000.000/0000-00"
                    variant="outlined"
                    :error-messages="errors.cnpj"
                    :loading="isLoadingAddress"
                    @blur="handleCnpjBlur"
                    class="modern-input"
                    density="comfortable"
                    bg-color="surface"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-identifier" color="primary" />
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="input-group">
                  <label class="input-label">Nome da Instituição*</label>
                  <v-text-field
                    v-model="formData.name"
                    placeholder="Nome oficial da instituição"
                    variant="outlined"
                    class="modern-input"
                    density="comfortable"
                    bg-color="surface"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-domain" color="primary" />
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="input-group">
                  <label class="input-label">Telefone*</label>
                  <v-text-field
                    v-model="formData.phone"
                    placeholder="(00) 00000-0000"
                    variant="outlined"
                    class="modern-input"
                    density="comfortable"
                    bg-color="surface"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-phone" color="primary" />
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="input-group">
                  <label class="input-label">Email*</label>
                  <v-text-field
                    v-model="formData.email"
                    placeholder="contato@instituicao.com.br"
                    variant="outlined"
                    class="modern-input"
                    density="comfortable"
                    bg-color="surface"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-email" color="primary" />
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- Card do Mapa e Localização -->
          <div class="form-card map-card">
            <div class="card-header">
              <div class="header-icon">
                <v-icon icon="mdi-map-marker-radius" color="primary" size="32" />
              </div>
              <div class="header-text">
                <h2>Localização</h2>
                <p>Selecione o local no mapa ou preencha o endereço</p>
              </div>
            </div>

            <!-- Layout do Mapa e Campos -->
            <div class="location-layout">
              <!-- Coluna do Mapa -->
              <div class="map-column">
                <div class="map-container">
                  <div id="viewDiv" ref="mapViewDiv" class="map-view"></div>
                  
                  <!-- Barra de Pesquisa -->
                  <div class="custom-search-container">
                    <div class="search-wrapper">
                      <v-icon icon="mdi-magnify" color="primary" size="20" class="search-icon" />
                      <input 
                        type="text" 
                        placeholder="Digite um endereço para buscar..." 
                        class="search-input"
                        v-model="searchQuery"
                        @input="handleSearchInput"
                      />
                    </div>
                    <!-- Resultados da Busca -->
                    <div class="search-results" v-if="searchResults.length > 0">
                      <div 
                        v-for="(result, index) in searchResults" 
                        :key="index"
                        class="search-result-item"
                        @click="selectSearchResult(result)"
                      >
                        <div class="result-icon">
                          <v-icon :icon="result.type_icon" size="16" color="primary" />
                        </div>
                        <div class="result-content">
                          <div class="result-title">{{ result.display_name }}</div>
                          <div class="result-subtitle">{{ result.formatted_address }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Botão de Localização -->
                  <div class="custom-locate-btn" @click="getCurrentLocation" :class="{ loading: isLocating }">
                    <v-icon icon="mdi-crosshairs-gps" color="primary" />
                  </div>
                </div>
              </div>

              <!-- Coluna de Endereço -->
              <div class="address-column">
                <!-- Card de Coordenadas -->
                <div class="address-card coordinates-card">
                  <div class="card-header">
                    <v-icon icon="mdi-crosshairs-gps" color="primary" size="24" />
                    <h3>Coordenadas do Local</h3>
                  </div>
                  <div class="coordinates-grid">
                    <div class="coordinate-box">
                      <div class="coordinate-content">
                        <span class="coordinate-label">Latitude</span>
                        <span class="coordinate-value">{{ formData.latitude.toFixed(6) }}°</span>
                      </div>
                      <v-btn
                        icon="mdi-content-copy"
                        variant="text"
                        size="small"
                        @click="copyToClipboard(formData.latitude)"
                      />
                    </div>
                    <div class="coordinate-box">
                      <div class="coordinate-content">
                        <span class="coordinate-label">Longitude</span>
                        <span class="coordinate-value">{{ formData.longitude.toFixed(6) }}°</span>
                      </div>
                      <v-btn
                        icon="mdi-content-copy"
                        variant="text"
                        size="small"
                        @click="copyToClipboard(formData.longitude)"
                      />
                    </div>
                  </div>
                </div>

                <!-- Card de Endereço -->
                <div class="address-card">
                  <div class="card-header">
                    <v-icon icon="mdi-map-marker" color="primary" size="24" />
                    <h3>Endereço do Local</h3>
                  </div>
                  
                  <div class="address-fields">
                    <div class="field-group">
                      <v-text-field
                        v-model="formData.zipCode"
                        label="CEP*"
                        placeholder="00000-000"
                        variant="outlined"
                        :error-messages="errors.zipCode"
                        @blur="handleCepBlur"
                        class="modern-input"
                        density="comfortable"
                        hide-details
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-mailbox" color="primary" />
                        </template>
                      </v-text-field>
                    </div>

                    <div class="field-group">
                      <v-text-field
                        v-model="formData.street"
                        label="Logradouro*"
                        placeholder="Nome da rua, avenida, etc"
                        variant="outlined"
                        :readonly="isLoadingAddress"
                        :loading="isLoadingAddress"
                        @update:model-value="updateMapFromForm"
                        class="modern-input"
                        density="comfortable"
                        hide-details
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-road-variant" color="primary" />
                        </template>
                      </v-text-field>
                    </div>

                    <div class="field-row">
                      <v-text-field
                        v-model="formData.number"
                        label="Número*"
                        placeholder="Nº"
                        variant="outlined"
                        @update:model-value="updateMapFromForm"
                        class="modern-input number-input"
                        density="comfortable"
                        hide-details
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-pound" color="primary" />
                        </template>
                      </v-text-field>

                      <v-text-field
                        v-model="formData.complement"
                        label="Complemento"
                        placeholder="Apto, Sala, etc"
                        variant="outlined"
                        class="modern-input"
                        density="comfortable"
                        hide-details
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-office-building-marker" color="primary" />
                        </template>
                      </v-text-field>
                    </div>

                    <div class="field-group">
                      <v-text-field
                        v-model="formData.neighborhood"
                        label="Bairro*"
                        placeholder="Nome do bairro"
                        variant="outlined"
                        :readonly="isLoadingAddress"
                        :loading="isLoadingAddress"
                        @update:model-value="updateMapFromForm"
                        class="modern-input"
                        density="comfortable"
                        hide-details
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-home-group" color="primary" />
                        </template>
                      </v-text-field>
                    </div>

                    <div class="field-row">
                      <v-text-field
                        v-model="formData.city"
                        label="Cidade*"
                        placeholder="Nome da cidade"
                        variant="outlined"
                        :readonly="isLoadingAddress"
                        :loading="isLoadingAddress"
                        @update:model-value="updateMapFromForm"
                        class="modern-input"
                        density="comfortable"
                        hide-details
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-city-variant" color="primary" />
                        </template>
                      </v-text-field>

                      <v-text-field
                        v-model="formData.state"
                        label="UF*"
                        placeholder="UF"
                        variant="outlined"
                        :readonly="isLoadingAddress"
                        :loading="isLoadingAddress"
                        @update:model-value="updateMapFromForm"
                        class="modern-input state-input"
                        density="comfortable"
                        hide-details
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-map" color="primary" />
                        </template>
                      </v-text-field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botão de Submit -->
          <div class="submit-section">
            <v-btn
              type="submit"
              color="primary"
              size="x-large"
              min-width="200"
              :loading="isLoading"
              class="submit-button"
            >
              <v-icon start icon="mdi-check-circle" class="mr-2" />
              Salvar e Continuar
            </v-btn>
          </div>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userService } from '@/services/api'
import styles from '@/styles/components.module.css'
import notoriunLogo from '@/assets/notoriun.svg'

const router = useRouter()
const userStore = useUserStore()
const isLoading = ref(false)
const isLoadingAddress = ref(false)
const mapViewDiv = ref<HTMLElement | null>(null)

let view: any = null
let searchWidget: any = null
let pointGraphic: any = null
let graphicsLayer: any = null

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
  state: '',
  latitude: 0,
  longitude: 0
})

const errors = reactive({
  zipCode: '',
  cnpj: ''
})

// Estado para busca
const searchQuery = ref('')
const searchResults = ref<any[]>([])
let searchTimeout: any = null

// Inicialização do mapa
onMounted(async () => {
  // Carrega o CSS do ArcGIS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://js.arcgis.com/4.29/esri/themes/light/main.css'
  document.head.appendChild(link)

  // Carrega o script do ArcGIS
  const script = document.createElement('script')
  script.src = 'https://js.arcgis.com/4.29/'
  document.head.appendChild(script)

  script.onload = () => {
    (window as any).require([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer"
    ], function(Map: any, MapView: any, Graphic: any, GraphicsLayer: any) {
      const map = new Map({
        basemap: 'osm'
      })

      graphicsLayer = new GraphicsLayer()
      map.add(graphicsLayer)

      view = new MapView({
        container: mapViewDiv.value!,
        map: map,
        zoom: 4,
        center: [-53.2316, -10.2491]
      })

      // Cria o marcador inicial
      const point = {
        type: "point",
        longitude: -53.2316,
        latitude: -10.2491
      }

      const markerSymbol = {
        type: "picture-marker",
        url: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
          <svg width="32" height="48" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feOffset result="offOut" in="SourceAlpha" dx="0" dy="2" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
            <path fill="#5B21B6" filter="url(#shadow)" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
          </svg>
        `),
        width: "32px",
        height: "48px",
        yoffset: "24px"
      }

      pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      })

      graphicsLayer.add(pointGraphic)

      // Adiciona evento de clique no mapa
      view.on("click", async (event: any) => {
        // Obtém as coordenadas do clique
        const { latitude, longitude } = event.mapPoint

        // Atualiza as coordenadas no formulário
        formData.latitude = latitude
        formData.longitude = longitude

        // Atualiza a posição do marcador
        const point = {
          type: "point",
          longitude,
          latitude
        }

        // Remove o marcador antigo e adiciona o novo
        graphicsLayer.removeAll()
        pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol
        })
        graphicsLayer.add(pointGraphic)
        animateMarkerDrop(pointGraphic)

        // Busca o endereço das coordenadas
        try {
          const details = await reverseGeocodeWithNominatim(latitude, longitude)
          if (details && details.address) {
            formData.street = details.address.road || details.address.street || ''
            formData.number = details.address.house_number || ''
            formData.neighborhood = details.address.suburb || details.address.neighbourhood || ''
            formData.city = details.address.city || details.address.town || details.address.municipality || ''
            formData.state = details.address.state || ''
            formData.zipCode = details.address.postcode || ''
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error)
        }
      })

      view.when(() => {
        console.log("Mapa carregado com sucesso!")
      })
    })
  }
})

onUnmounted(() => {
  if (view) {
    view.destroy()
  }
})

const updateMarkerPosition = (geometry: any, graphicsLayer: any, Graphic: any) => {
  graphicsLayer.removeAll()
  
  const marker = {
    type: 'simple-marker',
    style: 'pin',
    color: [91, 33, 182], // primary color
    size: '24px'
  }

  const pointGraphic = new Graphic({
    geometry: geometry,
    symbol: marker
  })

  graphicsLayer.add(pointGraphic)
}

const updateFormAddress = (attributes: any) => {
  try {
    console.log('Received attributes:', attributes) // Para debug

    // Extrai o CEP se disponível
    if (attributes.Postal) {
      formData.zipCode = attributes.Postal.replace(/\D/g, '')
    }

    // Tenta diferentes formatos de endereço
    if (attributes.StAddr || attributes.Address) {
      // Formato ArcGIS padrão
      formData.street = attributes.StAddr || attributes.Address || ''
      formData.neighborhood = attributes.District || attributes.Nbrhd || ''
      formData.city = attributes.City || ''
      formData.state = attributes.Region || attributes.RegionAbbr || ''
    } else if (attributes.Match_addr) {
      // Formato de geocodificação
      const parts = attributes.Match_addr.split(',').map((part: string) => part.trim())
      
      if (parts.length >= 2) {
        // Primeiro componente geralmente é a rua
        let street = parts[0]
        
        // Tenta extrair o número
        const numberMatch = street.match(/,?\s*(\d+)\s*$/)
        if (numberMatch) {
          formData.number = numberMatch[1]
          street = street.replace(/,?\s*\d+\s*$/, '').trim()
        }
        formData.street = street

        // Segundo componente geralmente é o bairro
        formData.neighborhood = parts[1]

        // Último componente geralmente é cidade/estado
        if (parts.length >= 3) {
          const lastPart = parts[parts.length - 1]
          const cityState = lastPart.split('-')
          
          if (cityState.length >= 2) {
            formData.city = cityState[0].trim()
            formData.state = cityState[1].trim()
          } else {
            formData.city = lastPart.trim()
          }
        }
      }
    }

    // Se tiver coordenadas, salva para uso posterior
    if (attributes.location) {
      formData.latitude = attributes.location.y
      formData.longitude = attributes.location.x
    }

    // Limpa erros
    errors.zipCode = ''

    console.log('Updated formData:', formData) // Para debug
  } catch (error) {
    console.error('Error parsing address:', error)
  }
}

// Função para atualizar o mapa quando os campos são preenchidos manualmente
const updateMapFromForm = () => {
  if (!searchWidget) return

  const fullAddress = [
    formData.street,
    formData.number,
    formData.neighborhood,
    formData.city,
    formData.state
  ].filter(Boolean).join(', ')

  if (fullAddress) {
    searchWidget.search(fullAddress)
  }
}

const handleCnpjBlur = async () => {
  if (!formData.cnpj || formData.cnpj.length < 14) return
  
  try {
    isLoadingAddress.value = true
    const cnpjData = await userService.getCnpjData(formData.cnpj.replace(/\D/g, ''))
    
    if (!cnpjData.estabelecimento) {
      throw new Error('Dados do estabelecimento não encontrados')
    }
    
    // Verifica se o CNPJ está ativo
    if (cnpjData.estabelecimento.situacao_cadastral !== 'Ativa') {
      throw new Error('CNPJ está inativo ou com situação irregular')
    }
    
    // Preenche os dados da empresa
    formData.name = cnpjData.razao_social
    formData.email = cnpjData.estabelecimento.email || ''
    formData.phone = cnpjData.estabelecimento.telefone1 ? 
      `${cnpjData.estabelecimento.ddd1 || ''}${cnpjData.estabelecimento.telefone1}` : ''
    
    // Preenche o endereço
    formData.street = `${cnpjData.estabelecimento.tipo_logradouro} ${cnpjData.estabelecimento.logradouro}`.trim()
    formData.number = cnpjData.estabelecimento.numero
    formData.complement = cnpjData.estabelecimento.complemento || ''
    formData.neighborhood = cnpjData.estabelecimento.bairro
    formData.city = cnpjData.estabelecimento.cidade.nome
    formData.state = cnpjData.estabelecimento.estado.sigla
    formData.zipCode = cnpjData.estabelecimento.cep
    
    errors.cnpj = ''

    // Atualiza o mapa com o novo endereço
    updateMapFromForm()
  } catch (error: any) {
    errors.cnpj = error.message || 'CNPJ não encontrado ou inválido'
    console.error('Erro ao buscar CNPJ:', error)
    
    // Limpa os campos em caso de erro
    formData.name = ''
    formData.email = ''
    formData.phone = ''
    formData.street = ''
    formData.number = ''
    formData.complement = ''
    formData.neighborhood = ''
    formData.city = ''
    formData.state = ''
    formData.zipCode = ''
  } finally {
    isLoadingAddress.value = false
  }
}

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

    // Atualiza o mapa com o novo endereço
    updateMapFromForm()
  } catch (error: any) {
    errors.zipCode = 'CEP não encontrado'
    console.error('Erro ao buscar CEP:', error)
  } finally {
    isLoadingAddress.value = false
  }
}

// Watch para campos do endereço
watch(
  [
    () => formData.street,
    () => formData.number,
    () => formData.neighborhood,
    () => formData.city,
    () => formData.state
  ],
  () => {
    // Só atualiza o mapa se a mudança não veio do próprio mapa
    if (!isLoadingAddress.value) {
      updateMapFromForm()
    }
  }
)

const handleSubmit = async () => {
  if (!userStore.currentUser?.id) return
  
  try {
    isLoading.value = true
    
    // Prepara os dados no formato da API
    const userData = {
      secondaryEmail: formData.email,
      cnpj: formData.cnpj.replace(/\D/g, ''),
      street: formData.street,
      number: formData.number,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode.replace(/\D/g, ''),
      latitude: formData.latitude,
      longitude: formData.longitude
    }
    
    // Atualiza o usuário e navega imediatamente após sucesso
    await userService.updateUser(userStore.currentUser.id, userData)
    router.push('/map')
  } catch (error: any) {
    console.error('Error updating user:', error)
    isLoading.value = false
  }
}

// Função para copiar coordenadas
const copyToClipboard = (value: number) => {
  navigator.clipboard.writeText(value.toString())
}

// Função para lidar com input de busca
const handleSearchInput = async () => {
  clearTimeout(searchTimeout)
  
  if (searchQuery.value.length < 3) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const results = await searchAddressWithNominatim(searchQuery.value)
      searchResults.value = results
    } catch (error) {
      console.error('Erro na busca:', error)
      searchResults.value = []
    }
  }, 300)
}

// Função para selecionar um resultado da busca
const selectSearchResult = async (result: any) => {
  try {
    // Atualiza as coordenadas com precisão
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    
    formData.latitude = lat
    formData.longitude = lon

    // Atualiza o mapa com a posição exata
    if (view && pointGraphic) {
      const point = {
        type: "point",
        longitude: lon,
        latitude: lat,
        spatialReference: {
          wkid: 4326
        }
      }
      
      // Atualiza a geometria do ponto
      pointGraphic.geometry = point

      // Centraliza o mapa na posição exata
      view.goTo({
        target: point,
        zoom: 18,
        rotation: 0
      }, {
        duration: 1000,
        easing: 'ease-out'
      }).then(() => {
        // Garante que o pin está na posição correta após a animação
        pointGraphic.geometry = point
      })

      // Atualiza o símbolo do marcador para garantir o offset correto
      pointGraphic.symbol = {
        type: "picture-marker",
        url: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
          <svg width="32" height="48" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feOffset result="offOut" in="SourceAlpha" dx="0" dy="2" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
            <path fill="#5B21B6" filter="url(#shadow)" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
          </svg>
        `),
        width: "32px",
        height: "48px",
        yoffset: "24px" // Ajusta o offset para o pin ficar exatamente na posição
      }
    }

    // Preenche os campos do formulário com os dados do resultado
    if (result.address) {
      formData.street = result.address.road || result.address.street || ''
      formData.number = result.address.house_number || ''
      formData.neighborhood = result.address.suburb || result.address.neighbourhood || ''
      formData.city = result.address.city || result.address.town || result.address.municipality || ''
      formData.state = result.address.state || ''
      formData.zipCode = result.address.postcode || ''
    }

    // Limpa a busca
    searchQuery.value = result.display_name
    searchResults.value = []
  } catch (error) {
    console.error('Erro ao selecionar endereço:', error)
  }
}

// Função para animar a queda do marcador
const animateMarkerDrop = (graphic: any) => {
  const startY = -100
  const endY = 24 // Mantém o offset original do marcador
  const duration = 500
  const start = performance.now()

  const animate = (currentTime: number) => {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)

    const easeOutBounce = (x: number): number => {
      const n1 = 7.5625
      const d1 = 2.75

      if (x < 1 / d1) {
        return n1 * x * x
      } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75
      } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375
      } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375
      }
    }

    const currentY = startY + (endY - startY) * easeOutBounce(progress)
    graphic.symbol = {
      ...graphic.symbol,
      yoffset: `${currentY}px`
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // Garante que o offset final está correto
      graphic.symbol = {
        ...graphic.symbol,
        yoffset: `${endY}px`
      }
    }
  }

  requestAnimationFrame(animate)
}

// Função para buscar endereço usando OpenStreetMap (Nominatim)
const searchAddressWithNominatim = async (query: string) => {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      countrycodes: 'br',
      limit: '5',
      addressdetails: '1',
      'accept-language': 'pt-BR'
    })

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'Accept-Language': 'pt-BR'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erro na busca de endereço')
    }

    const data = await response.json()
    
    // Filtra e formata os resultados
    return data.map((item: any) => ({
      ...item,
      display_name: formatDisplayName(item),
      type_icon: getTypeIcon(item.type),
      formatted_address: formatAddress(item.address)
    }))
  } catch (error) {
    console.error('Erro na busca de endereço:', error)
    return []
  }
}

// Função para formatar o nome exibido
const formatDisplayName = (item: any) => {
  const parts = []
  
  if (item.address) {
    if (item.address.road) parts.push(item.address.road)
    if (item.address.house_number) parts.push(item.address.house_number)
    if (item.address.suburb) parts.push(item.address.suburb)
    if (item.address.city) parts.push(item.address.city)
    if (item.address.state) parts.push(item.address.state)
  }
  
  return parts.join(', ')
}

// Função para obter ícone baseado no tipo
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'house':
      return 'mdi-home'
    case 'building':
      return 'mdi-office-building'
    case 'street':
      return 'mdi-road-variant'
    case 'suburb':
      return 'mdi-home-group'
    default:
      return 'mdi-map-marker'
  }
}

// Função para formatar endereço
const formatAddress = (address: any) => {
  if (!address) return ''
  
  const parts = []
  
  if (address.road) {
    let street = address.road
    if (address.house_number) street += `, ${address.house_number}`
    parts.push(street)
  }
  
  if (address.suburb) parts.push(address.suburb)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.postcode) parts.push(address.postcode)
  
  return parts.join(' - ')
}

// Atualiza o template da busca
const searchResultTemplate = `
  <div class="result-icon">
    <v-icon :icon="result.type_icon" size="16" color="primary" />
  </div>
  <div class="result-content">
    <div class="result-title">{{ result.display_name }}</div>
    <div class="result-subtitle">{{ result.formatted_address }}</div>
  </div>
`

// Função para buscar endereço por coordenadas usando OpenStreetMap (Nominatim)
const reverseGeocodeWithNominatim = async (lat: number, lon: number) => {
  // Verifica se as coordenadas estão dentro do Brasil
  if (lat < -35.0 || lat > 5.0 || lon < -75.0 || lon > -30.0) {
    console.error('Coordenadas fora do território brasileiro')
    return null
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
      new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
        zoom: '18',
        addressdetails: '1',
        'accept-language': 'pt-BR',
        countrycodes: 'br'
      }),
      {
        headers: {
          'Accept-Language': 'pt-BR'
        }
      }
    )
    const data = await response.json()
    
    // Verifica se o resultado é do Brasil
    if (data.address?.country_code !== 'br') {
      console.error('Endereço fora do Brasil')
      return null
    }
    
    return data
  } catch (error) {
    console.error('Erro na geocodificação reversa:', error)
    return null
  }
}

// Função para obter localização atual
const isLocating = ref(false)

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    isLocating.value = true
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Atualiza as coordenadas
        formData.latitude = latitude
        formData.longitude = longitude

        // Atualiza o mapa
        if (view && pointGraphic) {
          const point = {
            type: "point",
            longitude,
            latitude
          }
          
          pointGraphic.geometry = point
          animateMarkerDrop(pointGraphic)
          
          view.goTo({
            target: point,
            zoom: 18
          }, {
            duration: 1000,
            easing: 'ease-out'
          })
        }

        // Busca o endereço usando OpenStreetMap
        try {
          const details = await reverseGeocodeWithNominatim(latitude, longitude)
          if (details && details.address) {
            formData.street = details.address.road || details.address.street || ''
            formData.number = details.address.house_number || ''
            formData.neighborhood = details.address.suburb || details.address.neighbourhood || ''
            formData.city = details.address.city || details.address.town || details.address.municipality || ''
            formData.state = details.address.state || ''
            formData.zipCode = details.address.postcode || ''
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error)
        }

        isLocating.value = false
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
        isLocating.value = false
      }
    )
  }
}
</script>

<style scoped>
.complete-profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header Animado */
.form-header {
  position: relative;
  padding: 4rem 2rem;
  text-align: center;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 2;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #4f46e5, #7c3aed, #2563eb);
  background-size: 200% 200%;
  animation: gradientAnimation 15s ease infinite;
  z-index: 1;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

.logo-container {
  background: white;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.logo {
  height: 40px;
}

.title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
}

/* Cards do Formulário */
.form-content {
  padding: 2rem;
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  padding: 2rem;
  margin-bottom: 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header-icon {
  background: #f0f9ff;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.header-text p {
  color: #64748b;
  font-size: 1rem;
}

/* Inputs Modernos */
.input-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
}

.modern-input {
  border-radius: 12px !important;
}

:deep(.v-field) {
  border-radius: 12px !important;
  transition: all 0.2s ease;
}

:deep(.v-field--variant-outlined) {
  border: 1px solid #e2e8f0 !important;
  background: #f8fafc !important;
}

:deep(.v-field--variant-outlined:hover) {
  border-color: #6366f1 !important;
}

:deep(.v-field--focused) {
  border-color: #6366f1 !important;
  background: white !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

/* Layout do Mapa e Campos */
.location-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  margin-top: 1.5rem;
}

/* Coluna do Mapa */
.map-column {
  min-height: 600px;
}

/* Coluna de Endereço */
.address-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.address-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.coordinates-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Coordenadas */
.coordinates-grid {
  display: grid;
  gap: 1rem;
}

.coordinate-box {
  background: white;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2e8f0;
}

.coordinate-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.coordinate-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.coordinate-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
}

/* Campos de Endereço */
.address-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  width: 100%;
}

.field-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
}

.number-input {
  width: 120px;
}

.state-input {
  width: 120px;
}

/* Responsividade */
@media (max-width: 1200px) {
  .location-layout {
    grid-template-columns: 1fr;
  }

  .map-column {
    min-height: 400px;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .number-input,
  .state-input {
    width: 100%;
  }
}

/* Melhorias nos campos */
:deep(.v-field) {
  border-radius: 12px !important;
  background: white !important;
  transition: all 0.2s ease;
}

:deep(.v-field--variant-outlined) {
  border: 1px solid #e2e8f0 !important;
}

:deep(.v-field--variant-outlined:hover) {
  border-color: #6366f1 !important;
}

:deep(.v-field--focused) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

:deep(.v-field__input) {
  font-size: 0.875rem !important;
  padding: 12px !important;
}

:deep(.v-field__prepend-inner) {
  padding-inline-start: 12px !important;
}

:deep(.v-label) {
  font-size: 0.875rem !important;
  color: #475569 !important;
  font-weight: 500 !important;
}

/* Botão de Submit */
.submit-section {
  text-align: center;
  margin-top: 3rem;
}

.submit-button {
  font-size: 1.125rem !important;
  padding: 1.5rem 3rem !important;
  border-radius: 12px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-weight: 600 !important;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3) !important;
  transition: all 0.3s ease !important;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(99, 102, 241, 0.4) !important;
}

/* Estilos do Mapa */
.map-container {
  position: relative;
  height: 100%;
  min-height: 600px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: #f8fafc;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.map-view {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: #f8fafc;
}

/* ESRI Map Overrides - Importante para o mapa aparecer */
:deep(.esri-view) {
  width: 100%;
  height: 100%;
}

:deep(.esri-view-surface) {
  outline: none;
}

:deep(.esri-ui) {
  z-index: 10;
}

:deep(.esri-attribution) {
  background: rgba(255, 255, 255, 0.9) !important;
}

:deep(.esri-zoom) {
  margin: 12px !important;
}

/* Barra de Pesquisa Personalizada */
.custom-search-container {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  max-width: 500px;
  z-index: 20;
}

.search-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.search-wrapper:hover,
.search-wrapper:focus-within {
  background: white;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  color: #1e293b;
  background: transparent;
  padding: 0.5rem;
}

.search-input::placeholder {
  color: #94a3b8;
}

/* Resultados da Busca */
.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
  max-height: 300px;
  overflow-y: auto;
  z-index: 30;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: rgba(99, 102, 241, 0.1);
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 8px;
}

.result-content {
  flex: 1;
  overflow: hidden;
}

.result-title {
  font-size: 0.875rem;
  color: #1e293b;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Animações */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.search-results {
  animation: fadeIn 0.2s ease-out;
}

/* Scrollbar personalizada */
.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}
</style> 
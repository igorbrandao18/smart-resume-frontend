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
              <!-- Seção do Mapa -->
              <div class="map-section">
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

              <!-- Seção de Informações -->
              <div class="info-section">
                <!-- Card de Coordenadas -->
                <div class="coordinates-section">
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
                <div class="address-section">
                  <div class="address-fields">
                    <v-row>
                      <v-col cols="12" md="3">
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
                      </v-col>

                      <v-col cols="12" md="7">
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
                      </v-col>

                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="formData.number"
                          label="Número*"
                          placeholder="Nº"
                          variant="outlined"
                          @update:model-value="updateMapFromForm"
                          class="modern-input"
                          density="comfortable"
                          hide-details
                        >
                          <template v-slot:prepend>
                            <v-icon icon="mdi-pound" color="primary" />
                          </template>
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
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
                      </v-col>

                      <v-col cols="12" md="8">
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
                      </v-col>

                      <v-col cols="12" md="8">
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
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="formData.state"
                          label="UF*"
                          placeholder="UF"
                          variant="outlined"
                          :readonly="isLoadingAddress"
                          :loading="isLoadingAddress"
                          @update:model-value="updateMapFromForm"
                          class="modern-input"
                          density="comfortable"
                          hide-details
                        >
                          <template v-slot:prepend>
                            <v-icon icon="mdi-map" color="primary" />
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
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
let markerSymbol: any = null

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

// Variáveis reativas para o estado do mapa
const mapState = reactive({
  pin: {
    latitude: 0,
    longitude: 0,
    isVisible: false
  },
  view: null as any,
  graphicsLayer: null as any
})

// Configuração do marcador
const createMarkerSymbol = () => ({
  type: "simple-marker",
  style: "circle",
  color: [91, 33, 182], // Cor roxa (primary)
  outline: {
    color: [255, 255, 255],
    width: 2
  },
  size: "12px"
})

// Função para adicionar pin no mapa
const addPinToMap = (latitude: number, longitude: number) => {
  if (!mapState.graphicsLayer || !mapState.view) return

  // Remove pins existentes
  mapState.graphicsLayer.removeAll()

  // Cria o ponto
  const point = {
    type: "point",
    longitude,
    latitude,
    spatialReference: mapState.view.spatialReference
  }

  // Cria o gráfico com o pin
  const pinGraphic = new (window as any).esri.Graphic({
    geometry: point,
    symbol: createMarkerSymbol()
  })

  // Adiciona o pin ao mapa
  mapState.graphicsLayer.add(pinGraphic)

  // Atualiza o estado
  mapState.pin = {
    latitude,
    longitude,
    isVisible: true
  }

  // Atualiza as coordenadas no formulário
  formData.latitude = latitude
  formData.longitude = longitude
}

// Inicialização do mapa
onMounted(async () => {
  // Carrega o CSS do ArcGIS primeiro
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://js.arcgis.com/4.29/esri/themes/light/main.css'
  document.head.appendChild(link)

  // Espera o CSS carregar
  await new Promise((resolve) => {
    link.onload = resolve
  })

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
      try {
        // Cria o mapa base
        const map = new Map({
          basemap: 'osm'
        });

        // Cria a camada de gráficos
        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        // Configura a visualização do mapa
        const view = new MapView({
          container: "viewDiv",
          map: map,
          zoom: 4,
          center: [-53.2316, -10.2491], // Centro do Brasil
          constraints: {
            rotationEnabled: false,
            minZoom: 4,
            maxZoom: 18
          }
        });

        // Salva as referências no estado
        mapState.view = view;
        mapState.graphicsLayer = graphicsLayer;

        // Configura o evento de clique no mapa
        view.on("click", async (event: any) => {
          const { latitude, longitude } = event.mapPoint;
          addPinToMap(latitude, longitude);
          await reverseGeocodeWithNominatim(latitude, longitude);
        });

        // Se já tiver coordenadas salvas, mostra o pin
        if (formData.latitude && formData.longitude) {
          addPinToMap(formData.latitude, formData.longitude);
          view.goTo({
            target: {
              type: "point",
              longitude: formData.longitude,
              latitude: formData.latitude
            },
            zoom: 18
          });
        }

        // Confirma que o mapa foi carregado
        view.when(() => {
          console.log("Mapa carregado com sucesso!");
        });
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
      }
    });
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

// Watch para coordenadas
watch(
  [
    () => formData.latitude,
    () => formData.longitude
  ],
  ([newLat, newLon]) => {
    if (newLat && newLon && !isLoadingAddress.value) {
      addPinToMap(newLat, newLon)
    }
  }
)

// Função para atualizar o mapa quando os campos são preenchidos manualmente
const updateMapFromForm = async () => {
  if (!view) return

  try {
    // Monta o endereço completo
    const fullAddress = [
      formData.street,
      formData.number,
      formData.neighborhood,
      formData.city,
      formData.state
    ].filter(Boolean).join(', ')

    if (!fullAddress) return

    // Busca as coordenadas do endereço
    const params = new URLSearchParams({
      q: fullAddress + ', Brasil',
      format: 'json',
      limit: '1',
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

    const data = await response.json()

    if (data && data[0]) {
      const lat = parseFloat(data[0].lat)
      const lon = parseFloat(data[0].lon)

      // Atualiza as coordenadas no formulário
      formData.latitude = lat
      formData.longitude = lon

      // Atualiza o pin no mapa
      addPinToMap(lat, lon)
    }
  } catch (error) {
    console.error('Erro ao atualizar mapa:', error)
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
    await updateMapFromForm()
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
    await updateMapFromForm()
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
  async () => {
    if (!isLoadingAddress.value) {
      await updateMapFromForm()
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
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    
    // Adiciona o pin no local selecionado
    addPinToMap(lat, lon)

    // Centraliza o mapa
    if (mapState.view) {
      mapState.view.goTo({
        target: {
          type: "point",
          longitude: lon,
          latitude: lat
        },
        zoom: 18
      })
    }

    // Preenche os campos do formulário
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

    // Função de easing para o efeito bounce
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

    // Atualiza a posição do marcador
    graphic.symbol = {
      ...markerSymbol,
      yoffset: `${currentY}px`
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // Garante que o offset final está correto
      graphic.symbol = {
        ...markerSymbol,
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

// Função para buscar endereço por coordenadas
const reverseGeocodeWithNominatim = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
      new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
        zoom: '18',
        addressdetails: '1',
        'accept-language': 'pt-BR'
      }),
      {
        headers: {
          'Accept-Language': 'pt-BR'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erro na geocodificação reversa')
    }

    const data = await response.json()
    
    // Atualiza o formulário com os dados do endereço
    if (data.address) {
      formData.street = data.address.road || data.address.street || ''
      formData.number = data.address.house_number || ''
      formData.neighborhood = data.address.suburb || data.address.neighbourhood || ''
      formData.city = data.address.city || data.address.town || data.address.municipality || ''
      formData.state = data.address.state || ''
      formData.zipCode = data.address.postcode || ''
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
        
        // Adiciona o pin na localização atual
        addPinToMap(latitude, longitude)

        // Centraliza o mapa
        if (mapState.view) {
          mapState.view.goTo({
            target: {
              type: "point",
              longitude,
              latitude
            },
            zoom: 18
          })
        }

        // Busca o endereço
        await reverseGeocodeWithNominatim(latitude, longitude)
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
/* Reset e Base */
.complete-profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e5e9ff 100%);
  padding: 2rem;
}

.form-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 32px;
  box-shadow: 0 20px 50px -10px rgba(51, 65, 85, 0.15);
  overflow: hidden;
}

/* Header Animado Melhorado */
.form-header {
  position: relative;
  padding: 5rem 2rem;
  text-align: center;
  overflow: hidden;
  margin-bottom: 2rem;
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
  background: linear-gradient(45deg, 
    #4f46e5 0%, 
    #7c3aed 25%, 
    #2563eb 50%, 
    #7c3aed 75%, 
    #4f46e5 100%
  );
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  z-index: 1;
  opacity: 0.95;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

.logo-container {
  background: rgba(255, 255, 255, 0.95);
  width: 100px;
  height: 100px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  transform: perspective(1000px) rotateX(10deg);
  transition: all 0.3s ease;
}

.logo-container:hover {
  transform: perspective(1000px) rotateX(0deg) translateY(-5px);
  box-shadow: 0 20px 32px rgba(0, 0, 0, 0.2);
}

.logo {
  height: 50px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.title {
  color: white;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.5px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.25rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Cards do Formulário */
.form-content {
  padding: 0 2rem 2rem;
}

.form-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  transition: all 0.3s ease;
}

.form-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.header-icon {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  width: 80px;
  height: 80px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
}

.header-text h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.header-text p {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.5;
}

/* Mapa e Layout de Localização */
.map-card {
  padding: 0;
  overflow: hidden;
}

.map-card .card-header {
  padding: 2.5rem 2.5rem 0;
  margin-bottom: 2rem;
}

.location-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.map-section {
  width: 100%;
  height: 400px !important;
  position: relative;
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  margin: 0 auto;
  max-width: 800px;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f8fafc;
}

#viewDiv {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #f8fafc;
}

/* Barra de Pesquisa Aprimorada */
.custom-search-container {
  position: absolute;
  top: 24px;
  left: 24px;
  right: 24px;
  max-width: 600px;
  z-index: 20;
}

.search-wrapper {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.search-wrapper:hover,
.search-wrapper:focus-within {
  background: white;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1.1rem;
  color: #1e293b;
  background: transparent;
  padding: 0.5rem;
}

/* Resultados da Busca */
.search-results {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.9);
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.search-result-item:hover {
  background: rgba(99, 102, 241, 0.08);
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
}

.result-content {
  flex: 1;
}

.result-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.result-subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

/* Seção de Informações */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Coordenadas */
.coordinates-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.coordinates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.coordinate-box {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.coordinate-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
}

.coordinate-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.coordinate-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.coordinate-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 1.125rem;
  color: #1e293b;
  font-weight: 600;
  letter-spacing: -0.5px;
}

/* Endereço */
.address-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.address-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Inputs Modernos */
:deep(.v-field) {
  border-radius: 16px !important;
  background: white !important;
  transition: all 0.2s ease;
}

:deep(.v-field--variant-outlined) {
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  background: #f8fafc !important;
}

:deep(.v-field--variant-outlined:hover) {
  border-color: #6366f1 !important;
  background: white !important;
}

:deep(.v-field--focused) {
  border-color: #6366f1 !important;
  background: white !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

:deep(.v-field__input) {
  font-size: 1rem !important;
  padding: 16px !important;
}

:deep(.v-field__prepend-inner) {
  padding-inline-start: 16px !important;
}

:deep(.v-label) {
  font-size: 0.875rem !important;
  color: #475569 !important;
  font-weight: 500 !important;
}

/* Botão de Submit */
.submit-section {
  text-align: center;
  margin-top: 4rem;
  padding-bottom: 2rem;
}

.submit-button {
  font-size: 1.25rem !important;
  padding: 1.75rem 4rem !important;
  border-radius: 16px !important;
  text-transform: none !important;
  letter-spacing: -0.5px !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
  box-shadow: 0 12px 24px -6px rgba(99, 102, 241, 0.4) !important;
  transition: all 0.3s ease !important;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 32px -8px rgba(99, 102, 241, 0.5) !important;
  background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%) !important;
}

/* Responsividade */
@media (max-width: 1200px) {
  .form-container {
    margin: 1rem;
  }

  .map-section {
    height: 500px;
  }

  .title {
    font-size: 2.5rem;
  }

  .header-icon {
    width: 64px;
    height: 64px;
  }

  .form-card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .complete-profile-page {
    padding: 1rem;
  }

  .form-container {
    margin: 0;
  }

  .map-section {
    height: 400px;
  }

  .title {
    font-size: 2rem;
  }

  .submit-button {
    width: 100%;
    padding: 1.5rem !important;
  }

  .coordinates-grid {
    grid-template-columns: 1fr;
  }
}

/* ESRI Map Overrides */
:deep(.esri-view) {
  width: 100% !important;
  height: 100% !important;
  background: #f8fafc !important;
}

:deep(.esri-view-surface) {
  outline: none !important;
}

:deep(.esri-ui) {
  z-index: 10 !important;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f8fafc;
}

#viewDiv {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #f8fafc;
}

/* Botão de Localização */
.custom-locate-btn {
  position: absolute;
  bottom: 24px;
  right: 24px;
  background: white;
  border-radius: 16px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  z-index: 20;
}

.custom-locate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.custom-locate-btn.loading {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style> 
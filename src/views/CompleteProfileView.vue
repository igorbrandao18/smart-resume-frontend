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

          <!-- Card de Mapa e Localização -->
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
            <div class="map-fields-layout">
              <!-- Seção do Mapa -->
              <div class="map-section">
                <div id="viewDiv" ref="mapViewDiv"></div>

                <!-- Botão de Localização -->
                <div class="custom-locate-btn" @click="getCurrentLocation" :class="{ loading: isLocating }">
                  <v-icon icon="mdi-crosshairs-gps" color="primary" />
                </div>

                <!-- Coordenadas -->
                <div class="coordinates-display">
                  <div class="coordinate-item">
                    <v-icon icon="mdi-latitude" color="primary" size="20" />
                    <span class="coordinate-label">Latitude:</span>
                    <span class="coordinate-value">{{ formData.latitude ? formData.latitude.toFixed(6) : '0.000000' }}°</span>
                  </div>
                  <div class="coordinate-item">
                    <v-icon icon="mdi-longitude" color="primary" size="20" />
                    <span class="coordinate-label">Longitude:</span>
                    <span class="coordinate-value">{{ formData.longitude ? formData.longitude.toFixed(6) : '0.000000' }}°</span>
                  </div>
                </div>
              </div>

              <!-- Seção de Campos -->
              <div class="fields-section">
                <!-- Campos de Endereço -->
                <div class="address-fields">
                  <v-row>
                    <v-col cols="12">
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

                    <v-col cols="12">
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

                    <v-col cols="12">
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

                    <v-col cols="12">
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

                    <v-col cols="12">
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

                    <v-col cols="12">
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

                    <v-col cols="12">
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
  latitude: -10.2491,  // Centro do Brasil
  longitude: -53.2316  // Centro do Brasil
})

const errors = reactive({
  zipCode: '',
  cnpj: ''
})

// Estado para busca
const searchQuery = ref('')
const searchResults = ref<any[]>([])
let searchTimeout: any = null

// Estado do mapa
const mapState = reactive({
  view: null as any,
  map: null as any,
  graphicsLayer: null as any,
  currentPin: null as any
})

// Configuração do marcador
const createMarkerSymbol = () => ({
  type: "picture-marker",
  url: "https://static.arcgis.com/images/Symbols/Basic/RedStickpin.png",
  width: "32px",
  height: "32px",
  xoffset: 0,
  yoffset: 16
})

// Função para adicionar pin no mapa com animação
const addPinToMap = (latitude: number, longitude: number) => {
  if (!mapState.view || !mapState.graphicsLayer) {
    console.error('Mapa não inicializado')
    return
  }

  try {
    // Atualiza as coordenadas no formulário primeiro
    formData.latitude = latitude
    formData.longitude = longitude

    // Remove o pin atual se existir
    mapState.graphicsLayer.removeAll()

    // Cria o ponto
    const point = {
      type: "point",
      longitude,
      latitude,
      spatialReference: { wkid: 4326 }
    }

    // Cria o pin com posição inicial acima do ponto
    const pinGraphic = new (window as any).esri.Graphic({
      geometry: point,
      symbol: {
        type: "picture-marker",
        url: "https://static.arcgis.com/images/Symbols/Basic/RedStickpin.png",
        width: "32px",
        height: "32px",
        xoffset: 0,
        yoffset: -100 // Começa acima do ponto para a animação
      }
    })

    // Adiciona o pin
    mapState.graphicsLayer.add(pinGraphic)

    // Cria o efeito de onda (ripple)
    const rippleGraphic = new (window as any).esri.Graphic({
      geometry: point,
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: [99, 102, 241, 0.4],
        size: "20px",
        outline: {
          color: [99, 102, 241, 0.8],
          width: 2
        }
      }
    })

    // Adiciona o ripple
    mapState.graphicsLayer.add(rippleGraphic)

    // Anima o ripple
    const animateRipple = () => {
      let size = 20
      let opacity = 0.4
      
      const rippleAnimation = setInterval(() => {
        size += 2
        opacity -= 0.02

        if (size >= 60 || opacity <= 0) {
          clearInterval(rippleAnimation)
          mapState.graphicsLayer.remove(rippleGraphic)
          return
        }

        rippleGraphic.symbol = {
          type: "simple-marker",
          style: "circle",
          color: [99, 102, 241, opacity],
          size: `${size}px`,
          outline: {
            color: [99, 102, 241, opacity * 2],
            width: 2
          }
        }
      }, 16)
    }

    // Anima a queda do pin
    const animatePin = () => {
      let yOffset = -100
      const targetOffset = 16
      let velocity = 0
      const gravity = 1.5
      const bounce = 0.7
      
      const pinAnimation = setInterval(() => {
        velocity += gravity
        yOffset += velocity

        if (yOffset >= targetOffset) {
          yOffset = targetOffset
          velocity = -velocity * bounce

          if (Math.abs(velocity) < 0.5) {
            clearInterval(pinAnimation)
            // Inicia o efeito de onda após o pin pousar
            animateRipple()
          }
        }

        pinGraphic.symbol = {
          type: "picture-marker",
          url: "https://static.arcgis.com/images/Symbols/Basic/RedStickpin.png",
          width: "32px",
          height: "32px",
          xoffset: 0,
          yoffset: yOffset
        }
      }, 16)
    }

    // Inicia a animação do pin
    animatePin()

    // Centraliza o mapa na nova posição
    mapState.view.goTo({
      target: point,
      zoom: 19,
      tilt: 0,
      rotation: 0
    }, {
      duration: 1000,
      easing: "ease-out"
    }).catch((error: any) => {
      console.error('Erro ao mover o mapa:', error)
    })

  } catch (error) {
    console.error('Erro ao adicionar pin:', error)
  }
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
          basemap: 'arcgis/navigation'
        })

        // Cria a camada de gráficos
        const graphicsLayer = new GraphicsLayer()
        map.add(graphicsLayer)

        // Configura a visualização do mapa
        const view = new MapView({
          container: "viewDiv",
          map: map,
          zoom: 4,
          center: [-53.2316, -10.2491], // Centro do Brasil
          constraints: {
            rotationEnabled: false,
            minZoom: 4,
            maxZoom: 20
          }
        })

        // Salva as referências no estado
        mapState.map = map
        mapState.view = view
        mapState.graphicsLayer = graphicsLayer

        // Configura o evento de clique no mapa
        view.on("click", async (event: any) => {
          try {
            const { latitude, longitude } = event.mapPoint
            
            // Remove pins existentes
            graphicsLayer.removeAll()

            // Cria o ponto
            const point = {
              type: "point",
              longitude,
              latitude,
              spatialReference: { wkid: 4326 }
            }

            // Cria o símbolo do pin
            const markerSymbol = {
              type: "simple-marker",
              style: "circle",
              color: [91, 33, 182],
              outline: {
                color: [255, 255, 255],
                width: 2
              },
              size: "20px"
            }

            // Cria o pin
            const pinGraphic = new Graphic({
              geometry: point,
              symbol: markerSymbol
            })

            // Adiciona o pin
            graphicsLayer.add(pinGraphic)

            // Atualiza as coordenadas no formulário
            formData.latitude = latitude
            formData.longitude = longitude

            // Centraliza o mapa na nova posição com animação suave
            view.goTo({
              target: event.mapPoint,
              zoom: view.zoom, // Mantém o zoom atual
              center: [longitude, latitude] // Centraliza exatamente onde clicou
            }, {
              duration: 500, // Animação mais rápida
              easing: "ease-in-out"
            })

            // Busca o endereço das coordenadas
            await reverseGeocodeWithNominatim(latitude, longitude)
          } catch (error) {
            console.error('Erro ao processar clique no mapa:', error)
          }
        })

        // Se já tiver coordenadas salvas, mostra o pin
        if (formData.latitude && formData.longitude) {
          const point = {
            type: "point",
            longitude: formData.longitude,
            latitude: formData.latitude,
            spatialReference: { wkid: 4326 }
          }

          const markerSymbol = {
            type: "simple-marker",
            style: "circle",
            color: [91, 33, 182],
            outline: {
              color: [255, 255, 255],
              width: 2
            },
            size: "20px"
          }

          const pinGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol
          })

          graphicsLayer.add(pinGraphic)

          view.goTo({
            target: point,
            zoom: 19
          })
        }
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error)
      }
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

    // Preenche os campos do formulário com os dados do endereço
    if (result.address) {
      formData.street = result.address.road || 
                       result.address.street || 
                       result.address.footway ||
                       result.address.path || ''
      
      formData.number = result.address.house_number || ''
      
      formData.neighborhood = result.address.suburb || 
                             result.address.neighbourhood || 
                             result.address.district || ''
      
      formData.city = result.address.city || 
                     result.address.town || 
                     result.address.municipality || ''
      
      formData.state = result.address.state_code || 
                      result.address.state || ''
      
      formData.zipCode = result.address.postcode || ''
    }

    // Limpa a busca
    searchQuery.value = ''
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
      // Logradouro: tenta diferentes campos possíveis
      formData.street = data.address.road || 
                       data.address.street || 
                       data.address.footway || 
                       data.address.path || 
                       ''

      // Número: tenta diferentes formatos
      formData.number = data.address.house_number || 
                       data.address.street_number || 
                       ''

      // Bairro: tenta diferentes campos possíveis
      formData.neighborhood = data.address.suburb || 
                            data.address.neighbourhood || 
                            data.address.district || 
                            data.address.subdistrict || 
                            ''

      // Cidade: tenta diferentes campos possíveis
      formData.city = data.address.city || 
                     data.address.town || 
                     data.address.municipality || 
                     ''

      // Estado: tenta primeiro a sigla, depois o nome completo
      formData.state = data.address.state_code || 
                      data.address.state || 
                      ''

      // CEP
      formData.zipCode = data.address.postcode || 
                        data.address.postal_code || 
                        ''

      // Complemento
      formData.complement = data.address.suburb ? 
                          `${data.address.suburb}` : 
                          ''

      console.log('Endereço encontrado:', data.address)
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

.map-fields-layout {
  display: grid;
  grid-template-columns: 1fr 450px; /* Mapa menor e formulário com largura fixa */
  gap: 2rem;
  align-items: start;
  margin: 0 2rem;
}

.map-section {
  position: relative;
  height: 450px; /* Altura reduzida */
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: #f8fafc;
}

#viewDiv {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8fafc;
}

/* Coordenadas */
.coordinates-display {
  position: absolute;
  bottom: 24px;
  left: 16px;
  right: 80px;
  display: flex;
  justify-content: center;
  gap: 3rem;
  height: 44px;
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  align-items: center;
}

.coordinate-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 100%;
  flex: 1;
  line-height: 1;
}

.coordinate-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 1px;
}

.coordinate-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.9375rem;
  color: #1e293b;
  font-weight: 600;
  line-height: 1;
  margin-top: 1px;
}

/* Ajuste do ícone */
:deep(.v-icon) {
  margin-top: 1px;
}

/* Seção de Campos */
.fields-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 450px; /* Mesma altura do mapa */
  overflow-y: auto;
  padding-right: 1rem;
}

/* Campos de Endereço */
.address-fields {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1.25rem;
}

:deep(.v-text-field) {
  margin-bottom: 1rem;
}

:deep(.v-text-field:last-child) {
  margin-bottom: 0;
}

:deep(.v-text-field .v-field) {
  border-radius: 8px !important;
  transition: all 0.2s ease;
}

:deep(.v-text-field .v-field:hover) {
  border-color: #6366f1 !important;
}

:deep(.v-text-field .v-field--focused) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
}

/* Scrollbar personalizado */
.fields-section::-webkit-scrollbar {
  width: 5px;
}

.fields-section::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.fields-section::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.fields-section::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsividade */
@media (max-width: 1200px) {
  .map-fields-layout {
    grid-template-columns: 1fr 400px;
    gap: 1.5rem;
    margin: 0 1.5rem;
  }
}

@media (max-width: 992px) {
  .map-fields-layout {
    grid-template-columns: 1fr;
    margin: 0 1rem;
  }

  .map-section {
    height: 400px;
  }

  .fields-section {
    height: auto;
    max-height: none;
    overflow-y: visible;
    padding: 0;
  }

  .search-field {
    position: relative;
    margin-bottom: 1rem;
  }
}

/* ESRI Map Overrides */
:deep(.esri-view) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.esri-view-surface) {
  outline: none !important;
}

:deep(.esri-ui) {
  z-index: 5 !important;
}

/* Botão de Localização */
.custom-locate-btn {
  position: absolute;
  bottom: 24px;
  right: 16px;
  background: white;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  z-index: 10;
}

.custom-locate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.custom-locate-btn.loading {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Responsividade para as coordenadas */
@media (max-width: 768px) {
  .coordinates-display {
    height: auto;
    padding: 0.5rem 1rem;
    flex-direction: column;
    gap: 0.5rem;
    right: 72px;
  }

  .coordinate-item {
    justify-content: flex-start;
  }
}

/* Estilo do campo de busca do ArcGIS */
.search-field,
.search-container {
  display: none;
}
</style> 
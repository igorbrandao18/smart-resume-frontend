<template>
  <div class="map-container">
    <div class="map-header">
      <h2>A localização está correta?</h2>
      <p class="subtitle">Verifique a localização identificada e ajuste se for necessário</p>
    </div>

    <div class="map-content">
      <div id="viewDiv" ref="mapViewDiv" class="map-view"></div>
      
      <div class="address-info" v-if="currentAddress">
        <p class="address-text">{{ currentAddress }}</p>
        <v-btn
          color="primary"
          block
          size="large"
          :loading="isSaving"
          @click="saveLocation"
        >
          Confirmar Localização
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const mapViewDiv = ref<HTMLElement | null>(null)
const currentAddress = ref('')
const isSaving = ref(false)

let view: any = null
let searchWidget: any = null

onMounted(async () => {
  // Load ArcGIS CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://js.arcgis.com/4.29/esri/themes/light/main.css'
  document.head.appendChild(link)

  // Load ArcGIS API
  const script = document.createElement('script')
  script.src = 'https://js.arcgis.com/4.29/'
  document.head.appendChild(script)

  script.onload = () => {
    // Wait for the API to be fully loaded
    (window as any).require([
      "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/widgets/Search",
      "esri/Graphic",
      "esri/layers/GraphicsLayer"
    ], function(esriConfig: any, Map: any, MapView: any, Search: any, Graphic: any, GraphicsLayer: any) {
      // Set API Key
      esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY

      // Create the map
      const map = new Map({
        basemap: 'streets-vector'
      })

      // Create the graphics layer for the marker
      const graphicsLayer = new GraphicsLayer()
      map.add(graphicsLayer)

      // Create the view
      view = new MapView({
        container: mapViewDiv.value!,
        map: map,
        zoom: 15,
        center: [-48.0779, -15.7801] // Default to Brasília
      })

      // Create the search widget
      searchWidget = new Search({
        view: view,
        popupEnabled: false,
        resultGraphicEnabled: false,
        sources: [{
          url: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer",
          singleLineFieldName: "SingleLine",
          name: "ArcGIS World Geocoding Service",
          placeholder: "Digite um endereço",
          maxResults: 3,
          maxSuggestions: 6,
          suggestionsEnabled: true,
          minSuggestCharacters: 3
        }]
      })

      // Add the search widget
      view.ui.add(searchWidget, {
        position: 'top-right',
        index: 2
      })

      // Handle search results
      searchWidget.on('select-result', (event: any) => {
        const { result } = event
        const { geometry, attributes } = result
        
        // Update marker position
        updateMarkerPosition(geometry, graphicsLayer, Graphic)
        
        // Update address display
        currentAddress.value = attributes.Match_addr || attributes.name
      })

      // Handle click events on the map
      view.on('click', (event: any) => {
        const point = event.mapPoint

        // Reverse geocode the clicked location
        searchWidget.search(point).then((response: any) => {
          if (response.results[0]) {
            const result = response.results[0]
            updateMarkerPosition(point, graphicsLayer, Graphic)
            currentAddress.value = result.name
          }
        })
      })

      // Initial geocoding if we have an address
      if (userStore.currentUser?.address) {
        searchWidget.search(userStore.currentUser.address)
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

const saveLocation = async () => {
  if (!currentAddress.value) return
  
  isSaving.value = true
  try {
    // Save the location to the user's profile
    await userStore.updateUserLocation({
      address: currentAddress.value,
      coordinates: {
        lat: view.center.latitude,
        lng: view.center.longitude
      }
    })
    
    // Navigate to the next step
    router.push('/complete-profile')
  } catch (error) {
    console.error('Error saving location:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style>
.map-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.map-header {
  margin-bottom: 1rem;
  text-align: center;
}

.map-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6B7280;
  font-size: 0.875rem;
}

.map-content {
  flex: 1;
  position: relative;
  min-height: 400px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.map-view {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.address-info {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.address-text {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #4B5563;
}
</style> 
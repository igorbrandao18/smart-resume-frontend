<template>
  <div class="location-search">
    <div class="search-container">
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
          @click="selectResult(result)"
        >
          <div class="result-icon">
            <v-icon :icon="getTypeIcon(result.type)" size="16" color="primary" />
          </div>
          <div class="result-content">
            <div class="result-title">{{ formatDisplayName(result) }}</div>
            <div class="result-subtitle">{{ formatAddress(result.address) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', result: any): void
}>()

const searchQuery = ref(props.modelValue || '')
const searchResults = ref<any[]>([])
let searchTimeout: any = null

// Watch para sincronizar v-model
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== searchQuery.value) {
      searchQuery.value = newValue
    }
  }
)

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

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

    return await response.json()
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

// Função para selecionar um resultado
const selectResult = (result: any) => {
  emit('select', result)
  searchQuery.value = formatDisplayName(result)
  searchResults.value = []
}
</script>

<style scoped>
.location-search {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.search-container {
  position: relative;
  width: 100%;
}

.search-wrapper {
  background: white;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

.search-wrapper:hover,
.search-wrapper:focus-within {
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.9375rem;
  color: #1e293b;
  background: transparent;
}

.search-icon {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.search-wrapper:hover .search-icon,
.search-wrapper:focus-within .search-icon {
  opacity: 1;
}

.search-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(226, 232, 240, 0.8);
  max-height: 280px;
  overflow-y: auto;
  z-index: 30;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: rgba(99, 102, 241, 0.05);
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 
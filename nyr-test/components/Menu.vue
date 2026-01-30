<template>
  <aside :class="['bg-black/90 text-stone flex flex-col border-r border-black/80 flex-shrink-0 h-full transition-all', isMenuExpanded ? 'w-64' : 'w-16']">
    <!-- Menu Header -->
    <div class="h-16 flex items-center px-6 border-b border-black/70 flex-shrink-0 bg-black/80 cursor-pointer hover:bg-black transition-colors" @click="isMenuExpanded = !isMenuExpanded">
      <i :class="['fa-solid w-5 text-white mr-3', isMenuExpanded ? 'fa-chevron-left' : 'fa-chevron-right']"></i>
      <span v-if="isMenuExpanded" class="font-bold text-white tracking-wide text-sm leading-tight">
        CENTROS DE COSTOS
      </span>
    </div>

    <!-- Menu Content -->
    <div class="flex-1 overflow-y-auto py-4 transition-all">
      <!-- Datos Maestros Section -->
      <nav class="mb-6 space-y-0.5">
        <h3 v-if="isMenuExpanded" class="px-6 text-[10px] font-bold uppercase tracking-wider mb-2 text-white">Datos Maestros</h3>
        <a href="#" @click.prevent="activeView = 'insumos'" :class="['nav-link', { 'active': activeView === 'insumos' }]">
          <i class="fa-solid fa-boxes-stacked w-5 text-stone mr-2"></i> <span v-if="isMenuExpanded">Insumos</span>
        </a>
        <a href="#" @click.prevent="activeView = 'productos'" :class="['nav-link', { 'active': activeView === 'productos' }]">
          <i class="fa-solid fa-tag w-5 text-stone mr-2"></i> <span v-if="isMenuExpanded">Productos</span>
        </a>
        <a href="#" @click.prevent="activeView = 'empresa'" :class="['nav-link', { 'active': activeView === 'empresa' }]">
          <i class="fa-solid fa-building w-5 text-stone mr-2"></i> <span v-if="isMenuExpanded">Empresa</span>
        </a>
        <a href="#" @click.prevent="activeView = 'puntos-venta'" :class="['nav-link', { 'active': activeView === 'puntos-venta' }]">
          <i class="fa-solid fa-shop w-5 text-stone mr-2"></i> <span v-if="isMenuExpanded">Puntos de Venta</span>
        </a>
      </nav>

      <!-- Gestión de Esquemas Header -->
      <h3 v-if="isMenuExpanded" class="px-6 text-[10px] font-bold uppercase tracking-wider mb-2 text-white">Gestión de Esquemas</h3>
      
      <!-- Ver Todos Link -->
      <a href="#" @click.prevent="activeEsquema = null" :class="['nav-link', { 'active': activeEsquema === null }]">
        <i class="fa-solid fa-eye w-5 mr-2"></i> <span v-if="isMenuExpanded">Ver todos</span>
      </a>

      <!-- Esquemas List -->
      <div class="mb-4">
        <!-- Esquema 1 -->
        <a href="#" @click.prevent="activeEsquema = activeEsquema === 'esquema1' ? null : 'esquema1'" :class="['nav-link', { 'active': activeEsquema === 'esquema1' }]">
          <i class="fa-solid fa-folder w-5 mr-2"></i> <span v-if="isMenuExpanded">Esquema Ejemplo</span>
          <i v-if="isMenuExpanded" :class="['ml-auto text-xs fa-solid', activeEsquema === 'esquema1' ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
        </a>

        <!-- Esquema 1 Content -->
        <div v-if="activeEsquema === 'esquema1'" class="bg-black/40 border-l-2 border-l-sage/70">
          <h4 class="px-6 text-[10px] font-bold uppercase text-white/80 mb-1 mt-2">Etapas</h4>
          <nav class="mb-3 space-y-0.5">
            <a href="#" @click.prevent="activeView = 'produccion'" :class="['sub-nav-link', { 'active': activeView === 'produccion' }]">
              1. Producción
            </a>
            <a href="#" @click.prevent="activeView = 'distribucion'" :class="['sub-nav-link', { 'active': activeView === 'distribucion' }]">
              2. Distribución
            </a>
            <a href="#" @click.prevent="activeView = 'ventas'" :class="['sub-nav-link', { 'active': activeView === 'ventas' }]">
              3. Ventas
            </a>
          </nav>

          <h4 class="px-6 text-[10px] font-bold uppercase text-white/80 mb-1">Datos Configuración</h4>
          <nav class="mb-3 space-y-0.5">
            <a href="#" @click.prevent="activeView = 'empresa-local'" :class="['sub-nav-link', { 'active': activeView === 'empresa-local' }]">
              Otros Costos (Empresa)
            </a>
            <a href="#" @click.prevent="activeView = 'variables-macro'" :class="['sub-nav-link', { 'active': activeView === 'variables-macro' }]">
              Variables Macro
            </a>
          </nav>
        </div>

        <!-- Esquema 2 -->
        <a href="#" @click.prevent="activeEsquema = activeEsquema === 'esquema2' ? null : 'esquema2'" :class="['nav-link', { 'active': activeEsquema === 'esquema2' }]">
          <i class="fa-solid fa-folder w-5 mr-2"></i> <span v-if="isMenuExpanded">Esquema Ejemplo 2</span>
          <i v-if="isMenuExpanded" :class="['ml-auto text-xs fa-solid', activeEsquema === 'esquema2' ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
        </a>

        <!-- Esquema 2 Content -->
        <div v-if="activeEsquema === 'esquema2'" class="bg-black/40 border-l-2 border-l-sage/70">
          <h4 class="px-6 text-[10px] font-bold uppercase text-white/80 mb-1 mt-2">Etapas</h4>
          <nav class="mb-3 space-y-0.5">
            <a href="#" @click.prevent="activeView = 'produccion2'" :class="['sub-nav-link', { 'active': activeView === 'produccion2' }]">
              1. Producción
            </a>
            <a href="#" @click.prevent="activeView = 'distribucion2'" :class="['sub-nav-link', { 'active': activeView === 'distribucion2' }]">
              2. Distribución
            </a>
            <a href="#" @click.prevent="activeView = 'ventas2'" :class="['sub-nav-link', { 'active': activeView === 'ventas2' }]">
              3. Ventas
            </a>
          </nav>

          <h4 class="px-6 text-[10px] font-bold uppercase text-white/80 mb-1">Datos Configuración</h4>
          <nav class="mb-3 space-y-0.5">
            <a href="#" @click.prevent="activeView = 'empresa-local2'" :class="['sub-nav-link', { 'active': activeView === 'empresa-local2' }]">
              Otros Costos (Empresa)
            </a>
            <a href="#" @click.prevent="activeView = 'variables-macro2'" :class="['sub-nav-link', { 'active': activeView === 'variables-macro2' }]">
              Variables Macro
            </a>
          </nav>
        </div>
      </div>
    </div>

    <!-- Menu Footer -->
    <div :class="['border-t border-black/70 py-4 bg-black/80 flex items-center gap-3', isMenuExpanded ? 'px-6 justify-start' : 'px-0 justify-center']">
      <div :class="['w-9 h-9 rounded-full text-white flex items-center justify-center font-semibold text-xs tracking-wide flex-shrink-0', avatarColorClass]">
        SN
      </div>
      <div v-if="isMenuExpanded" class="text-sm text-cream font-medium">
        Señorita Nayra
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const activeView = ref('')
const activeEsquema = ref(null)
const isMenuExpanded = ref(true)

// Avatar color - choose from: bg-red-600, bg-orange-600, bg-yellow-600, bg-green-600, bg-blue-600, bg-indigo-600, bg-purple-600, bg-pink-600, bg-cyan-600, bg-emerald-600
const avatarColorClass = ref('bg-red-600')
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  color: #9d9ea2;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.nav-link:hover {
  background-color: rgba(64, 34, 16, 0.5);
  color: #f4ecdd;
}

.nav-link.active {
  background-color: #402210;
  color: #f4ecdd;
  border-right: 3px solid #b1bca2;
}

.nav-link-primary {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  background-color: #21241e;
  border: 1px solid #402210;
  color: #6e634a;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-link-primary:hover {
  background-color: rgba(64, 34, 16, 0.5);
  color: #f4ecdd;
}

.nav-link-primary.active {
  background-color: #402210;
  color: #f4ecdd;
}

.sub-nav-link {
  display: flex;
  align-items: center;
  padding: 0.375rem 1.5rem;
  color: #9d9ea2;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.75rem;
  border-left: 2px solid transparent;
}

.sub-nav-link:hover {
  background-color: rgba(64, 34, 16, 0.3);
  color: #f4ecdd;
}

.sub-nav-link.active {
  color: #f4ecdd;
  background-color: rgba(64, 34, 16, 0.5);
  font-weight: 600;
  border-left-color: #b1bca2;
}
</style>

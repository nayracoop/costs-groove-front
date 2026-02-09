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
      <div v-if="isMenuExpanded" class="px-6 mb-4">
        <NyrBadge variant="success" size="sm">Viñedos "El Amanecer"</NyrBadge>
      </div>
      <NyrMenuSection label="Admin" header-level="h3">
        <NyrMenuLink 
          icon="fa-users"
          label="Cuentas"
          :active="isActive('/cuentas')"
          to="/cuentas"
        />
      </NyrMenuSection>
      <!-- Datos Maestros Section -->
      <NyrMenuSection label="Datos Maestros" header-level="h3">
        <NyrMenuLink 
          icon="fa-boxes-stacked"
          label="Insumos"
          :active="isActive('/insumos')"
          to="/insumos"
        />
        <NyrMenuLink 
          icon="fa-tag"
          label="Productos"
          :active="isActive('/productos')"
          to="/productos"
        />
        <!-- <NyrMenuLink 
          icon="fa-building"
          label="Empresa"
          :active="activeView === 'empresa'"
          
          @click="activeView = 'empresa'"
        /> -->
        <NyrMenuLink 
          icon="fa-shop"
          label="Puntos de Venta"
          :active="isActive('/puntos-venta')"
          to="/puntos-venta"
        />
        <NyrMenuLink
          icon="fa-gear"
          label="Procesos"
          :active="isActive('/procesos')"
          to="/procesos"
         />
      </NyrMenuSection>

      <!-- Gestión de Esquemas Header -->
      <h3 v-if="isMenuExpanded" class="px-6 text-[10px] font-bold uppercase tracking-wider mb-2 text-white">Gestión de Esquemas</h3>
      
      <!-- Ver Todos Link -->
      <NyrMenuLink 
        icon="fa-eye"
        label="Ver todos"
        :active="isActive('/esquemas')"
        to="/esquemas"
      />

      <!-- Esquemas List -->
      <div class="mb-4">
        <!-- Esquema 1 -->
        <NyrMenuCollapsible
          label="VENDIMIA_2026"
          icon="fa-folder"
          :active="activeEsquema === 'esquema1'"
          
          @click="activeEsquema = activeEsquema === 'esquema1' ? null : 'esquema1'"
        >
          <NyrMenuSection label="Tableros" header-level="h4">
            <NyrMenuLink 
              label="VENDIMIA_2026_A"
              :active="isActive('/tablero')"
              to="/tablero"
              :level="1"
            />
            <NyrMenuLink 
              label="VENDIMIA_2026_B"
              :active="false"
              to="/tablero"
              :level="1"
            />
          </NyrMenuSection>

          <NyrMenuSection label="Diagramas" header-level="h4">
            <NyrMenuLink 
              label="Producción Malbec"
              :active="false"
              :level="1"
            />
            <NyrMenuLink 
              label="Ensayo Vinos Blancos"
              :active="false"
              :level="1"
            />
          </NyrMenuSection>
          <NyrMenuSection label="Reportes" header-level="h4">
            <NyrMenuLink 
              label="Reporte Ejemplo 1"
              :active="false"
              :level="1"
            />
            <NyrMenuLink 
              label="Reporte Ejemplo 2"
              :active="false"
              :level="1"
            />

          </NyrMenuSection>
        </NyrMenuCollapsible>

        <!-- Esquema 2 -->
        <NyrMenuCollapsible
          label="Esquema Ejemplo 2"
          icon="fa-folder"
          :active="activeEsquema === 'esquema2'"
          @click="activeEsquema = activeEsquema === 'esquema2' ? null : 'esquema2'"
        >
          <NyrMenuSection label="Etapas" header-level="h4">
            <NyrMenuLink 
              label="1. Producción"
              :active="false"
              :level="1"
            />
            <NyrMenuLink 
              label="2. Distribución"
              :active="false"
              :level="1"
            />
            <NyrMenuLink 
              label="3. Ventas"
              :active="false"
              :level="1"
            />
          </NyrMenuSection>

          <NyrMenuSection label="Datos Configuración" header-level="h4">
            <NyrMenuLink 
              label="Otros Costos (Empresa)"
              :active="false"
              :level="1"
            />
            <NyrMenuLink 
              label="Variables Macro"
              :active="false"
              :level="1"
            />
          </NyrMenuSection>
        </NyrMenuCollapsible>
      </div>
    </div>

    <!-- Menu Footer -->
    <NuxtLink to="/usuario" :class="['border-t border-black/70 py-4 bg-black/80 block hover:bg-black transition-colors cursor-pointer', isMenuExpanded ? 'px-6' : 'px-0 flex justify-center']">
      <NyrAvatar 
        initials="SN" 
        name="Señorita Nayra"
        :color-class="avatarColorClass" 
         
      />
    </NuxtLink>
  </aside>
</template>

<script setup>
import { ref, provide, computed, watch } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const activeView = ref('')
const activeEsquema = ref(null)
const isMenuExpanded = ref(true)

// Check if a path is active
const isActive = (path) => {
  return route.path === path
}

// Auto-expand menu section when navigating to tablero
watch(() => route.path, (newPath) => {
  if (newPath === '/tablero') {
    activeEsquema.value = 'esquema1'
  }
}, { immediate: true })

// Provide isMenuExpanded to all child components
provide('isMenuExpanded', isMenuExpanded)

// Avatar color - choose from: bg-red-600, bg-orange-600, bg-yellow-600, bg-green-600, bg-blue-600, bg-indigo-600, bg-purple-600, bg-pink-600, bg-cyan-600, bg-emerald-600
const avatarColorClass = ref('bg-red-600')
</script>

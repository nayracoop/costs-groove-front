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
      <NyrMenuSection label="Datos Maestros" header-level="h3">
        <NyrMenuLink 
          icon="fa-boxes-stacked"
          label="Insumos"
          :active="activeView === 'insumos'"
          
          @click="activeView = 'insumos'"
        />
        <NyrMenuLink 
          icon="fa-tag"
          label="Productos"
          :active="activeView === 'productos'"
          
          @click="activeView = 'productos'"
        />
        <NyrMenuLink 
          icon="fa-building"
          label="Empresa"
          :active="activeView === 'empresa'"
          
          @click="activeView = 'empresa'"
        />
        <NyrMenuLink 
          icon="fa-shop"
          label="Puntos de Venta"
          :active="activeView === 'puntos-venta'"
          
          @click="activeView = 'puntos-venta'"
        />
      </NyrMenuSection>

      <!-- Gestión de Esquemas Header -->
      <h3 v-if="isMenuExpanded" class="px-6 text-[10px] font-bold uppercase tracking-wider mb-2 text-white">Gestión de Esquemas</h3>
      
      <!-- Ver Todos Link -->
      <NyrMenuLink 
        icon="fa-eye"
        label="Ver todos"
        :active="activeEsquema === null"
        @click="activeEsquema = null"
      />

      <!-- Esquemas List -->
      <div class="mb-4">
        <!-- Esquema 1 -->
        <NyrMenuCollapsible
          label="Esquema Ejemplo"
          icon="fa-folder"
          :active="activeEsquema === 'esquema1'"
          
          @click="activeEsquema = activeEsquema === 'esquema1' ? null : 'esquema1'"
        >
          <NyrMenuSection label="Etapas" header-level="h4">
            <NyrMenuLink 
              label="1. Producción"
              :active="activeView === 'produccion'"
              
              level="1"
              @click="activeView = 'produccion'"
            />
            <NyrMenuLink 
              label="2. Distribución"
              :active="activeView === 'distribucion'"
              
              level="1"
              @click="activeView = 'distribucion'"
            />
            <NyrMenuLink 
              label="3. Ventas"
              :active="activeView === 'ventas'"
              
              level="1"
              @click="activeView = 'ventas'"
            />
          </NyrMenuSection>

          <NyrMenuSection label="Datos Configuración" header-level="h4">
            <NyrMenuLink 
              label="Otros Costos (Empresa)"
              :active="activeView === 'empresa-local'"
              
              level="1"
              @click="activeView = 'empresa-local'"
            />
            <NyrMenuLink 
              label="Variables Macro"
              :active="activeView === 'variables-macro'"
              
              level="1"
              @click="activeView = 'variables-macro'"
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
              :active="activeView === 'produccion2'"
              
              level="1"
              @click="activeView = 'produccion2'"
            />
            <NyrMenuLink 
              label="2. Distribución"
              :active="activeView === 'distribucion2'"
              
              level="1"
              @click="activeView = 'distribucion2'"
            />
            <NyrMenuLink 
              label="3. Ventas"
              :active="activeView === 'ventas2'"
              
              level="1"
              @click="activeView = 'ventas2'"
            />
          </NyrMenuSection>

          <NyrMenuSection label="Datos Configuración" header-level="h4">
            <NyrMenuLink 
              label="Otros Costos (Empresa)"
              :active="activeView === 'empresa-local2'"
              
              level="1"
              @click="activeView = 'empresa-local2'"
            />
            <NyrMenuLink 
              label="Variables Macro"
              :active="activeView === 'variables-macro2'"
              
              level="1"
              @click="activeView = 'variables-macro2'"
            />
          </NyrMenuSection>
        </NyrMenuCollapsible>
      </div>
    </div>

    <!-- Menu Footer -->
    <div :class="['border-t border-black/70 py-4 bg-black/80', isMenuExpanded ? 'px-6' : 'px-0 flex justify-center']">
      <NyrAvatar 
        initials="SN" 
        name="Señorita Nayra"
        :color-class="avatarColorClass" 
         
      />
    </div>
  </aside>
</template>

<script setup>
import { ref, provide } from 'vue'

const activeView = ref('')
const activeEsquema = ref(null)
const isMenuExpanded = ref(true)

// Provide isMenuExpanded to all child components
provide('isMenuExpanded', isMenuExpanded)

// Avatar color - choose from: bg-red-600, bg-orange-600, bg-yellow-600, bg-green-600, bg-blue-600, bg-indigo-600, bg-purple-600, bg-pink-600, bg-cyan-600, bg-emerald-600
const avatarColorClass = ref('bg-red-600')
</script>

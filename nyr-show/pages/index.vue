<script setup>
definePageMeta({ layout: 'admin' })
import { ref } from 'vue'
const name = ref('')
const email = ref('')
const amount = ref('500.00')
const type_insumo = ref('')

const insumoOptions = [
  { key: 'materia_prima', value: 'Materia Prima' },
  { key: 'empaque', value: 'Empaque' },
  { key: 'insumo_seco', value: 'Insumo Seco' },
  { key: 'liquido', value: 'Líquido' }
];

const measureUnitsOptions = [
  { key: 'kg', value: 'Kilogramos (kg)' },
  { key: 'g', value: 'Gramos (g)' },
  { key: 'l', value: 'Litros (l)' },
  { key: 'ml', value: 'Mililitros (ml)' },
  { key: 'unidad', value: 'Unidad (u)' }
];
const unit_insumo = ref('kg');

function handleSubmit() {
  alert(`Insumo registrado: ${name.value}, Tipo: ${type_insumo.value}, Cantidad: ${amount.value}`)
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4 px-6 py-6">
    <!-- Main Content Card -->
    <NyrCard class="col-span-12 md:col-span-8" theme="default" hint="Sistema de gestión de costos para pequeñas empresas de alimentos">
      <NyrText type="h2">Sistemita de Costos</NyrText>
      <NyrText type="p" value="Plataforma integral para gestionar centros de costos" />
      <div class="mt-4">
        <NyrText type="number" :value="1234.567" prefix="$" postfix="ARS" />
      </div>
    </NyrCard>

    <!-- Info Card -->
    <NyrCard class="col-span-12 md:col-span-4" theme="info" hint="Cualquier texto adicional al final del card">
      <NyrText type="h6">Card info</NyrText>
      <NyrText type="p" value="Estilo info para cards" />
    </NyrCard>

    <!-- Accent Card -->
    <NyrCard class="col-span-12 md:col-span-6" theme="accent" hint="Cualquier texto adicional al final del card">
      <NyrText type="h5">Card Accent</NyrText>
      <NyrText type="p" value="con borde izquierdo " />
    </NyrCard>

    <!-- Form Card -->
    <NyrCard class="col-span-12 md:col-span-6" theme="default">
      <NyrText type="h5">Registrar Insumo</NyrText>
      <form @submit.prevent="handleSubmit" class="space-y-3 mt-4">
        <NyrInput 
          v-model="name" 
          type="text" 
          label="Nombre del Insumo" 
          placeholder="Ej: Harina integral bolsa 50kg"
          hint="Nombre descriptivo del insumo" 
        />
        <NyrSelect 
          v-model="type_insumo" 
          :options="insumoOptions"
          label="Tipo de Insumo" 
          placeholder="Selecciona el tipo"
          hint="Categoriza según el uso en producción" 
        />
        <NyrSelect 
          v-model="unit_insumo" 
          :options="measureUnitsOptions"
          label="Unidad de Medida" 
          placeholder="Selecciona la unidad"
          hint="Forma en que se mide este insumo" 
        />
        <NyrInput 
          v-model="amount" 
          type="number" 
          formatter="number" 
          label="Precio Unitario" 
          placeholder="0.00"
          hint="Precio por unidad de medida" 
        />
        
        <div class="flex gap-2 mt-4">
          <NyrButton @click="handleSubmit" hint="Guardar este insumo">
            Guardar Insumo
          </NyrButton>
          <NyrButton variant="outline" hint="Cancelar esta operación">
            Cancelar
          </NyrButton>
          <NyrButton variant="ghost" size="sm" hint="Ver opciones avanzadas">
            Más Opciones
          </NyrButton>
        </div>
      </form>
    </NyrCard>

    <!-- Button Variants Showcase -->
    <NyrCard class="col-span-12" theme="muted">
      <NyrText type="h5">Variantes de Botones</NyrText>
      <div class="flex flex-wrap gap-3 mt-4">
        <NyrButton variant="primary">Principal</NyrButton>
        <NyrButton variant="secondary">Secundario</NyrButton>
        <NyrButton variant="outline">Contorno</NyrButton>
        <NyrButton variant="ghost">Fantasma</NyrButton>
        <NyrButton size="sm">Pequeño</NyrButton>
        <NyrButton size="lg">Grande</NyrButton>
        <NyrButton :disabled="true">Deshabilitado</NyrButton>
      </div>
    </NyrCard>

    <!-- Select Component Showcase -->
    <NyrCard class="col-span-12 md:col-span-6" theme="default">
      <NyrText type="h5">Ejemplos de Selección</NyrText>
      <div class="space-y-4 mt-4">
        <NyrSelect 
          v-model="type_insumo"
          :options="insumoOptions"
          label="Selección Estándar"
          placeholder="Elige una opción"
          hint="Tamaño normal con placeholder"
        />
        
        <NyrSelect 
          :options="insumoOptions"
          :defaultOption="{ key: 'default', value: '-- Selecciona Tipo --' }"
          label="Con Opción por Defecto"
          size="sm"
          hint="Tamaño pequeño con opción por defecto"
        />
        
        <NyrSelect 
          :options="insumoOptions"
          label="Selección Grande"
          size="lg"
          state="success"
          hint="Tamaño grande con estado de éxito"
        />
        
        <NyrSelect 
          :options="insumoOptions"
          label="Selección Deshabilitada"
          :disabled="true"
          hint="Estado deshabilitado"
        />
      </div>
    </NyrCard>

    <!-- Typography Showcase -->
    <NyrCard class="col-span-12 md:col-span-6">
      <NyrText type="h1">Encabezado 1</NyrText>
      <NyrText type="h2">Encabezado 2</NyrText>
      <NyrText type="h3">Encabezado 3</NyrText>
      <NyrText type="h4">Encabezado 4</NyrText>
      <NyrText type="h5">Encabezado 5</NyrText>
      <NyrText type="h6">Encabezado 6</NyrText>
      <NyrText type="p" value="Texto de párrafo regular con altura de línea y espaciado adecuado para una legibilidad óptima." />
    </NyrCard>
  </div>
</template>

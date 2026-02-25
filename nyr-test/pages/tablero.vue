<script setup>
import {ref} from "vue";

definePageMeta({layout: "admin"});

const tableroName = ref("VENDIMIA_2026_A");

const columns = [
  {
    id: "gestion",
    name: "Gestión Empresa",
    defaultGridCols: 1,
    allowedTypes: ["Empresa", "Variable"]
  },
  {
    id: "produccion",
    name: "Producción",
    defaultGridCols: 2,
    allowedTypes: ["Proceso", "Producto"],
    group: "Gestion centros de costos (Productos)"
  },
  {
    id: "distribucion",
    name: "Distribución",
    defaultGridCols: 1,
    allowedTypes: ["Proceso"],
    group: "Gestion centros de costos (Productos)"
  },
  {
    id: "venta",
    name: "Venta",
    defaultGridCols: 1,
    allowedTypes: ["Punto de Venta"],
    group: "Gestion centros de costos (Productos)"
  },
  {
    id: "indicadores",
    name: "Indicadores",
    defaultGridCols: 1,
    allowedTypes: ["Indicador"]
  }
];

const cards = ref({
  gestion: [
    {id: 0, type: "Empresa", name: "Alquileres", icon: "fa-building"},
    {id: 1, type: "Empresa", name: "Sueldos", icon: "fa-building"},
    {id: 2, type: "Variable", name: "Variables Macro", icon: "fa-chart-line"}
  ],
  produccion: [
    {id: 3, type: "Proceso", name: "Fermentación Malbec", icon: "fa-gears"},
    {id: 4, type: "Proceso", name: "Prensado Uvas Tintas", icon: "fa-gears"},
    {id: 5, type: "Producto", name: "Malbec 2026 Reserva", icon: "fa-wine-bottle"},
    {id: 6, type: "Producto", name: "Chardonnay 2026", icon: "fa-wine-bottle"},
    {id: 7, type: "Proceso", name: "Crianza en Barrica", icon: "fa-gears"}
  ],
  distribucion: [
    {id: 8, type: "Proceso", name: "Embotellado", icon: "fa-gears"},
    {id: 9, type: "Proceso", name: "Etiquetado y Empaque", icon: "fa-gears"}
  ],
  venta: [
    {id: 10, type: "Punto de Venta", name: "Vinoteca Centro", icon: "fa-shop"},
    {id: 11, type: "Punto de Venta", name: "Bodega Principal", icon: "fa-shop"}
  ],
  indicadores: [
    {id: 12, type: "Indicador", name: "Punto de cierre", icon: "fa-chart-simple"},
    {id: 13, type: "Indicador", name: "Punto de equilibrio", icon: "fa-chart-simple"},
    {id: 14, type: "Indicador", name: "Margen de contribucion", icon: "fa-chart-simple"}
  ]
});

// Filters
const selectedTablero = ref("vendimia_2026_a");
const selectedTags = ref([]);
const cardNameFilter = ref("");

const tableroOptions = [
  {key: "vendimia_2026_a", value: "VENDIMIA_2026_A"},
  {key: "vendimia_2026_b", value: "VENDIMIA_2026_B"}
];

const tagOptions = [
  {key: "urgente", value: "Urgente"},
  {key: "revision", value: "Revisión"},
  {key: "aprobado", value: "Aprobado"}
];
</script>

<template>
  <div class="p-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-semibold text-charcoal mb-6">
        {{ tableroName }}
      </h1>

      <!-- Filters -->
      <NyrCard class="mb-4">
        <div class="flex gap-4 items-start">
          <div class="flex-1">
            <NyrSelect
              v-model="selectedTablero"
              label="Tablero"
              :options="tableroOptions"
            />
          </div>
          <div class="flex-1">
            <NyrSelect
              v-model="selectedTags"
              label="Filtrar por etiquetas"
              :options="tagOptions"
              multiple
            />
          </div>
          <div class="flex-1">
            <NyrInput
              v-model="cardNameFilter"
              label="Buscar tarjeta"
              placeholder="Nombre de tarjeta..."
            />
          </div>
        </div>
      </NyrCard>

      <NyrCard>
        <NyrKanban
          :columns="columns"
          :cards="cards"
          @update:cards="cards = $event"
        />
      </NyrCard>
    </div>
  </div>
</template>

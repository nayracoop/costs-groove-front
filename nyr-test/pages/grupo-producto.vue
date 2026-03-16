<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";

definePageMeta({layout: "admin"});

const router = useRouter();

// Form data
const grupoNombre = ref("");
const notas = ref("");
const etiquetas = ref([]);
const newTag = ref("");

// Kanban columns for "Gestión centros de costos (Productos)"
const columns = [
  {
    id: "produccion",
    name: "Producción",
    defaultGridCols: 3,
    allowedTypes: ["Proceso", "Producto"]
  },
  {
    id: "distribucion",
    name: "Distribución",
    defaultGridCols: 1,
    allowedTypes: ["Proceso"]
  },
  {
    id: "venta",
    name: "Venta",
    defaultGridCols: 1,
    allowedTypes: ["Punto de Venta"]
  }
];

const cards = ref({
  produccion: [
    {id: 101, type: "Proceso", name: "Prensado - Lote A", icon: "fa-gears", slotCol: 0, slotRow: 0},
    {id: 102, type: "Proceso", name: "Fermentación Inicial - Lote A", icon: "fa-gears", slotCol: 2, slotRow: 0},
    {id: 103, type: "Proceso", name: "Desfangado y Ajustes", icon: "fa-gears", slotCol: 0, slotRow: 1},
    {id: 104, type: "Proceso", name: "Fermentación Controlada - Lote B", icon: "fa-gears", slotCol: 2, slotRow: 1},
    {id: 105, type: "Proceso", name: "Maceración Corta", icon: "fa-gears", slotCol: 0, slotRow: 2},
    {id: 106, type: "Proceso", name: "Crianza en Barrica - Roble Francés", icon: "fa-gears", slotCol: 1, slotRow: 2},
    {id: 107, type: "Proceso", name: "Crianza en Barrica - Roble Americano", icon: "fa-gears", slotCol: 1, slotRow: 3},
    {id: 108, type: "Proceso", name: "Fermentación Maloláctica", icon: "fa-gears", slotCol: 2, slotRow: 3},
    {id: 109, type: "Proceso", name: "Clarificación", icon: "fa-gears", slotCol: 0, slotRow: 4},
    {id: 110, type: "Proceso", name: "Estabilización", icon: "fa-gears", slotCol: 2, slotRow: 4},
    {id: 111, type: "Proceso", name: "Corte y Ensamble", icon: "fa-gears", slotCol: 1, slotRow: 5},
    {id: 112, type: "Producto", name: "Blend Reserva 2026", icon: "fa-wine-bottle", slotCol: 1, slotRow: 6}
  ],
  distribucion: [
    {id: 201, type: "Proceso", name: "Embotellado", icon: "fa-gears", slotCol: 0, slotRow: 0},
    {id: 202, type: "Proceso", name: "Etiquetado y Empaque", icon: "fa-gears", slotCol: 0, slotRow: 1}
  ],
  venta: [
    {id: 301, type: "Punto de Venta", name: "Vinoteca Centro", icon: "fa-shop", slotCol: 0, slotRow: 0},
    {id: 302, type: "Punto de Venta", name: "Bodega Principal", icon: "fa-shop", slotCol: 0, slotRow: 1}
  ]
});

// Etiquetas options
const etiquetasOptions = ref([
  {key: "urgente", value: "Urgente"},
  {key: "revision", value: "Revisión"},
  {key: "aprobado", value: "Aprobado"},
  {key: "prioritario", value: "Prioritario"}
]);

function addNewTag() {
  if (!newTag.value.trim()) return;

  const tagKey = newTag.value.toLowerCase().replace(/\s+/g, "-");
  const tagExists = etiquetasOptions.value.some((opt) => { return opt.key === tagKey; });

  if (!tagExists) {
    etiquetasOptions.value.push({
      key: tagKey,
      value: newTag.value.trim()
    });
  }

  if (!etiquetas.value.includes(tagKey)) {
    etiquetas.value.push(tagKey);
  }

  newTag.value = "";
}

// Actions
function onSave() {
  // TODO: Save logic
  console.log("Saving grupo producto:", {
    nombre: grupoNombre.value,
    notas: notas.value,
    etiquetas: etiquetas.value,
    cards: cards.value
  });
  router.push("/grupos-productos");
}

function onCancel() {
  router.push("/grupos-productos");
}
</script>

<template>
  <div class="p-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-semibold text-charcoal mb-6">
        Grupo Producto
      </h1>

      <!-- Form Section -->
      <nyr-card class="mb-6">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <nyr-input
              v-model="grupoNombre"
              label="Grupo"
              placeholder="Nombre del grupo..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              v-model="notas"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Notas breves..."
              rows="2"
            />
          </div>

          <div>
            <nyr-select
              v-model="etiquetas"
              label="Etiquetas"
              :options="etiquetasOptions"
              multiple
            />
            <div class="mt-2 flex gap-2">
              <nyr-input
                v-model="newTag"
                placeholder="Nueva etiqueta..."
                size="sm"
                @keydown.enter.prevent="addNewTag"
              />
              <nyr-button
                variant="secondary"
                size="sm"
                @click="addNewTag"
              >
                <nyr-icon
                  icon="plus"
                  size="sm"
                />
              </nyr-button>
            </div>
          </div>
        </div>
      </nyr-card>

      <!-- Kanban Section -->
      <nyr-card class="mb-6">
        <nyr-kanban
          :columns="columns"
          :cards="cards"
          @update:cards="cards = $event"
        />
      </nyr-card>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end">
        <nyr-button
          variant="secondary"
          @click="onCancel"
        >
          Cancelar
        </nyr-button>
        <nyr-button
          variant="primary"
          @click="onSave"
        >
          Guardar
        </nyr-button>
      </div>
    </div>
  </div>
</template>

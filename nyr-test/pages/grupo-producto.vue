<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {definePageMeta} from "#imports";

definePageMeta({layout: "admin"});

const router = useRouter();

// Form data
const grupoNombre = ref("");
const notas = ref("");
const etiquetas = ref([]);
const newTag = ref("");

function buildLeftInputRightOutput() {
  return {
    inputs: [{id: "in-l-1", side: "l"}],
    outputs: [{id: "out-r-1", side: "r"}]
  };
}

function buildLeftInputRightOutputManyInputs(inputCount = 1) {
  return {
    inputs: Array.from({length: inputCount}, (_item, index) => {
      return {id: `in-l-${index + 1}`, side: "l"};
    }),
    outputs: [{id: "out-r-1", side: "r"}]
  };
}

function buildRightOutputOnly() {
  return {
    inputs: [],
    outputs: [{id: "out-r-1", side: "r"}]
  };
}

function buildLeftInputOnly() {
  return {
    inputs: [{id: "in-l-1", side: "l"}],
    outputs: []
  };
}

const diagramCards = ref([
  {
    id: 100,
    type: "Proceso",
    name: "Recepción de Uva",
    icon: "fa-gears",
    gridCol: 0,
    gridRow: 1,
    outputProducts: ["Mosto crudo"],
    ...buildRightOutputOnly()
  },
  {
    id: 101,
    type: "Proceso",
    name: "Fermentación Tinto",
    icon: "fa-gears",
    gridCol: 2,
    gridRow: 0,
    inputProducts: ["Mosto crudo"],
    outputProducts: ["Vino base tinto"],
    ...buildLeftInputRightOutput()
  },
  {
    id: 102,
    type: "Proceso",
    name: "Fermentación Blanco",
    icon: "fa-gears",
    gridCol: 2,
    gridRow: 2,
    inputProducts: ["Mosto crudo"],
    outputProducts: ["Vino base blanco"],
    ...buildLeftInputRightOutput()
  },
  {
    id: 103,
    type: "Proceso",
    name: "Corte y Ensamble",
    icon: "fa-gears",
    gridCol: 4,
    gridRow: 1,
    width: 260,
    height: 144,
    inputProducts: ["Vino base tinto", "Vino base blanco"],
    outputProducts: ["Blend joven"],
    ...buildLeftInputRightOutputManyInputs(2)
  },
  {
    id: 104,
    type: "Proceso",
    name: "Crianza Corta",
    icon: "fa-gears",
    gridCol: 6,
    gridRow: 1,
    inputProducts: ["Blend joven"],
    outputProducts: ["Vino afinado"],
    ...buildLeftInputRightOutput()
  },
  {
    id: 201,
    type: "Proceso",
    name: "Embotellado",
    icon: "fa-gears",
    gridCol: 8,
    gridRow: 1,
    inputProducts: ["Vino afinado"],
    outputProducts: ["Botella terminada"],
    ...buildLeftInputRightOutput()
  },
  {
    id: 301,
    type: "Canal de venta",
    name: "Vinoteca Centro",
    icon: "fa-shop",
    gridCol: 10,
    gridRow: 0,
    inputProducts: ["Botella terminada"],
    ...buildLeftInputOnly()
  },
  {
    id: 302,
    type: "Canal de venta",
    name: "Restaurante",
    icon: "fa-shop",
    gridCol: 10,
    gridRow: 2,
    inputProducts: ["Botella terminada"],
    ...buildLeftInputOnly()
  },
  {
    id: 900,
    type: "Comentario",
    name: "",
    icon: "",
    gridCol: 3,
    gridRow: 2,
    inputs: [],
    outputs: []
  }
]);

const diagramConnections = ref([
  {id: 1, from: {cardId: 100, portId: "out-r-1", side: "r"}, to: {cardId: 101, portId: "in-l-1", side: "l"}},
  {id: 2, from: {cardId: 100, portId: "out-r-1", side: "r"}, to: {cardId: 102, portId: "in-l-1", side: "l"}},
  {id: 3, from: {cardId: 101, portId: "out-r-1", side: "r"}, to: {cardId: 103, portId: "in-l-1", side: "l"}},
  {id: 4, from: {cardId: 102, portId: "out-r-1", side: "r"}, to: {cardId: 103, portId: "in-l-2", side: "l"}},
  {id: 5, from: {cardId: 103, portId: "out-r-1", side: "r"}, to: {cardId: 104, portId: "in-l-1", side: "l"}},
  {id: 6, from: {cardId: 104, portId: "out-r-1", side: "r"}, to: {cardId: 201, portId: "in-l-1", side: "l"}},
  {id: 7, from: {cardId: 201, portId: "out-r-1", side: "r"}, to: {cardId: 301, portId: "in-l-1", side: "l"}},
  {id: 8, from: {cardId: 201, portId: "out-r-1", side: "r"}, to: {cardId: 302, portId: "in-l-1", side: "l"}}
]);

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
  const tagExists = etiquetasOptions.value.some((opt) => {
    return opt.key === tagKey;
  });

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
  router.push("/grupos-productos");
}

function onCancel() {
  router.push("/grupos-productos");
}

function onDiagramCardsUpdate(nextCards) {
  diagramCards.value = nextCards;
}

function onDiagramConnectionsUpdate(nextConnections) {
  diagramConnections.value = nextConnections;
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

      <!-- Diagram Section -->
      <nyr-card class="mb-6">
        <nyr-diagram
          :cards="diagramCards"
          :connections="diagramConnections"
          :cols="12"
          :rows="5"
          @update:cards="onDiagramCardsUpdate"
          @update:connections="onDiagramConnectionsUpdate"
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

<script setup>
import {ref} from "vue";
import {useTableCrud} from "../../nyr-module/runtime/composables/useTableCrud";

definePageMeta({layout: "admin"});

const headers = [
  {text: "Línea Productiva", class: ""},
  {text: "Etapas", class: ""},
  {text: "", class: "w-32 text-center"}
];

// Sample data for productive lines with their stages
const rows = ref([
  [
    {text: "Vinos Blancos", class: "font-medium", editable: false},
    {
      text: "Prensado, Fermentación, Crianza, Embotellado, Etiquetado, Distribución, Mayorista",
      class: "text-sm",
      editable: false
    },
    {component: "action-buttons", class: "text-center"}
  ],
  [
    {text: "Vinos Reserva", class: "font-medium", editable: false},
    {
      text: "Prensado, Macerado, Fermentación, Crianza, Embotellado, Distribución, Retail",
      class: "text-sm",
      editable: false
    },
    {component: "action-buttons", class: "text-center"}
  ],
  [
    {text: "Vino Tinto", class: "font-medium", editable: false},
    {
      text: "Prensado, Fermentación, Filtrado, Embotellado, Empaquetado, Distribución, Salón",
      class: "text-sm",
      editable: false
    },
    {component: "action-buttons", class: "text-center"}
  ],
  [
    {text: "Vino Rosado", class: "font-medium", editable: false},
    {
      text: "Macerado, Fermentación, Filtrado, Embotellado, Distribución, Retail",
      class: "text-sm",
      editable: false
    },
    {component: "action-buttons", class: "text-center"}
  ]
]);

const newLineaForm = ref({
  nombre: "",
  etapas: ""
});

function resetAddForm() {
  newLineaForm.value = {
    nombre: "",
    etapas: ""
  };
}

function buildLineaRow() {
  return [
    {text: newLineaForm.value.nombre || "—", class: "font-medium", editable: false},
    {
      text: newLineaForm.value.etapas || "—",
      class: "text-sm",
      editable: false
    },
    {component: "action-buttons", class: "text-center"}
  ];
}

const {
  filterText,
  showAddModal,
  onAgregar,
  onCancelAgregar,
  onConfirmAgregar
} = useTableCrud(rows, {
  onAddRow: buildLineaRow,
  onResetForm: resetAddForm
});

function onCloneClick(rowIndex) {
  const rowToClone = rows.value[rowIndex];
  const clonedRow = JSON.parse(JSON.stringify(rowToClone));
  clonedRow[0].text = `${clonedRow[0].text} (Copia)`;
  rows.value.splice(rowIndex + 1, 0, clonedRow);
}

const showArchiveModal = ref(false);
const rowToArchive = ref(null);

function onArchiveClick(rowIndex) {
  rowToArchive.value = rowIndex;
  showArchiveModal.value = true;
}

function onConfirmArchive() {
  if (rowToArchive.value !== null) {
    rowToArchive.value = null;
  }
  showArchiveModal.value = false;
}

function onViewClick(_rowIndex) {
  // Navigate to detail page
}

function onCancelArchive() {
  rowToArchive.value = null;
  showArchiveModal.value = false;
}
</script>

<template>
  <div>
    <div class="p-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-semibold text-charcoal mb-6">
          Líneas Productivas
        </h1>

        <!-- Filter Section -->
        <div class="mb-6 max-w-xs">
          <NyrInput
            v-model="filterText"
            label="Buscar línea productiva"
            placeholder="Escribe para filtrar..."
          />
        </div>

        <!-- Action Buttons -->
        <div class="mb-6 flex gap-3">
          <NyrButton @click="onAgregar">
            <NyrIcon
              icon="plus"
              size="sm"
              class="mr-2"
            />
            Agregar
          </NyrButton>
        </div>

        <!-- Table -->
        <NyrTable
          :headers="headers"
          :rows="rows"
          :paginate="true"
          :limit="8"
        >
          <template #cell-action-buttons="{ rowIndex }">
            <div class="flex gap-2 justify-center">
              <button
                class="text-blue-600 hover:text-blue-800 transition-colors p-2"
                title="Ver"
                @click="onViewClick(rowIndex)"
              >
                <NyrIcon
                  icon="eye"
                  size="sm"
                />
              </button>
              <button
                class="text-green-600 hover:text-green-800 transition-colors p-2"
                title="Clonar"
                @click="onCloneClick(rowIndex)"
              >
                <NyrIcon
                  icon="copy"
                  size="sm"
                />
              </button>
              <button
                class="text-gray-600 hover:text-gray-800 transition-colors p-2"
                title="Archivar"
                @click="onArchiveClick(rowIndex)"
              >
                <NyrIcon
                  icon="archive"
                  size="sm"
                />
              </button>
            </div>
          </template>
        </NyrTable>
      </div>
    </div>

    <!-- Add Línea Modal -->
    <NyrModal
      v-model="showAddModal"
      size="md"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-charcoal mb-6">
          Nueva Línea Productiva
        </h3>
        <div class="space-y-4">
          <NyrInput
            v-model="newLineaForm.nombre"
            label="Nombre de la línea"
            placeholder="Ej: Vino Malbec Premium"
          />
          <NyrInput
            v-model="newLineaForm.etapas"
            label="Etapas (separadas por coma)"
            placeholder="Ej: Prensado, Fermentación, Embotellado, Distribución"
          />
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <NyrButton
            variant="secondary"
            @click="onCancelAgregar"
          >
            Cancelar
          </NyrButton>
          <NyrButton @click="onConfirmAgregar">
            <NyrIcon
              icon="plus"
              size="sm"
              class="mr-2"
            />
            Agregar
          </NyrButton>
        </div>
      </div>
    </NyrModal>

    <!-- Archive Confirmation Modal -->
    <NyrModal
      v-model="showArchiveModal"
      size="sm"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-charcoal mb-3">
          Confirmar archivado
        </h3>
        <p class="text-gray-600 mb-6">
          ¿Estás seguro que deseas archivar esta línea productiva?
        </p>
        <div class="flex gap-3 justify-end">
          <NyrButton
            variant="secondary"
            @click="onCancelArchive"
          >
            Cancelar
          </NyrButton>
          <NyrButton
            class="bg-orange-500 hover:bg-orange-600"
            @click="onConfirmArchive"
          >
            <NyrIcon
              icon="box-archive"
              size="sm"
              class="mr-2"
            />
            Archivar
          </NyrButton>
        </div>
      </div>
    </NyrModal>
  </div>
</template>

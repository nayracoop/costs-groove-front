<script setup>
import {ref} from "vue";
import {useTableCrud} from "../../nyr-module/runtime/composables/useTableCrud";
import {definePageMeta, useRouter} from "#imports";

const router = useRouter();
definePageMeta({layout: "admin"});

const headers = [
  {text: "Grupo", class: ""},
  {text: "Color", class: "w-40"},
  {text: "Etapas", class: ""},
  {text: "", class: "w-32 text-center"}
];

const colorOptions = [
  {key: "red", value: "Rojo", swatchClass: "bg-red-500"},
  {key: "orange", value: "Naranja", swatchClass: "bg-orange-500"},
  {key: "amber", value: "Amarillo", swatchClass: "bg-amber-400"},
  {key: "green", value: "Verde", swatchClass: "bg-green-500"},
  {key: "blue", value: "Azul", swatchClass: "bg-blue-500"},
  {key: "violet", value: "Violeta", swatchClass: "bg-violet-500"},
  {key: "pink", value: "Rosa", swatchClass: "bg-pink-500"},
  {key: "gray", value: "Gris", swatchClass: "bg-gray-600"}
];

function getColorOption(colorKey) {
  return colorOptions.find((option) => {
    return option.key === colorKey;
  }) || colorOptions[4];
}

// Sample data for productive lines with their stages
const rows = ref([
  [
    {text: "Vinos Blancos", class: "font-medium", editable: false},
    {component: "group-color", text: "Verde", swatchClass: "bg-green-500", class: ""},
    {
      text: "Prensado, Fermentación, Crianza, Embotellado, Etiquetado, Distribución, Mayorista",
      class: "text-sm",
      editable: false
    },
    {component: "action-buttons", class: "text-center"}
  ],
  [
    {text: "Vinos Reserva", class: "font-medium", editable: false},
    {component: "group-color", text: "Azul", swatchClass: "bg-blue-500", class: ""},
    {
      text: "Prensado, Macerado, Fermentación, Crianza, Embotellado, Distribución, Retail",
      class: "text-sm",
      editable: false
    },
    {component: "action-buttons", class: "text-center"}
  ],
  [
    {text: "Vino Tinto", class: "font-medium", editable: false},
    {component: "group-color", text: "Rojo", swatchClass: "bg-red-500", class: ""},
    {
      text: "Prensado, Fermentación, Filtrado, Embotellado, Empaquetado, Distribución, Salón",
      class: "text-sm",
      editable: false
    },
    {component: "action-buttons", class: "text-center"}
  ],
  [
    {text: "Vino Rosado", class: "font-medium", editable: false},
    {component: "group-color", text: "Rosa", swatchClass: "bg-pink-500", class: ""},
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
  color: "blue"
});

function resetAddForm() {
  newLineaForm.value = {
    nombre: "",
    color: "blue"
  };
}

function buildLineaRow() {
  const selectedColor = getColorOption(newLineaForm.value.color);

  return [
    {text: newLineaForm.value.nombre || "—", class: "font-medium", editable: false},
    {
      component: "group-color",
      text: selectedColor.value,
      swatchClass: selectedColor.swatchClass,
      class: ""
    },
    {
      text: "—",
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
  router.push("/grupo-producto");
}

function onCancelArchive() {
  rowToArchive.value = null;
  showArchiveModal.value = false;
}

function getRowActions(rowIndex) {
  return [
    {
      icon: "eye",
      title: "Ver",
      variant: "primary",
      onClick: () => { return onViewClick(rowIndex); }
    },
    {
      icon: "copy",
      title: "Clonar",
      variant: "success",
      onClick: () => { return onCloneClick(rowIndex); }
    },
    {
      icon: "archive",
      title: "Archivar",
      variant: "secondary",
      onClick: () => { return onArchiveClick(rowIndex); }
    }
  ];
}
</script>

<template>
  <div>
    <div class="p-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-semibold text-charcoal mb-6">
          Grupos de Productos
        </h1>

        <!-- Filter Section -->
        <div class="mb-6 max-w-xs">
          <NyrInput
            v-model="filterText"
            label="Buscar grupo de productos"
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
          <template #cell-group-color="{ cell }">
            <div class="flex justify-center">
              <span
                class="h-3 w-3 rounded-full"
                :class="cell.swatchClass"
                :title="cell.text"
              />
            </div>
          </template>

          <template #cell-action-buttons="{ rowIndex }">
            <ClientOnly>
              <nyr-cell-actions :actions="getRowActions(rowIndex)" />
            </ClientOnly>
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
          Nuevo grupo de productos
        </h3>
        <div class="space-y-4">
          <NyrInput
            v-model="newLineaForm.nombre"
            label="Nombre del grupo"
            placeholder="Ej: Vino Malbec Premium"
          />
          <NyrSelect
            v-model="newLineaForm.color"
            label="Color"
            :options="colorOptions"
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

<script setup>
import { ref } from "vue";

definePageMeta({ layout: "admin" });

const headers = [
  { text: "Rubro", class: "" },
  { text: "Erogable / No", class: "" },
  { text: "", class: "w-16 text-center" }
];

const erogableOptions = [
  { key: "erogable", value: "Erogable" },
  { key: "no-erogable", value: "No Erogable" }
];

const filterText = ref("");
const showDeleteModal = ref(false);
const showAddModal = ref(false);
const rowToDelete = ref(null);
const newCostoForm = ref({
  rubro: "",
  erogable: ""
});

function getOptionText(options, key) {
  const match = options.find((option) => option.key === key);
  return match ? match.value : "—";
}

function makeRow({ rubro, erogableKey }) {
  return [
    {
      text: rubro,
      class: "",
      editable: true
    },
    {
      text: getOptionText(erogableOptions, erogableKey),
      value: erogableKey,
      class: "",
      editable: true,
      options: erogableOptions
    },
    { component: "delete-button", class: "text-center" }
  ];
}

const rows = ref([
  makeRow({ rubro: "Salario", erogableKey: "erogable" }),
  makeRow({ rubro: "Alquiler", erogableKey: "erogable" }),
  makeRow({ rubro: "Servicios", erogableKey: "erogable" }),
  makeRow({ rubro: "Mantenimiento", erogableKey: "erogable" }),
  makeRow({ rubro: "Amortizaciones", erogableKey: "no-erogable" }),
  makeRow({ rubro: "Logistica", erogableKey: "erogable" }),
  makeRow({ rubro: "Otros", erogableKey: "erogable" })
]);

function onCellEdited(event) {
  const { rowIndex, colIndex, newValue } = event;
  const cell = rows.value[rowIndex][colIndex];

  if (Array.isArray(cell.options)) {
    const match = cell.options.find((option) => option.key === newValue);
    cell.value = newValue;
    cell.text = match ? match.value : "";
  } else {
    cell.text = newValue;
  }
}

function onImportCSV() {
  console.log("Import CSV clicked");
}

function onSave() {
  console.log("Save clicked");
}

function onAgregar() {
  showAddModal.value = true;
}

function resetAddForm() {
  newCostoForm.value = {
    rubro: "",
    erogable: ""
  };
}

function onCancelAgregar() {
  showAddModal.value = false;
  resetAddForm();
}

function onConfirmAgregar() {
  rows.value.unshift(
    makeRow({
      rubro: newCostoForm.value.rubro,
      erogableKey: newCostoForm.value.erogable
    })
  );

  showAddModal.value = false;
  resetAddForm();
}

function onDeleteClick(rowIndex) {
  rowToDelete.value = rowIndex;
  showDeleteModal.value = true;
}

function onConfirmDelete() {
  if (rowToDelete.value !== null) {
    rows.value.splice(rowToDelete.value, 1);
    console.log("Row deleted:", rowToDelete.value);
  }
  showDeleteModal.value = false;
  rowToDelete.value = null;
}

function onCancelDelete() {
  showDeleteModal.value = false;
  rowToDelete.value = null;
}
</script>

<template>
  <div>
    <div class="p-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-semibold text-charcoal mb-6">
          Tabla de Costos fijos
        </h1>

        <!-- Filter Section -->
        <div class="mb-6 max-w-xs">
          <NyrInput
            v-model="filterText"
            label="Buscar rubro"
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
          <NyrButton
            variant="secondary"
            @click="onImportCSV"
          >
            <NyrIcon
              icon="file-csv"
              size="sm"
              class="mr-2"
            />
            Importar CSV
          </NyrButton>
        </div>

        <!-- Table -->
        <NyrTable
          :headers="headers"
          :rows="rows"
          :paginate="true"
          :limit="8"
          @cell-edited="onCellEdited"
        >
          <template #cell-delete-button="{ rowIndex }">
            <button
              class="text-red-500 hover:text-red-700 transition-colors p-2"
              title="Eliminar"
              @click="onDeleteClick(rowIndex)"
            >
              <NyrIcon
                icon="trash"
                size="sm"
              />
            </button>
          </template>
        </NyrTable>

        <!-- Save Button -->
        <div class="mt-6 flex justify-end">
          <NyrButton @click="onSave">
            <NyrIcon
              icon="floppy-disk"
              size="sm"
              class="mr-2"
            />
            Guardar Cambios
          </NyrButton>
        </div>
      </div>
    </div>

    <!-- Add Costo Fijo Modal -->
    <NyrModal
      v-model="showAddModal"
      size="md"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-charcoal mb-6">
          Nuevo Costo Fijo
        </h3>
        <div class="space-y-4">
          <NyrInput
            v-model="newCostoForm.rubro"
            label="Rubro"
            placeholder="Ej: Seguros"
          />
          <NyrSelect
            v-model="newCostoForm.erogable"
            label="Erogable / No"
            :options="erogableOptions"
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

    <!-- Delete Confirmation Modal -->
    <NyrModal
      v-model="showDeleteModal"
      size="sm"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-charcoal mb-3">
          Confirmar eliminacion
        </h3>
        <p class="text-gray-600 mb-6">
          ¿Estas seguro que deseas eliminar este costo fijo?
        </p>
        <div class="flex gap-3 justify-end">
          <NyrButton
            variant="secondary"
            @click="onCancelDelete"
          >
            Cancelar
          </NyrButton>
          <NyrButton
            class="bg-red-500 hover:bg-red-600"
            @click="onConfirmDelete"
          >
            <NyrIcon
              icon="trash"
              size="sm"
              class="mr-2"
            />
            Eliminar
          </NyrButton>
        </div>
      </div>
    </NyrModal>
  </div>
</template>
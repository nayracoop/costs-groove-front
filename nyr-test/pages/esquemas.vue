<script setup>
import {ref} from "vue";
import {definePageMeta} from "#imports";

defineOptions({name: "EsquemasPage"});
definePageMeta({layout: "admin"});

const headers = [
  {text: "Esquema", class: ""},
  {text: "Periodo", class: ""},
  {text: "Notas", class: ""},
  {text: "Tableros", class: "text-center"},
  {text: "Estado", class: "text-center"},
  {text: "Acciones", class: "w-40 text-center"}
];

const filterText = ref("");
const showCloneModal = ref(false);
const showNewModal = ref(false);
const showArchiveModal = ref(false);
const schemaToClone = ref(null);
const schemaToArchive = ref(null);

// Form data for new schema
const newSchemaForm = ref({
  nombre: "",
  desde: "",
  hasta: "",
  notas: "",
  nombreTablero: ""
});

const tableros = [
  {name: "VENDIMIA_2026_A", link: "#/tableros/vendimia-2026-a"},
  {name: "VENDIMIA_2026_B", link: "#/tableros/vendimia-2026-b"}
];

const tableros2025 = [
  {name: "VENDIMIA_2025_A", link: "#/tableros/vendimia-2025-a"},
  {name: "VENDIMIA_2025_B", link: "#/tableros/vendimia-2025-b"}
];

const rows = ref([
  [
    {text: "VENDIMIA_2026", class: "font-medium", editable: false},
    {text: "1/2026 - 12/2026", class: "", editable: false},
    {text: "Esquema para la vendimia del año 2026", class: "text-sm text-gray-600", editable: false},
    {component: "tableros-list", class: "", data: tableros},
    {component: "estado-badge", class: "text-center", text: "Activo", variant: "success"},
    {component: "action-buttons", class: "text-center"}
  ],
  [
    {text: "VENDIMIA_2025", class: "font-medium", editable: false},
    {text: "1/2025 - 12/2025", class: "", editable: false},
    {text: "Esquema histórico de la vendimia del año 2025", class: "text-sm text-gray-600", editable: false},
    {component: "tableros-list", class: "", data: tableros2025},
    {component: "estado-badge", class: "text-center", text: "Archivado", variant: "warning"},
    {component: "action-buttons", class: "text-center"}
  ]
]);

function onCloneClick(rowIndex) {
  schemaToClone.value = rows.value[rowIndex][0].text;
  showCloneModal.value = true;
}

function onConfirmClone() {
  // Placeholder: clone action pending API integration.
  showCloneModal.value = false;
  schemaToClone.value = null;
}

function onCancelClone() {
  showCloneModal.value = false;
  schemaToClone.value = null;
}

function onNewSchema() {
  showNewModal.value = true;
}

function onCreateSchema() {
  // Placeholder: create action pending API integration.
  // Reset form
  newSchemaForm.value = {
    nombre: "",
    desde: "",
    hasta: "",
    notas: "",
    nombreTablero: ""
  };
  showNewModal.value = false;
}

function onCancelNewSchema() {
  newSchemaForm.value = {
    nombre: "",
    desde: "",
    hasta: "",
    notas: "",
    nombreTablero: ""
  };
  showNewModal.value = false;
}

function onArchiveClick(rowIndex) {
  schemaToArchive.value = rows.value[rowIndex][0].text;
  showArchiveModal.value = true;
}

function onConfirmArchive() {
  // Placeholder: archive action pending API integration.
  showArchiveModal.value = false;
  schemaToArchive.value = null;
}

function onCancelArchive() {
  showArchiveModal.value = false;
  schemaToArchive.value = null;
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-cream overflow-y-auto">
      <div class="p-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h1 class="text-2xl font-semibold text-charcoal mb-6">
            Esquemas
          </h1>

          <!-- Filter Section -->
          <div class="mb-6 flex items-end gap-4">
            <div class="flex-1 max-w-xs">
              <NyrInput
                v-model="filterText"
                label="Buscar esquema"
                placeholder="Escribe para filtrar..."
              />
            </div>
            <NyrButton @click="onNewSchema">
              <NyrIcon
                icon="plus"
                size="sm"
                class="mr-2"
              />
              Nuevo esquema
            </NyrButton>
          </div>

          <!-- Table -->
          <NyrTable
            :headers="headers"
            :rows="rows"
            :paginate="false"
          >
            <template #cell-tableros-list="{ cell }">
              <div class="flex flex-col gap-1 py-1">
                <NuxtLink
                  v-for="tablero in cell.data"
                  :key="tablero.name"
                  :to="tablero.link"
                  class="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  {{ tablero.name }}
                </NuxtLink>
              </div>
            </template>

            <template #cell-estado-badge="{ cell }">
              <NyrBadge
                :text="cell.text"
                :variant="cell.variant"
                size="sm"
              />
            </template>

            <template #cell-action-buttons="{ rowIndex }">
              <div class="flex gap-2 justify-center">
                <NyrButton
                  variant="ghost"
                  size="sm"
                  title="Clonar esquema"
                  @click="onCloneClick(rowIndex)"
                >
                  <NyrIcon
                    icon="copy"
                    size="sm"
                  />
                </NyrButton>
                <NyrButton
                  variant="ghost"
                  size="sm"
                  title="Archivar esquema"
                  @click="onArchiveClick(rowIndex)"
                >
                  <NyrIcon
                    icon="folder-minus"
                    size="sm"
                  />
                </NyrButton>
              </div>
            </template>
          </NyrTable>
        </div>
      </div>
    </main>

    <!-- Clone Confirmation Modal -->
    <NyrModal
      v-model="showCloneModal"
      size="sm"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-charcoal mb-3">
          Clonar esquema
        </h3>
        <p class="text-gray-600 mb-6">
          ¿Deseas clonar el esquema <strong>{{ schemaToClone }}</strong>?
        </p>
        <div class="flex gap-3 justify-end">
          <NyrButton
            variant="secondary"
            @click="onCancelClone"
          >
            Cancelar
          </NyrButton>
          <NyrButton @click="onConfirmClone">
            <NyrIcon
              icon="copy"
              size="sm"
              class="mr-2"
            />
            Clonar
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
          Archivar esquema
        </h3>
        <p class="text-gray-600 mb-6">
          ¿Deseas archivar el esquema <strong>{{ schemaToArchive }}</strong>? Esta acción se puede revertir.
        </p>
        <div class="flex gap-3 justify-end">
          <NyrButton
            variant="secondary"
            @click="onCancelArchive"
          >
            Cancelar
          </NyrButton>
          <NyrButton
            variant="danger"
            @click="onConfirmArchive"
          >
            <NyrIcon
              icon="folder-minus"
              size="sm"
              class="mr-2"
            />
            Archivar
          </NyrButton>
        </div>
      </div>
    </NyrModal>

    <!-- New Schema Modal -->
    <NyrModal
      v-model="showNewModal"
      size="md"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-charcoal mb-6">
          Nuevo Esquema
        </h3>

        <div class="space-y-4">
          <NyrInput
            v-model="newSchemaForm.nombre"
            label="Nombre del esquema"
            placeholder="Ej: VENDIMIA_2027"
          />

          <div class="grid grid-cols-2 gap-4">
            <NyrDate
              v-model="newSchemaForm.desde"
              label="Desde"
              :start-year="2020"
              :end-year="2035"
            />
            <NyrDate
              v-model="newSchemaForm.hasta"
              label="Hasta"
              :start-year="2020"
              :end-year="2035"
            />
          </div>

          <NyrInput
            v-model="newSchemaForm.notas"
            label="Notas"
            placeholder="Descripción del esquema..."
          />

          <NyrInput
            v-model="newSchemaForm.nombreTablero"
            label="Nombre del primer tablero"
            placeholder="Ej: VENDIMIA_2027_A"
          />
        </div>

        <div class="flex gap-3 justify-end mt-6">
          <NyrButton
            variant="secondary"
            @click="onCancelNewSchema"
          >
            Cancelar
          </NyrButton>
          <NyrButton @click="onCreateSchema">
            <NyrIcon
              icon="plus"
              size="sm"
              class="mr-2"
            />
            Crear
          </NyrButton>
        </div>
      </div>
    </NyrModal>
  </div>
</template>

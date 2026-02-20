<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const headers = [
	{ text: 'Indicador', class: '' },
	{ text: '', class: 'w-16 text-center' }
]

const filterText = ref('')
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const rowToDelete = ref(null)
const newIndicadorForm = ref({
	nombre: ''
})

const rows = ref([
	[
		{ text: 'Punto de cierre', class: '', editable: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Punto de equilibrio', class: '', editable: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Margen de contribucion', class: '', editable: true },
		{ component: 'delete-button', class: 'text-center' }
	]
])

function onCellEdited(event) {
	const { rowIndex, colIndex, newValue } = event
	const cell = rows.value[rowIndex][colIndex]
	cell.text = newValue
}

function onImportCSV() {
	console.log('Import CSV clicked')
}

function onSave() {
	console.log('Save clicked')
}

function onAgregar() {
	showAddModal.value = true
}

function resetAddForm() {
	newIndicadorForm.value = {
		nombre: ''
	}
}

function onCancelAgregar() {
	showAddModal.value = false
	resetAddForm()
}

function onConfirmAgregar() {
	rows.value.unshift([
		{ text: newIndicadorForm.value.nombre || '—', class: '', editable: true },
		{ component: 'delete-button', class: 'text-center' }
	])

	showAddModal.value = false
	resetAddForm()
}

function onDeleteClick(rowIndex) {
	rowToDelete.value = rowIndex
	showDeleteModal.value = true
}

function onConfirmDelete() {
	if (rowToDelete.value !== null) {
		rows.value.splice(rowToDelete.value, 1)
		console.log('Row deleted:', rowToDelete.value)
	}
	showDeleteModal.value = false
	rowToDelete.value = null
}

function onCancelDelete() {
	showDeleteModal.value = false
	rowToDelete.value = null
}
</script>

<template>
	<div class="p-8">
		<div class="bg-white rounded-lg shadow-sm p-6">
			<h1 class="text-2xl font-semibold text-charcoal mb-6">Tabla de Indicadores</h1>

			<!-- Filter Section -->
			<div class="mb-6 max-w-xs">
				<NyrInput
					v-model="filterText"
					label="Buscar indicador"
					placeholder="Escribe para filtrar..."
				/>
			</div>

			<!-- Action Buttons -->
			<div class="mb-6 flex gap-3">
				<NyrButton @click="onAgregar">
					<NyrIcon icon="plus" size="sm" class="mr-2" />
					Agregar
				</NyrButton>
				<NyrButton @click="onImportCSV" variant="secondary">
					<NyrIcon icon="file-csv" size="sm" class="mr-2" />
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
						@click="onDeleteClick(rowIndex)"
						class="text-red-500 hover:text-red-700 transition-colors p-2"
						title="Eliminar"
					>
						<NyrIcon icon="trash" size="sm" />
					</button>
				</template>
			</NyrTable>

			<!-- Save Button -->
			<div class="mt-6 flex justify-end">
				<NyrButton @click="onSave">
					<NyrIcon icon="floppy-disk" size="sm" class="mr-2" />
					Guardar Cambios
				</NyrButton>
			</div>
		</div>
	</div>

	<!-- Add Indicador Modal -->
	<NyrModal v-model="showAddModal" size="md">
		<div class="p-6">
			<h3 class="text-lg font-semibold text-charcoal mb-6">Nuevo Indicador</h3>
			<div class="space-y-4">
				<NyrInput
					v-model="newIndicadorForm.nombre"
					label="Indicador"
					placeholder="Ej: Punto de cierre"
				/>
			</div>
			<div class="flex gap-3 justify-end mt-6">
				<NyrButton @click="onCancelAgregar" variant="secondary">
					Cancelar
				</NyrButton>
				<NyrButton @click="onConfirmAgregar">
					<NyrIcon icon="plus" size="sm" class="mr-2" />
					Agregar
				</NyrButton>
			</div>
		</div>
	</NyrModal>

	<!-- Delete Confirmation Modal -->
	<NyrModal v-model="showDeleteModal" size="sm">
		<div class="p-6">
			<h3 class="text-lg font-semibold text-charcoal mb-3">Confirmar eliminacion</h3>
			<p class="text-gray-600 mb-6">¿Estas seguro que deseas eliminar este indicador?</p>
			<div class="flex gap-3 justify-end">
				<NyrButton @click="onCancelDelete" variant="secondary">
					Cancelar
				</NyrButton>
				<NyrButton @click="onConfirmDelete" class="bg-red-500 hover:bg-red-600">
					<NyrIcon icon="trash" size="sm" class="mr-2" />
					Eliminar
				</NyrButton>
			</div>
		</div>
	</NyrModal>
</template>

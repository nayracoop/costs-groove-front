<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const headers = [
	{ text: 'Indicador', class: '' },
	{ text: 'Agregar al tablero', class: 'text-center' },
]

const filterText = ref('')
const showAddModal = ref(false)
const newIndicadorForm = ref({
	nombre: ''
})

const rows = ref([
	[
		{ text: 'Punto de cierre', class: '', editable: true },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true }
	],
	[
		{ text: 'Punto de equilibrio', class: '', editable: true },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true }
	],
	[
		{ text: 'Margen de contribucion', class: '', editable: true },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true }
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
		{ component: 'tablero-checkbox', class: 'text-center', checked: true }
	])

	showAddModal.value = false
	resetAddForm()
}

function onToggleTablero(cell, checked) {
	cell.checked = checked
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
				<template #cell-tablero-checkbox="{ cell }">
					<input
						type="checkbox"
						:checked="cell.checked"
						class="h-4 w-4 accent-black"
						aria-label="Agregar al tablero"
						@change="onToggleTablero(cell, $event.target.checked)"
					/>
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

</template>

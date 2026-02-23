<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const headers = [
	{ text: 'Insumo', class: '' },
	{ text: 'Tipo', class: '' },
	{ text: 'Un. Medida', class: '' },
	{ text: 'Rubro', class: '' },
	{ text: 'Agregar al tablero', class: 'text-center' },
	{ text: '', class: 'w-16 text-center' }
]

const tipoOptions = [
	{ key: 'adquirido', value: 'Adquirido' },
	{ key: 'intermedio', value: 'Intermedio' }
]

const unidadOptions = [
	{ key: '', value: '—' },
	{ key: 'kilogramos', value: 'Kilogramos' },
	{ key: 'litros', value: 'Litros' },
	{ key: 'unidad', value: 'Unidad' }
]

const rubroOptions = [
	{ key: '', value: '—' },
	{ key: 'materia-prima', value: 'Materia prima' },
	{ key: 'envase', value: 'Envase' },
	{ key: 'packaging', value: 'Packaging' },
	{ key: 'logistica', value: 'Logística' }
]

const filterText = ref('')

const showDeleteModal = ref(false)
const showAddModal = ref(false)
const rowToDelete = ref(null)
const newInsumoForm = ref({
	nombre: '',
	tipo: '',
	unidad: '',
	rubro: ''
})

const rows = ref([
	[
		{ text: 'Uva Malbec', class: '', editable: true },
		{ text: 'Adquirido', value: 'adquirido', class: '', editable: true, options: tipoOptions },
		{ text: 'Kilogramos', value: 'kilogramos', class: '', editable: true, options: unidadOptions },
		{ text: 'Materia prima', value: 'materia-prima', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Uva Cabernet Franc', class: '', editable: true },
		{ text: 'Adquirido', value: 'adquirido', class: '', editable: true, options: tipoOptions },
		{ text: 'Kilogramos', value: 'kilogramos', class: '', editable: true, options: unidadOptions },
		{ text: 'Materia prima', value: 'materia-prima', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Botella 750 ml', class: '', editable: true },
		{ text: 'Adquirido', value: 'adquirido', class: '', editable: true, options: tipoOptions },
		{ text: 'Unidad', value: 'unidad', class: '', editable: true, options: unidadOptions },
		{ text: 'Envase', value: 'envase', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Botella 375 ml', class: '', editable: true },
		{ text: 'Adquirido', value: 'adquirido', class: '', editable: true, options: tipoOptions },
		{ text: 'Unidad', value: 'unidad', class: '', editable: true, options: unidadOptions },
		{ text: 'Envase', value: 'envase', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Etiqueta', class: '', editable: true },
		{ text: 'Adquirido', value: 'adquirido', class: '', editable: true, options: tipoOptions },
		{ text: 'Unidad', value: 'unidad', class: '', editable: true, options: unidadOptions },
		{ text: 'Envase', value: 'envase', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Mosto (Malbec)', class: '', editable: true },
		{ text: 'Intermedio', value: 'intermedio', class: '', editable: true, options: tipoOptions },
		{ text: 'Litros', value: 'litros', class: '', editable: true, options: unidadOptions },
		{ text: 'Materia prima', value: 'materia-prima', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Mosto (Cabernet Franc)', class: '', editable: true },
		{ text: 'Intermedio', value: 'intermedio', class: '', editable: true, options: tipoOptions },
		{ text: 'Litros', value: 'litros', class: '', editable: true, options: unidadOptions },
		{ text: 'Materia prima', value: 'materia-prima', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Estuche', class: '', editable: true },
		{ text: 'Adquirido', value: 'adquirido', class: '', editable: true, options: tipoOptions },
		{ text: '', value: '', class: '', editable: true, options: unidadOptions },
		{ text: 'Packaging', value: 'packaging', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Caja', class: '', editable: true },
		{ text: 'Adquirido', value: 'adquirido', class: '', editable: true, options: tipoOptions },
		{ text: '', value: '', class: '', editable: true, options: unidadOptions },
		{ text: 'Packaging', value: 'packaging', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Flete x caja', class: '', editable: true },
		{ text: 'Adquirido', value: 'adquirido', class: '', editable: true, options: tipoOptions },
		{ text: '', value: '', class: '', editable: true, options: unidadOptions },
		{ text: 'Logística', value: 'logistica', class: '', editable: true, options: rubroOptions },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	]
])

function onCellEdited(event) {
	const { rowIndex, colIndex, newValue } = event
	const cell = rows.value[rowIndex][colIndex]

	if (Array.isArray(cell.options)) {
		const match = cell.options.find((option) => option.key === newValue)
		cell.value = newValue
		cell.text = match ? match.value : ''
	} else {
		cell.text = newValue
	}
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
	newInsumoForm.value = {
		nombre: '',
		tipo: '',
		unidad: '',
		rubro: ''
	}
}

function onCancelAgregar() {
	showAddModal.value = false
	resetAddForm()
}

function onConfirmAgregar() {
	const tipoOption = tipoOptions.find((option) => option.key === newInsumoForm.value.tipo)
	const unidadOption = unidadOptions.find((option) => option.key === newInsumoForm.value.unidad)
	const rubroOption = rubroOptions.find((option) => option.key === newInsumoForm.value.rubro)

	rows.value.unshift([
		{ text: newInsumoForm.value.nombre || '—', class: '', editable: true },
		{
			text: tipoOption ? tipoOption.value : '—',
			value: newInsumoForm.value.tipo,
			class: '',
			editable: true,
			options: tipoOptions
		},
		{
			text: unidadOption ? unidadOption.value : '—',
			value: newInsumoForm.value.unidad,
			class: '',
			editable: true,
			options: unidadOptions
		},
		{
			text: rubroOption ? rubroOption.value : '—',
			value: newInsumoForm.value.rubro,
			class: '',
			editable: true,
			options: rubroOptions
		},
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
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

function onToggleTablero(cell, checked) {
	cell.checked = checked
}
</script>

<template>
	<div class="p-8">
		<div class="bg-white rounded-lg shadow-sm p-6">
					<h1 class="text-2xl font-semibold text-charcoal mb-6">Tabla de Insumos</h1>
					
					<!-- Filter Section -->
					<div class="mb-6 max-w-xs">
						<NyrInput
							v-model="filterText"
							label="Buscar insumo"
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

<!-- Add Insumo Modal -->
<NyrModal v-model="showAddModal" size="md">
	<div class="p-6">
		<h3 class="text-lg font-semibold text-charcoal mb-6">Nuevo Insumo</h3>
		<div class="space-y-4">
			<NyrInput
				v-model="newInsumoForm.nombre"
				label="Insumo"
				placeholder="Ej: Uva Malbec"
			/>
			<div class="grid grid-cols-2 gap-4">
				<NyrSelect
					v-model="newInsumoForm.tipo"
					label="Tipo"
					:options="tipoOptions"
				/>
				<NyrSelect
					v-model="newInsumoForm.unidad"
					label="Un. Medida"
					:options="unidadOptions"
				/>
			</div>
			<NyrSelect
				v-model="newInsumoForm.rubro"
				label="Rubro"
				:options="rubroOptions"
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
		<h3 class="text-lg font-semibold text-charcoal mb-3">Confirmar eliminación</h3>
		<p class="text-gray-600 mb-6">¿Estás seguro que deseas eliminar este insumo?</p>
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

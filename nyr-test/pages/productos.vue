<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const headers = [
	{ text: 'Producto', class: '' },
	{ text: 'Un. Medida', class: '' },
	{ text: 'Categoría', class: '' },
	{ text: 'Unidades', class: 'text-right' },
	{ text: 'Litros', class: 'text-right' },
	{ text: 'Agregar al tablero', class: 'text-center' },
	{ text: '', class: 'w-16 text-center' }
]

const categoriaOptions = [
	{ key: 'produccion-propia', value: 'Producción Propia' },
	{ key: 'produccion-3ros', value: 'Producción 3ros' }
]

const unidadOptions = [
	{ key: '', value: '—' },
	{ key: 'unidades', value: 'Unidades' },
	{ key: 'kilogramos', value: 'Kilogramos' },
	{ key: 'litros', value: 'Litros' }
]

const filterText = ref('')
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const rowToDelete = ref(null)
const newProductoForm = ref({
	nombre: '',
	unidad: '',
	categoria: '',
	unidades: '',
	litros: ''
})

const rows = ref([
	[
		{ text: 'SOMBRERO MALBEC 750 ML', class: '', editable: true },
		{ text: 'Unidades', value: 'unidades', class: '', editable: true, options: unidadOptions },
		{ text: 'Producción Propia', value: 'produccion-propia', class: '', editable: true, options: categoriaOptions },
		{ text: '1,000', class: 'text-right', editable: true },
		{ text: '0,750', class: 'text-right', editable: true },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'SOMBRERO CABERNET FRANC 750 ML', class: '', editable: true },
		{ text: 'Unidades', value: 'unidades', class: '', editable: true, options: unidadOptions },
		{ text: 'Producción Propia', value: 'produccion-propia', class: '', editable: true, options: categoriaOptions },
		{ text: '1,000', class: 'text-right', editable: true },
		{ text: '0,750', class: 'text-right', editable: true },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'SOMBRERO CHARDONNAY 750 ML', class: '', editable: true },
		{ text: 'Unidades', value: 'unidades', class: '', editable: true, options: unidadOptions },
		{ text: 'Producción 3ros', value: 'produccion-3ros', class: '', editable: true, options: categoriaOptions },
		{ text: '1,000', class: 'text-right', editable: true },
		{ text: '0,750', class: 'text-right', editable: true },
		{ component: 'tablero-checkbox', class: 'text-center', checked: true },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'SOMBRERO MALBEC 375 ML', class: '', editable: true },
		{ text: 'Unidades', value: 'unidades', class: '', editable: true, options: unidadOptions },
		{ text: 'Producción Propia', value: 'produccion-propia', class: '', editable: true, options: categoriaOptions },
		{ text: '1,000', class: 'text-right', editable: true },
		{ text: '0,375', class: 'text-right', editable: true },
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
	newProductoForm.value = {
		nombre: '',
		unidad: '',
		categoria: '',
		unidades: '',
		litros: ''
	}
}

function onCancelAgregar() {
	showAddModal.value = false
	resetAddForm()
}

function onConfirmAgregar() {
	const unidadOption = unidadOptions.find((option) => option.key === newProductoForm.value.unidad)
	const categoriaOption = categoriaOptions.find((option) => option.key === newProductoForm.value.categoria)

	rows.value.unshift([
		{ text: newProductoForm.value.nombre || '—', class: '', editable: true },
		{
			text: unidadOption ? unidadOption.value : '—',
			value: newProductoForm.value.unidad,
			class: '',
			editable: true,
			options: unidadOptions
		},
		{
			text: categoriaOption ? categoriaOption.value : '—',
			value: newProductoForm.value.categoria,
			class: '',
			editable: true,
			options: categoriaOptions
		},
		{ text: newProductoForm.value.unidades || '—', class: 'text-right', editable: true },
		{ text: newProductoForm.value.litros || '—', class: 'text-right', editable: true },
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
					<h1 class="text-2xl font-semibold text-charcoal mb-6">Tabla de Productos</h1>
					
					<!-- Filter Section -->
					<div class="mb-6 max-w-xs">
						<NyrInput
							v-model="filterText"
							label="Buscar producto"
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
						:limit="10"
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

<!-- Add Producto Modal -->
<NyrModal v-model="showAddModal" size="md">
	<div class="p-6">
		<h3 class="text-lg font-semibold text-charcoal mb-6">Nuevo Producto</h3>
		<div class="space-y-4">
			<NyrInput
				v-model="newProductoForm.nombre"
				label="Producto"
				placeholder="Ej: Sombrero Malbec 750 ML"
			/>
			<div class="grid grid-cols-2 gap-4">
				<NyrSelect
					v-model="newProductoForm.unidad"
					label="Un. Medida"
					:options="unidadOptions"
				/>
				<NyrSelect
					v-model="newProductoForm.categoria"
					label="Categoría"
					:options="categoriaOptions"
				/>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<NyrInput
					v-model="newProductoForm.unidades"
					label="Unidades"
					placeholder="Ej: 1,000"
				/>
				<NyrInput
					v-model="newProductoForm.litros"
					label="Litros"
					placeholder="Ej: 0,750"
				/>
			</div>
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
		<p class="text-gray-600 mb-6">¿Estás seguro que deseas eliminar este producto?</p>
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

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const headers = [
	{ text: 'Punto de Venta', class: '' },
	{ text: 'Ubicación', class: '' },
	{ text: 'Estado', class: 'text-center' },
	{ text: '', class: 'w-16 text-center' }
]

const ubicacionOptions = [
	{ key: 'mendoza', value: 'Mendoza' },
	{ key: 'caba', value: 'CABA' },
	{ key: 'cordoba', value: 'Córdoba' },
	{ key: 'buenos-aires', value: 'Buenos Aires' }
]

const estadoOptions = [
	{ key: 'activo', value: 'Activo' },
	{ key: 'inactivo', value: 'Inactivo' }
]

const filterText = ref('')
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const rowToDelete = ref(null)
const newPuntoVentaForm = ref({
	nombre: '',
	ubicacion: '',
	estado: ''
})

const rows = ref([
	[
		{ text: 'Salón', class: 'font-medium', editable: true },
		{ text: 'Mendoza', value: 'mendoza', class: '', editable: true, options: ubicacionOptions },
		{ text: 'Activo', value: 'activo', class: 'text-green-600 font-semibold', editable: true, options: estadoOptions },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Retail MDZ', class: 'font-medium', editable: true },
		{ text: 'Mendoza', value: 'mendoza', class: '', editable: true, options: ubicacionOptions },
		{ text: 'Activo', value: 'activo', class: 'text-green-600 font-semibold', editable: true, options: estadoOptions },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Retail CABA', class: 'font-medium', editable: true },
		{ text: 'CABA', value: 'caba', class: '', editable: true, options: ubicacionOptions },
		{ text: 'Activo', value: 'activo', class: 'text-green-600 font-semibold', editable: true, options: estadoOptions },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Outlet Córdoba', class: 'font-medium', editable: true },
		{ text: 'Córdoba', value: 'cordoba', class: '', editable: true, options: ubicacionOptions },
		{ text: 'Activo', value: 'activo', class: 'text-green-600 font-semibold', editable: true, options: estadoOptions },
		{ component: 'delete-button', class: 'text-center' }
	],
	[
		{ text: 'Distribuidora BA', class: 'font-medium', editable: true },
		{ text: 'Buenos Aires', value: 'buenos-aires', class: '', editable: true, options: ubicacionOptions },
		{ text: 'Inactivo', value: 'inactivo', class: 'text-gray-400 font-semibold', editable: true, options: estadoOptions },
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
	newPuntoVentaForm.value = {
		nombre: '',
		ubicacion: '',
		estado: ''
	}
}

function onCancelAgregar() {
	showAddModal.value = false
	resetAddForm()
}

function onConfirmAgregar() {
	const ubicacionOption = ubicacionOptions.find((option) => option.key === newPuntoVentaForm.value.ubicacion)
	const estadoOption = estadoOptions.find((option) => option.key === newPuntoVentaForm.value.estado)
	const estadoClass = newPuntoVentaForm.value.estado === 'activo' ? 'text-green-600 font-semibold' : 'text-gray-400 font-semibold'

	rows.value.unshift([
		{ text: newPuntoVentaForm.value.nombre || '—', class: 'font-medium', editable: true },
		{
			text: ubicacionOption ? ubicacionOption.value : '—',
			value: newPuntoVentaForm.value.ubicacion,
			class: '',
			editable: true,
			options: ubicacionOptions
		},
		{
			text: estadoOption ? estadoOption.value : '—',
			value: newPuntoVentaForm.value.estado,
			class: estadoClass,
			editable: true,
			options: estadoOptions
		},
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
	<div class="flex h-screen overflow-hidden">
		<Menu />
		<main class="flex-1 bg-cream overflow-y-auto">
			<div class="p-8">
				<div class="bg-white rounded-lg shadow-sm p-6">
					<h1 class="text-2xl font-semibold text-charcoal mb-6">Puntos de Venta</h1>
					
					<!-- Filter Section -->
					<div class="mb-6 max-w-xs">
						<NyrInput
							v-model="filterText"
							label="Buscar punto de venta"
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
		</main>

		<!-- Add Punto de Venta Modal -->
		<NyrModal v-model="showAddModal" size="md">
			<div class="p-6">
				<h3 class="text-lg font-semibold text-charcoal mb-6">Nuevo Punto de Venta</h3>
				<div class="space-y-4">
					<NyrInput
						v-model="newPuntoVentaForm.nombre"
						label="Punto de Venta"
						placeholder="Ej: Retail CABA"
					/>
					<div class="grid grid-cols-2 gap-4">
						<NyrSelect
							v-model="newPuntoVentaForm.ubicacion"
							label="Ubicación"
							:options="ubicacionOptions"
						/>
						<NyrSelect
							v-model="newPuntoVentaForm.estado"
							label="Estado"
							:options="estadoOptions"
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
				<p class="text-gray-600 mb-6">¿Estás seguro que deseas eliminar este punto de venta?</p>
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
	</div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const headers = [
	{ text: 'Concepto', class: '' },
	{ text: 'Rubro', class: '' },
	{ text: 'Erogable / No', class: '' },
	{ text: 'Moneda', class: '' },
	{ text: 'Importe', class: '' },
	{ text: 'Comentarios', class: '' },
	{ text: 'Agragar al tablero', class: 'text-center' },
	{ text: '', class: 'w-16 text-center' }
]

const rubroOptions = [
	{ key: 'salario', value: 'Salario' },
	{ key: 'alquiler', value: 'Alquiler' },
	{ key: 'servicios', value: 'Servicios' },
	{ key: 'mantenimiento', value: 'Mantenimiento' },
	{ key: 'amortizaciones', value: 'Amortizaciones' },
	{ key: 'logistica', value: 'Logistica' },
	{ key: 'otros', value: 'Otros' }
]

const erogableOptions = [
	{ key: 'erogable', value: 'Erogable' },
	{ key: 'no-erogable', value: 'No Erogable' }
]

const monedaOptions = [
	{ key: 'ars', value: 'ARS' },
	{ key: 'usd', value: 'USD' }
]

const filterText = ref('')
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const rowToDelete = ref(null)
const newCostoForm = ref({
	concepto: '',
	rubro: '',
	erogable: '',
	moneda: 'ars',
	importe: '',
	comentarios: ''
})

function getOptionText(options, key) {
	const match = options.find((option) => option.key === key)
	return match ? match.value : '—'
}

function makeRow({
	concepto,
	rubroKey,
	erogableKey,
	monedaKey,
	importe,
	comentarios,
	agregarTablero = true
}) {
	return [
		{ text: concepto, class: '', editable: true },
		{
			text: getOptionText(rubroOptions, rubroKey),
			value: rubroKey,
			class: '',
			editable: true,
			options: rubroOptions
		},
		{
			text: getOptionText(erogableOptions, erogableKey),
			value: erogableKey,
			class: '',
			editable: true,
			options: erogableOptions
		},
		{
			text: getOptionText(monedaOptions, monedaKey),
			value: monedaKey,
			class: '',
			editable: true,
			options: monedaOptions
		},
		{ text: importe || '', class: '', editable: true },
		{ text: comentarios || '', class: '', editable: true },
		{ component: 'tablero-checkbox', class: 'text-center', checked: agregarTablero },
		{ component: 'delete-button', class: 'text-center' }
	]
}

const rows = ref([
	makeRow({
		concepto: 'Sueldo 1',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '420000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 2',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '430000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Articulos de limpieza',
		rubroKey: 'otros',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '35000',
		comentarios: 'Insumos planta'
	}),
	makeRow({
		concepto: 'Retiro Dueña/o',
		rubroKey: 'otros',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '250000',
		comentarios: 'Retiro socios'
	}),
	makeRow({
		concepto: 'Sueldo 3',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '415000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 4',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '410000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Medicina laboral',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '28000',
		comentarios: 'Servicio externo'
	}),
	makeRow({
		concepto: 'Contadores',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '65000',
		comentarios: 'Honorarios'
	}),
	makeRow({
		concepto: 'Seguros',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '52000',
		comentarios: 'Poliza anual prorrateada'
	}),
	makeRow({
		concepto: 'Aysa',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '18000',
		comentarios: 'Servicio mensual'
	}),
	makeRow({
		concepto: 'Gas',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '22000',
		comentarios: 'Servicio mensual'
	}),
	makeRow({
		concepto: 'Edenor',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '26000',
		comentarios: 'Servicio mensual'
	}),
	makeRow({
		concepto: 'Inmobiliario',
		rubroKey: 'alquiler',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '90000',
		comentarios: 'Alquiler deposito'
	}),
	makeRow({
		concepto: 'Telecentro',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '24000',
		comentarios: 'Servicio mensual'
	}),
	makeRow({
		concepto: 'Fumigacion',
		rubroKey: 'mantenimiento',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '15000',
		comentarios: 'Mantenimiento mensual'
	}),
	makeRow({
		concepto: 'Vittal',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '21000',
		comentarios: 'Abono mensual'
	}),
	makeRow({
		concepto: 'Seguridad',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '120000',
		comentarios: 'Servicio 24x7'
	}),
	makeRow({
		concepto: 'Seguridad e Higiene',
		rubroKey: 'servicios',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '38000',
		comentarios: 'Auditoria trimestral'
	}),
	makeRow({
		concepto: 'Sueldo 5',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '405000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 6',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '400000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 7',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '398000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 8',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '402000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 9',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '410000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 10',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '415000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 11',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '420000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Servicio Mant. Maquinaria',
		rubroKey: 'mantenimiento',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '75000',
		comentarios: 'Preventivo'
	}),
	makeRow({
		concepto: 'Sueldo 12',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '425000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 13',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '430000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Suedlo 14',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '410000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 15',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '420000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 16',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '415000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 17',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '418000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 18',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '422000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 19',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '427000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 20',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '432000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 21',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '437000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 22',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '440000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 23',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '442000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 24',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '445000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Peajes',
		rubroKey: 'logistica',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '18000',
		comentarios: 'Rutas'
	}),
	makeRow({
		concepto: 'Patentes',
		rubroKey: 'logistica',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '30000',
		comentarios: 'Anual prorrateado'
	}),
	makeRow({
		concepto: 'Mantenimiento rodados',
		rubroKey: 'mantenimiento',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '55000',
		comentarios: 'Taller'
	}),
	makeRow({
		concepto: 'Sueldo 25',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '448000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 26',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '452000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Sueldo 27',
		rubroKey: 'salario',
		erogableKey: 'erogable',
		monedaKey: 'ars',
		importe: '455000',
		comentarios: 'Mensual'
	}),
	makeRow({
		concepto: 'Amortizaciones',
		rubroKey: 'amortizaciones',
		erogableKey: 'no-erogable',
		monedaKey: 'ars',
		importe: '120000',
		comentarios: 'No erogable'
	}),
	makeRow({
		concepto: 'Amortizaciones',
		rubroKey: 'amortizaciones',
		erogableKey: 'no-erogable',
		monedaKey: 'ars',
		importe: '120000',
		comentarios: 'No erogable'
	}),
	makeRow({
		concepto: 'Amortizaciones',
		rubroKey: 'amortizaciones',
		erogableKey: 'no-erogable',
		monedaKey: 'ars',
		importe: '120000',
		comentarios: 'No erogable'
	})
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
	newCostoForm.value = {
		concepto: '',
		rubro: '',
		erogable: '',
		moneda: 'ars',
		importe: '',
		comentarios: ''
	}
}

function onCancelAgregar() {
	showAddModal.value = false
	resetAddForm()
}

function onConfirmAgregar() {
	rows.value.unshift(
		makeRow({
			concepto: newCostoForm.value.concepto || '—',
			rubroKey: newCostoForm.value.rubro,
			erogableKey: newCostoForm.value.erogable,
			monedaKey: newCostoForm.value.moneda,
			importe: newCostoForm.value.importe,
			comentarios: newCostoForm.value.comentarios
		})
	)

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
			<h1 class="text-2xl font-semibold text-charcoal mb-6">Tabla de Costos fijos</h1>

			<!-- Filter Section -->
			<div class="mb-6 max-w-xs">
				<NyrInput
					v-model="filterText"
					label="Buscar concepto"
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

	<!-- Add Costo Fijo Modal -->
	<NyrModal v-model="showAddModal" size="md">
		<div class="p-6">
			<h3 class="text-lg font-semibold text-charcoal mb-6">Nuevo Costo Fijo</h3>
			<div class="space-y-4">
				<NyrInput
					v-model="newCostoForm.concepto"
					label="Concepto"
					placeholder="Ej: Sueldo 1"
				/>
				<div class="grid grid-cols-2 gap-4">
					<NyrSelect
						v-model="newCostoForm.rubro"
						label="Rubro"
						:options="rubroOptions"
					/>
					<NyrSelect
						v-model="newCostoForm.erogable"
						label="Erogable / No"
						:options="erogableOptions"
					/>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<NyrSelect
						v-model="newCostoForm.moneda"
						label="Moneda"
						:options="monedaOptions"
					/>
					<NyrInput
						v-model="newCostoForm.importe"
						label="Importe"
						placeholder="0"
					/>
				</div>
				<NyrInput
					v-model="newCostoForm.comentarios"
					label="Comentarios"
					placeholder="Notas"
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
			<p class="text-gray-600 mb-6">¿Estas seguro que deseas eliminar este costo fijo?</p>
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

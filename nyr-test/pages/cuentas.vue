<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const headers = [
	{ text: '', class: 'w-12 text-center' },
	{ text: 'Cuenta', class: '' },
	{ text: 'Usuarios', class: '' },
	{ text: 'Plan', class: '' },
	{ text: 'Estado', class: 'text-center' },
	{ text: 'Fecha ingreso', class: '' },
	{ text: 'Estado cuenta', class: '' },
	{ text: 'Archivar', class: 'w-16 text-center' },
	{ text: 'Usar cuenta', class: 'w-16 text-center' }
]

const planOptions = [
	{ key: 'basico', value: 'Basico' },
	{ key: 'full', value: 'Full' }
]

const estadoOptions = [
	{ key: 'activo', value: 'Activo' },
	{ key: 'inactivo', value: 'Inactivo' }
]

const estadoCuentaOptions = [
	{ key: 'al-dia', value: 'Al día' },
	{ key: 'con-deuda', value: 'Con deuda' }
]

const filterText = ref('')
const showAddModal = ref(false)
const showArchiveModal = ref(false)
const accountToArchive = ref(null)
const newAccountForm = ref({
	nombre: '',
	plan: '',
	userNombre: '',
	userEmail: '',
	pass: '',
	contacto: '',
	notas: ''
})

const rows = ref([
	[
		{ text: 'Activo', class: 'badge badge-admin-viewing', component: 'admin-badge' },
		{ text: 'Viñedos "El amanecer"', class: 'font-medium' },
		{ usuarios: ['Juan Perez', 'Maria Garcia'], class: '', component: 'usuarios-cell' },
		{ text: 'Full', value: 'full', class: 'badge badge-full', options: planOptions },
		{ text: 'Activo', value: 'activo', class: 'text-green-600 font-semibold', options: estadoOptions },
		{ text: '15/01/2026', class: '' },
		{ text: 'Al día', value: 'al-dia', class: 'badge badge-al-dia', component: 'estadoCuenta' },
		{ component: 'archive-button', class: 'text-center' },
		{ component: 'ver-button', class: 'text-center' }
	],
	[
		{ text: '', class: '' },
		{ text: 'Galletacoop', class: 'font-medium' },
		{ usuarios: ['Carlos Lopez'], class: '', component: 'usuarios-cell' },
		{ text: 'Basico', value: 'basico', class: 'badge badge-basico', options: planOptions },
		{ text: 'Activo', value: 'activo', class: 'text-green-600 font-semibold', options: estadoOptions },
		{ text: '22/12/2025', class: '' },
		{ text: 'Con deuda', value: 'con-deuda', class: 'badge badge-con-deuda', component: 'estadoCuenta' },
		{ component: 'archive-button', class: 'text-center' },
		{ component: 'ver-button', class: 'text-center' }
	],
	[
		{ text: '', class: '' },
		{ text: 'Indumentaria Diseño', class: 'font-medium' },
		{ usuarios: ['Ana Rodriguez', 'Fernando Silva', 'Señorita Nayra'], class: '', component: 'usuarios-cell' },
		{ text: 'Full', value: 'full', class: 'badge badge-full', options: planOptions },
		{ text: 'Inactivo', value: 'inactivo', class: 'text-gray-400 font-semibold', options: estadoOptions },
		{ text: '08/11/2025', class: '' },
		{ text: 'Al día', value: 'al-dia', class: 'badge badge-al-dia', component: 'estadoCuenta' },
		{ component: 'archive-button', class: 'text-center' },
		{ component: 'ver-button', class: 'text-center' }
	]
])

function onCellEdited(event) {
	const { rowIndex, colIndex, newValue } = event
	const cell = rows.value[rowIndex][colIndex]

	if (Array.isArray(cell.options)) {
		const match = cell.options.find((option) => option.key === newValue)
		cell.value = newValue
		cell.text = match ? match.value : ''
		
		// Update badge class for plan (column 3)
		if (colIndex === 3) {
			cell.class = `badge badge-${newValue}`
		}
		// Update color class for estado (column 4)
		if (colIndex === 4) {
			cell.class = newValue === 'activo' ? 'text-green-600 font-semibold' : 'text-gray-400 font-semibold'
		}
	} else {
		cell.text = newValue
	}
}


function onSave() {
	console.log('Save clicked')
}

function onAgregar() {
	showAddModal.value = true
}

function resetAddForm() {
	newAccountForm.value = {
		nombre: '',
		plan: '',
		userNombre: '',
		userEmail: '',
		pass: '',
		contacto: '',
		notas: ''
	}
}

function onCancelAgregar() {
	showAddModal.value = false
	resetAddForm()
}

function onConfirmAgregar() {
	const planOption = planOptions.find((option) => option.key === newAccountForm.value.plan)
	const planClass = `badge badge-${newAccountForm.value.plan}`

	rows.value.unshift([
		{ text: '', class: '' },
		{ text: newAccountForm.value.nombre || '—', class: 'font-medium' },
		{ usuarios: [newAccountForm.value.userNombre] || [], class: '', component: 'usuarios-cell' },
		{
			text: planOption ? planOption.value : '—',
			value: newAccountForm.value.plan,
			class: planClass,
			options: planOptions
		},
		{
			text: 'Activo',
			value: 'activo',
			class: 'text-green-600 font-semibold',
			options: estadoOptions
		},
		{ text: new Date().toLocaleDateString('es-AR'), class: '' },
		{
			text: 'Al día',
			value: 'al-dia',
			class: 'badge badge-al-dia',
			component: 'estadoCuenta'
		},
		{ component: 'archive-button', class: 'text-center' },
		{ component: 'ver-button', class: 'text-center' }
	])

	showAddModal.value = false
	resetAddForm()
}

function onArchiveClick(rowIndex) {
	accountToArchive.value = rows.value[rowIndex][1].text
	showArchiveModal.value = true
}

function onConfirmArchive() {
	showArchiveModal.value = false
	accountToArchive.value = null
}

function onCancelArchive() {
	showArchiveModal.value = false
	accountToArchive.value = null
}

function onVerClick(rowIndex) {
	console.log('Ver detalles:', rows.value[rowIndex][1].text)
}
</script>

<template>
	<div class="p-8">
		<div class="bg-white rounded-lg shadow-sm p-6">
			<h1 class="text-2xl font-semibold text-charcoal mb-6">Cuentas</h1>
			
			<!-- Filter Section -->
			<div class="mb-6 max-w-xs">
				<NyrInput
					v-model="filterText"
					label="Buscar cuenta"
					placeholder="Escribe para filtrar..."
				/>
			</div>

			<!-- Action Buttons -->
			<div class="mb-6 flex gap-3">
				<NyrButton @click="onAgregar">
					<NyrIcon icon="plus" size="sm" class="mr-2" />
					Nueva Cuenta
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
				<template #cell-usuarios-cell="{ cell }">
					<div class="flex flex-wrap gap-2">
						<span
							v-for="usuario in cell.usuarios"
							:key="usuario"
							class="usuario-badge"
						>
							{{ usuario }}
						</span>
					</div>
				</template>

				<template #cell-estadoCuenta="{ cell }">
					<span :class="['badge', `badge-${cell.value}`]">
						{{ cell.text }}
					</span>
				</template>

				<template #cell-admin-badge="{ cell }">
					<span v-if="cell.text" class="badge badge-admin-viewing">
						<NyrIcon icon="eye" size="sm"></NyrIcon>
					</span>
				</template>

				<template #cell-archive-button="{ rowIndex }">
					<button
						@click="onArchiveClick(rowIndex)"
						class="text-orange-500 hover:text-orange-700 transition-colors p-2"
						title="Archivar cuenta"
					>
						<NyrIcon icon="archive" size="sm" />
					</button>
				</template>

				<template #cell-ver-button="{ rowIndex }">
					<button
						@click="onVerClick(rowIndex)"
						class="text-blue-500 hover:text-blue-700 transition-colors p-2"
						title="Ver detalles"
					>
						<NyrIcon icon="chevron-right" size="sm" />
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

	<!-- Add Account Modal -->
	<NyrModal v-model="showAddModal" size="md">
		<div class="p-6">
			<h3 class="text-lg font-semibold text-charcoal mb-6">Nueva Cuenta</h3>
			<div class="space-y-4">
				<NyrInput
					v-model="newAccountForm.nombre"
					label="Nombre"
					placeholder="Ej: Bodega San Jose"
				/>
				<div class="grid grid-cols-2 gap-4">
					<NyrSelect
						v-model="newAccountForm.plan"
						label="Plan"
						:options="planOptions"
					/>
					<NyrInput
						v-model="newAccountForm.userEmail"
						label="E-mail"
						placeholder="usuario@bodega.com"
					/>
				</div>
				<NyrInput
					v-model="newAccountForm.userNombre"
					label="Nombre del Usuario"
					placeholder="Juan Perez"
				/>
				<NyrInput
					v-model="newAccountForm.pass"
					label="Contrasena"
					placeholder="••••••••"
					:type="'password'"
				/>
				<NyrInput
					v-model="newAccountForm.contacto"
					label="Contacto (Telefono)"
					placeholder="+54 9 261 123 4567"
				/>
				<div>
					<label class="block text-sm font-medium text-charcoal mb-2">Notas</label>
					<textarea
						v-model="newAccountForm.notas"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
						placeholder="Informacion adicional..."
						rows="3"
					></textarea>
				</div>
			</div>
			<div class="flex gap-3 justify-end mt-6">
				<NyrButton @click="onCancelAgregar" variant="secondary">
					Cancelar
				</NyrButton>
				<NyrButton @click="onConfirmAgregar">
					<NyrIcon icon="plus" size="sm" class="mr-2" />
					Crear Cuenta
				</NyrButton>
			</div>
		</div>
	</NyrModal>

	<!-- Archive Confirmation Modal -->
	<NyrModal v-model="showArchiveModal" size="sm">
		<div class="p-6">
			<h3 class="text-lg font-semibold text-charcoal mb-3">Archivar cuenta</h3>
			<p class="text-gray-600 mb-6">¿Deseas archivar la cuenta <strong>{{ accountToArchive }}</strong>? Los datos seguiran disponibles en el archivo.</p>
			<div class="flex gap-3 justify-end">
				<NyrButton @click="onCancelArchive" variant="secondary">
					Cancelar
				</NyrButton>
				<NyrButton @click="onConfirmArchive" class="bg-orange-500 hover:bg-orange-600">
					<NyrIcon icon="archive" size="sm" class="mr-2" />
					Archivar
				</NyrButton>
			</div>
		</div>
	</NyrModal>
</template>

<style scoped>
.badge {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 600;
}

.badge-full {
	background-color: #dbeafe;
	color: #1e40af;
}

.badge-basico {
	background-color: #fef3c7;
	color: #92400e;
}

.usuario-badge {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 16px;
	font-size: 12px;
	font-weight: 500;
	background-color: #e0e7ff;
	color: #3730a3;
}

.badge-al-dia {
	background-color: #dcfce7;
	color: #166534;
}

.badge-con-deuda {
	background-color: #fee2e2;
	color: #991b1b;
}

.badge-admin-viewing {
	background-color: #dcfce7;
	color: #15803d;
	font-weight: 600;
}
</style>

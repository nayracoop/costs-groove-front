<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const activeEsquema = ref('VENDIMIA_2026')

// Tableros headers
const tableroHeaders = [
	{ text: 'Nombre', class: '' },
	{ text: 'Estado', class: 'text-center' },
	{ text: 'Nodos', class: 'text-right' },
	{ text: 'Modificado', class: '' },
	{ text: 'Acciones', class: 'w-32 text-center' }
]

// Tableros rows
const tableroRows = ref([
	[
		{ text: 'VENDIMIA_2026_A', class: 'font-medium' },
		{ text: 'Activo', class: 'badge badge-success text-center' },
		{ text: '12', class: 'text-right' },
		{ text: '2026-02-05', class: '' },
		{ component: 'tablero-actions', class: 'text-center', id: 1 }
	],
	[
		{ text: 'VENDIMIA_2026_B', class: 'font-medium' },
		{ text: 'Activo', class: 'badge badge-success text-center' },
		{ text: '9', class: 'text-right' },
		{ text: '2026-02-03', class: '' },
		{ component: 'tablero-actions', class: 'text-center', id: 2 }
	]
])

// Diagramas headers
const diagramaHeaders = [
	{ text: 'Nombre', class: '' },
	{ text: 'Estado', class: 'text-center' },
	{ text: 'Elementos', class: 'text-right' },
	{ text: 'Modificado', class: '' },
	{ text: 'Acciones', class: 'w-32 text-center' }
]

// Diagramas rows
const diagramaRows = ref([
	[
		{ text: 'Producción Malbec', class: 'font-medium' },
		{ text: 'Activo', class: 'badge badge-success text-center' },
		{ text: '8', class: 'text-right' },
		{ text: '2026-02-04', class: '' },
		{ component: 'diagrama-actions', class: 'text-center', id: 1 }
	],
	[
		{ text: 'Ensayo Vinos Blancos', class: 'font-medium' },
		{ text: 'Inactivo', class: 'badge badge-secondary text-center' },
		{ text: '5', class: 'text-right' },
		{ text: '2026-01-28', class: '' },
		{ component: 'diagrama-actions', class: 'text-center', id: 2 }
	]
])

// Tableros & Diagramas data
const tableros = ref([
	{ id: 1, name: 'VENDIMIA_2026_A', status: 'activo', nodes: 12, lastModified: '2026-02-05' },
	{ id: 2, name: 'VENDIMIA_2026_B', status: 'activo', nodes: 9, lastModified: '2026-02-03' }
])

const diagramas = ref([
	{ id: 1, name: 'Producción Malbec', status: 'activo', elements: 8, lastModified: '2026-02-04' },
	{ id: 2, name: 'Ensayo Vinos Blancos', status: 'inactivo', elements: 5, lastModified: '2026-01-28' }
])

// Modals state
const showAddTableroModal = ref(false)
const showAddDiagramaModal = ref(false)
const selectedItemToClone = ref(null)
const cloneType = ref(null)
const showCloneModal = ref(false)

// Form data
const newTableroForm = ref({
	nombre: '',
	descripcion: ''
})

const newDiagramaForm = ref({
	nombre: '',
	descripcion: ''
})

const cloneForm = ref({
	nuevoNombre: '',
	copiarContenido: true
})

// Mock statistics
const statistics = ref({
	totalTableros: tableros.value.length,
	totalDiagramas: diagramas.value.length,
	totalNodos: 34,
	completionRate: 78,
	lastSync: '2026-02-05 14:30',
	activeItems: 3
})

function onAddTablero() {
	if (newTableroForm.value.nombre) {
		const newId = Math.max(...tableros.value.map(t => t.id), 0) + 1
		const newTablero = {
			id: newId,
			name: newTableroForm.value.nombre,
			status: 'activo',
			nodes: 0,
			lastModified: new Date().toLocaleDateString('es-AR')
		}
		tableros.value.push(newTablero)
		tableroRows.value.push([
			{ text: newTablero.name, class: 'font-medium' },
			{ text: 'Activo', class: 'badge badge-success text-center' },
			{ text: '0', class: 'text-right' },
			{ text: newTablero.lastModified, class: '' },
			{ component: 'tablero-actions', class: 'text-center', id: newId }
		])
		newTableroForm.value = { nombre: '', descripcion: '' }
		showAddTableroModal.value = false
	}
}

function onAddDiagrama() {
	if (newDiagramaForm.value.nombre) {
		const newId = Math.max(...diagramas.value.map(d => d.id), 0) + 1
		const newDiagrama = {
			id: newId,
			name: newDiagramaForm.value.nombre,
			status: 'activo',
			elements: 0,
			lastModified: new Date().toLocaleDateString('es-AR')
		}
		diagramas.value.push(newDiagrama)
		diagramaRows.value.push([
			{ text: newDiagrama.name, class: 'font-medium' },
			{ text: 'Activo', class: 'badge badge-success text-center' },
			{ text: '0', class: 'text-right' },
			{ text: newDiagrama.lastModified, class: '' },
			{ component: 'diagrama-actions', class: 'text-center', id: newId }
		])
		newDiagramaForm.value = { nombre: '', descripcion: '' }
		showAddDiagramaModal.value = false
	}
}

function onCloneTablero(tablero) {
	selectedItemToClone.value = tablero
	cloneType.value = 'tablero'
	showCloneModal.value = true
}

function onCloneDiagrama(diagrama) {
	selectedItemToClone.value = diagrama
	cloneType.value = 'diagrama'
	showCloneModal.value = true
}

function onConfirmClone() {
	if (cloneForm.value.nuevoNombre && selectedItemToClone.value) {
		if (cloneType.value === 'tablero') {
			const newId = Math.max(...tableros.value.map(t => t.id), 0) + 1
			const newTablero = {
				id: newId,
				name: cloneForm.value.nuevoNombre,
				status: 'activo',
				nodes: cloneForm.value.copiarContenido ? selectedItemToClone.value.nodes : 0,
				lastModified: new Date().toLocaleDateString('es-AR')
			}
			tableros.value.push(newTablero)
			tableroRows.value.push([
				{ text: newTablero.name, class: 'font-medium' },
				{ text: 'Activo', class: 'badge badge-success text-center' },
				{ text: newTablero.nodes.toString(), class: 'text-right' },
				{ text: newTablero.lastModified, class: '' },
				{ component: 'tablero-actions', class: 'text-center', id: newId }
			])
		} else {
			const newId = Math.max(...diagramas.value.map(d => d.id), 0) + 1
			const newDiagrama = {
				id: newId,
				name: cloneForm.value.nuevoNombre,
				status: 'activo',
				elements: cloneForm.value.copiarContenido ? selectedItemToClone.value.elements : 0,
				lastModified: new Date().toLocaleDateString('es-AR')
			}
			diagramas.value.push(newDiagrama)
			diagramaRows.value.push([
				{ text: newDiagrama.name, class: 'font-medium' },
				{ text: 'Activo', class: 'badge badge-success text-center' },
				{ text: newDiagrama.elements.toString(), class: 'text-right' },
				{ text: newDiagrama.lastModified, class: '' },
				{ component: 'diagrama-actions', class: 'text-center', id: newId }
			])
		}
		cloneForm.value = { nuevoNombre: '', copiarContenido: true }
		showCloneModal.value = false
		selectedItemToClone.value = null
	}
}

function onDeleteTablero(id) {
	tableros.value = tableros.value.filter((t) => t.id !== id)
	tableroRows.value = tableroRows.value.filter((row) => row[row.length - 1].id !== id)
}

function onDeleteDiagrama(id) {
	diagramas.value = diagramas.value.filter((d) => d.id !== id)
	diagramaRows.value = diagramaRows.value.filter((row) => row[row.length - 1].id !== id)
}
</script>

<template>
	<div class="p-8">
		<div class="bg-white rounded-lg shadow-sm p-6">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-3xl font-semibold text-charcoal mb-2">{{ activeEsquema }}</h1>
				<p class="text-gray-600">Gestiona los tableros y diagramas de este esquema</p>
			</div>

			<!-- Tableros Section -->
			<div class="mb-12">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold text-charcoal">Tableros</h2>
					<NyrButton @click="showAddTableroModal = true" size="sm">
						<NyrIcon icon="plus" size="sm" class="mr-2" />
						Nuevo Tablero
					</NyrButton>
				</div>

				<NyrTable :headers="tableroHeaders" :rows="tableroRows">
					<template #cell-tablero-actions="{ cell }">
						<div class="flex gap-2">
							<button
								@click="$router.push(`/tablero?id=${cell.id}`)"
								class="text-blue-500 hover:text-blue-700 transition-colors p-2"
								title="Ver"
							>
								<NyrIcon icon="eye" size="sm" />
							</button>
							<button
								@click="onCloneTablero(tableros.find(t => t.id === cell.id))"
								class="text-purple-500 hover:text-purple-700 transition-colors p-2"
								title="Clonar"
							>
								<NyrIcon icon="copy" size="sm" />
							</button>
							<button
								@click="onDeleteTablero(cell.id)"
								class="text-red-500 hover:text-red-700 transition-colors p-2"
								title="Eliminar"
							>
								<NyrIcon icon="trash" size="sm" />
							</button>
						</div>
					</template>
				</NyrTable>
			</div>

			<!-- Diagramas Section -->
			<div class="mb-12">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold text-charcoal">Diagramas</h2>
					<NyrButton @click="showAddDiagramaModal = true" size="sm">
						<NyrIcon icon="plus" size="sm" class="mr-2" />
						Nuevo Diagrama
					</NyrButton>
				</div>

				<NyrTable :headers="diagramaHeaders" :rows="diagramaRows">
					<template #cell-diagrama-actions="{ cell }">
						<div class="flex gap-2">
							<button
								@click="$router.push(`/diagrama?id=${cell.id}`)"
								class="text-blue-500 hover:text-blue-700 transition-colors p-2"
								title="Ver"
							>
								<NyrIcon icon="eye" size="sm" />
							</button>
							<button
								@click="onCloneDiagrama(diagramas.find(d => d.id === cell.id))"
								class="text-purple-500 hover:text-purple-700 transition-colors p-2"
								title="Clonar"
							>
								<NyrIcon icon="copy" size="sm" />
							</button>
							<button
								@click="onDeleteDiagrama(cell.id)"
								class="text-red-500 hover:text-red-700 transition-colors p-2"
								title="Eliminar"
							>
								<NyrIcon icon="trash" size="sm" />
							</button>
						</div>
					</template>
				</NyrTable>
			</div>

<!-- Reportes Section -->
		<div class="pt-8 border-t border-gray-200">
			<h2 class="text-xl font-semibold text-charcoal mb-6">Reportes</h2>
			
				<!-- KPI Cards Row -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<NyrCard class="p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-600 text-sm mb-2">Tableros</p>
								<p class="text-3xl font-bold text-charcoal">{{ statistics.totalTableros }}</p>
							</div>
							<div class="bg-blue-200 rounded-lg p-4">
								<NyrIcon icon="layout-grid" size="lg" class="text-blue-700" />
							</div>
						</div>
					</NyrCard>

					<NyrCard class="p-6 bg-gradient-to-br from-purple-50 to-purple-100/30">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-600 text-sm mb-2">Diagramas</p>
								<p class="text-3xl font-bold text-charcoal">{{ statistics.totalDiagramas }}</p>
							</div>
							<div class="bg-purple-200 rounded-lg p-4">
								<NyrIcon icon="diagram" size="lg" class="text-purple-700" />
							</div>
						</div>
					</NyrCard>

					<NyrCard class="p-6 bg-gradient-to-br from-green-50 to-green-100/30">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-600 text-sm mb-2">Nodos Totales</p>
								<p class="text-3xl font-bold text-charcoal">{{ statistics.totalNodos }}</p>
							</div>
							<div class="bg-green-200 rounded-lg p-4">
								<NyrIcon icon="node-plus" size="lg" class="text-green-700" />
							</div>
						</div>
					</NyrCard>

					<NyrCard class="p-6 bg-gradient-to-br from-orange-50 to-orange-100/30">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-600 text-sm mb-2">Completitud</p>
								<p class="text-3xl font-bold text-charcoal">{{ statistics.completionRate }}%</p>
							</div>
							<div class="bg-orange-200 rounded-lg p-4">
								<NyrIcon icon="chart-pie" size="lg" class="text-orange-700" />
							</div>
						</div>
					</NyrCard>
				</div>

				<!-- Detailed Reports Grid -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- Production Costs Report -->
					<NyrCard class="p-6">
						<h3 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
							<NyrIcon icon="dollar-sign" size="md" class="text-green-600" />
							Costos de Producción
						</h3>
						<div class="space-y-4">
							<div>
								<div class="flex justify-between items-center mb-2">
									<span class="text-sm font-medium text-charcoal">Materia Prima</span>
									<span class="text-lg font-bold text-charcoal">$24,500</span>
								</div>
								<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full bg-gradient-to-r from-green-400 to-green-600" style="width: 65%"></div>
								</div>
							</div>
							<div>
								<div class="flex justify-between items-center mb-2">
									<span class="text-sm font-medium text-charcoal">Mano de Obra</span>
									<span class="text-lg font-bold text-charcoal">$12,800</span>
								</div>
								<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full bg-gradient-to-r from-blue-400 to-blue-600" style="width: 34%"></div>
								</div>
							</div>
							<div>
								<div class="flex justify-between items-center mb-2">
									<span class="text-sm font-medium text-charcoal">Logística</span>
									<span class="text-lg font-bold text-charcoal">$4,200</span>
								</div>
								<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full bg-gradient-to-r from-orange-400 to-orange-600" style="width: 11%"></div>
								</div>
							</div>
							<div>
								<div class="flex justify-between items-center mb-2">
									<span class="text-sm font-medium text-charcoal">Otros</span>
									<span class="text-lg font-bold text-charcoal">$2,900</span>
								</div>
								<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full bg-gradient-to-r from-gray-400 to-gray-600" style="width: 8%"></div>
								</div>
							</div>
							<div class="pt-3 border-t border-gray-200">
								<div class="flex justify-between items-center">
									<span class="font-semibold text-charcoal">Total</span>
									<span class="text-xl font-bold text-charcoal">$44,400</span>
								</div>
							</div>
						</div>
					</NyrCard>

					<!-- Pipeline Status Report -->
					<NyrCard class="p-6">
						<h3 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
							<NyrIcon icon="flow-branch" size="md" class="text-purple-600" />
							Estado del Proceso
						</h3>
						<div class="space-y-4">
							<div>
								<div class="flex justify-between items-center mb-2">
									<span class="text-sm font-medium text-charcoal">Fermentación</span>
									<span class="text-sm font-semibold text-orange-600">67%</span>
								</div>
								<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full bg-gradient-to-r from-orange-400 to-orange-600" style="width: 67%"></div>
								</div>
							</div>
							<div>
								<div class="flex justify-between items-center mb-2">
									<span class="text-sm font-medium text-charcoal">Crianza</span>
									<span class="text-sm font-semibold text-gray-500">0%</span>
								</div>
								<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full" style="width: 0%"></div>
								</div>
							</div>
							<div>
								<div class="flex justify-between items-center mb-2">
									<span class="text-sm font-medium text-charcoal">Embotellado</span>
									<span class="text-sm font-semibold text-green-600">100%</span>
								</div>
								<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full bg-gradient-to-r from-green-400 to-green-600" style="width: 100%"></div>
								</div>
							</div>
							<div>
								<div class="flex justify-between items-center mb-2">
									<span class="text-sm font-medium text-charcoal">Etiquetado</span>
									<span class="text-sm font-semibold text-gray-500">0%</span>
								</div>
								<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full" style="width: 0%"></div>
								</div>
							</div>
						</div>
					</NyrCard>

					<!-- Performance Metrics -->
					<NyrCard class="p-6">
						<h3 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
							<NyrIcon icon="trending-up" size="md" class="text-blue-600" />
							Métricas de Rendimiento
						</h3>
						<div class="space-y-4">
							<div class="flex justify-between items-center pb-3 border-b border-gray-200">
								<span class="text-sm text-gray-600">Tiempo Promedio</span>
								<span class="text-lg font-bold text-charcoal">8.2 días</span>
							</div>
							<div class="flex justify-between items-center pb-3 border-b border-gray-200">
								<span class="text-sm text-gray-600">Productividad del Equipo</span>
								<span class="text-lg font-bold text-charcoal">92%</span>
							</div>
							<div class="flex justify-between items-center pb-3 border-b border-gray-200">
								<span class="text-sm text-gray-600">Varianza de Costos</span>
								<span class="text-lg font-bold text-green-600">-3.2%</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-600">Última Sincronización</span>
								<span class="text-xs text-gray-500">{{ statistics.lastSync }}</span>
							</div>
						</div>
					</NyrCard>

					<!-- Health Status -->
					<NyrCard class="p-6 bg-gradient-to-br from-green-50 to-emerald-100/30">
						<h3 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
							<NyrIcon icon="check-circle" size="md" class="text-green-600" />
							Estado del Sistema
						</h3>
						<div class="grid grid-cols-3 gap-2 text-center">
							<div class="bg-white rounded-lg p-3">
								<p class="text-2xl font-bold text-green-600">✓</p>
								<p class="text-xs text-gray-600 mt-1">Operativo</p>
							</div>
							<div class="bg-white rounded-lg p-3">
								<p class="text-lg font-semibold text-charcoal">{{ statistics.activeItems }}</p>
								<p class="text-xs text-gray-600 mt-1">Activos</p>
							</div>
							<div class="bg-white rounded-lg p-3">
								<p class="text-2xl font-bold text-green-600">Óptimo</p>
								<p class="text-xs text-gray-600 mt-1">Salud</p>
							</div>
						</div>
					</NyrCard>
				</div>
			</div>
		</div>
	</div>

	<!-- Add Tablero Modal -->
	<NyrModal v-model="showAddTableroModal" size="md">
		<div class="p-6">
			<h3 class="text-lg font-semibold text-charcoal mb-6">Nuevo Tablero</h3>
			<div class="space-y-4">
				<NyrInput
					v-model="newTableroForm.nombre"
					label="Nombre del Tablero"
					placeholder="Ej: VENDIMIA_2026_C"
				/>
				<div>
					<label class="block text-sm font-medium text-charcoal mb-2">Descripción</label>
					<textarea
						v-model="newTableroForm.descripcion"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
						placeholder="Descripción del tablero..."
						rows="3"
					></textarea>
				</div>
			</div>
			<div class="flex gap-3 justify-end mt-6">
				<NyrButton @click="showAddTableroModal = false" variant="secondary">
					Cancelar
				</NyrButton>
				<NyrButton @click="onAddTablero">
					<NyrIcon icon="plus" size="sm" class="mr-2" />
					Crear Tablero
				</NyrButton>
			</div>
		</div>
	</NyrModal>

	<!-- Add Diagrama Modal -->
	<NyrModal v-model="showAddDiagramaModal" size="md">
		<div class="p-6">
			<h3 class="text-lg font-semibold text-charcoal mb-6">Nuevo Diagrama</h3>
			<div class="space-y-4">
				<NyrInput
					v-model="newDiagramaForm.nombre"
					label="Nombre del Diagrama"
					placeholder="Ej: Producción Cabernet"
				/>
				<div>
					<label class="block text-sm font-medium text-charcoal mb-2">Descripción</label>
					<textarea
						v-model="newDiagramaForm.descripcion"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
						placeholder="Descripción del diagrama..."
						rows="3"
					></textarea>
				</div>
			</div>
			<div class="flex gap-3 justify-end mt-6">
				<NyrButton @click="showAddDiagramaModal = false" variant="secondary">
					Cancelar
				</NyrButton>
				<NyrButton @click="onAddDiagrama">
					<NyrIcon icon="plus" size="sm" class="mr-2" />
					Crear Diagrama
				</NyrButton>
			</div>
		</div>
	</NyrModal>

	<!-- Clone Modal -->
	<NyrModal v-model="showCloneModal" size="md">
		<div class="p-6">
			<h3 class="text-lg font-semibold text-charcoal mb-6">
				Clonar {{ cloneType === 'tablero' ? 'Tablero' : 'Diagrama' }}
			</h3>
			<p v-if="selectedItemToClone" class="text-gray-600 mb-4 text-sm">
				Original: <span class="font-semibold">{{ selectedItemToClone.name }}</span>
			</p>
			<div class="space-y-4">
				<NyrInput
					v-model="cloneForm.nuevoNombre"
					label="Nuevo Nombre"
					placeholder="Nombre para la copia..."
				/>
				<div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
					<input
						id="copyContent"
						v-model="cloneForm.copiarContenido"
						type="checkbox"
						class="w-4 h-4 cursor-pointer"
					/>
					<label for="copyContent" class="text-sm text-charcoal cursor-pointer flex-1">
						Copiar contenido del {{ cloneType === 'tablero' ? 'tablero' : 'diagrama' }} original
					</label>
				</div>
			</div>
			<div class="flex gap-3 justify-end mt-6">
				<NyrButton @click="showCloneModal = false" variant="secondary">
					Cancelar
				</NyrButton>
				<NyrButton @click="onConfirmClone">
					<NyrIcon icon="copy" size="sm" class="mr-2" />
					Clonar
				</NyrButton>
			</div>
		</div>
	</NyrModal>
</template>

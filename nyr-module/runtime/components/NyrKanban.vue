<template>
	<div class="flex gap-4 overflow-x-auto pb-4">
		<div
			v-for="column in localColumns"
			:key="column.id"
			class="flex-shrink-0 bg-gray-50 rounded-lg p-4"
			:style="{ width: `${column.gridCols * 180 + (column.gridCols - 1) * 16 + 32}px` }"
		>
			<!-- Column Header -->
			<div class="flex items-center justify-between mb-4">
				<h3 class="font-semibold text-charcoal">{{ column.name }}</h3>
				<div class="flex items-center gap-2">
					<!-- Expand/Collapse buttons -->
					<button
						v-if="canDecreaseColumns(column.id)"
						@click="decreaseColumns(column.id)"
						class="text-gray-500 hover:text-gray-700 p-1"
						title="Reducir columnas"
					>
						<i class="fa-solid fa-minus text-xs"></i>
					</button>
					<button
						@click="increaseColumns(column.id)"
						class="text-gray-500 hover:text-gray-700 p-1"
						title="Aumentar columnas"
					>
						<i class="fa-solid fa-plus text-xs"></i>
					</button>
					<!-- Add card button -->
					<button
						@click="addCard(column.id)"
						class="text-blue-500 hover:text-blue-700 p-1"
						:title="`Agregar ${column.allowedTypes.join(' / ')}`"
					>
						<i class="fa-solid fa-circle-plus"></i>
					</button>
				</div>
			</div>

			<!-- Cards Grid -->
			<div
				class="grid gap-4"
				:style="{ gridTemplateColumns: `repeat(${column.gridCols}, 1fr)` }"
			>
				<div
					v-for="(slot, index) in getTotalSlots(column)"
					:key="`${column.id}-${index}`"
					class="w-[164px] h-[120px]"
					@drop="onDrop($event, column.id, index)"
					@dragover.prevent
					@dragenter.prevent
				>
					<div
						v-if="slot"
						:draggable="true"
						@dragstart="onDragStart($event, column.id, index, slot)"
						class="w-full h-full rounded-lg border-2 shadow-sm cursor-move hover:shadow-md transition-shadow"
						:class="getCardClasses(slot.type)"
					>
						<div class="p-3 h-full flex flex-col">
							<div class="flex items-center gap-2">
								<i :class="['fa-solid', getCardIcon(slot.type), 'text-sm', 'flex-shrink-0']"></i>
								<div class="flex-1 overflow-hidden">
									<span class="text-sm font-medium text-charcoal truncate block">{{ slot.name || '...' }}</span>
								</div>
							</div>
							<span class="text-xs uppercase tracking-wide opacity-60 mt-2">{{ slot.type }}</span>
						</div>
					</div>
					<div
						v-else
						class="w-full h-full rounded-lg border-2 border-dashed border-gray-300 bg-white"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	columns: {
		type: Array,
		required: true
	},
	cards: {
		type: Object,
		required: true
	}
})

const emit = defineEmits(['update:cards'])

const localColumns = ref(props.columns.map(col => ({
	...col,
	gridCols: col.defaultGridCols || 1
})))

const localCards = ref({ ...props.cards })

function getTotalSlots(column) {
	const cards = localCards.value[column.id] || []
	const gridCols = column.gridCols || 1
	
	// Assign fixed row/col indices to cards that don't have them yet
	cards.forEach((card, index) => {
		if (card.slotRow === undefined) {
			card.slotRow = Math.floor(index / gridCols)
			card.slotCol = index % gridCols
		}
	})
	
	// Find the highest row used
	let maxRow = -1
	cards.forEach(card => {
		if (typeof card.slotRow === 'number') {
			maxRow = Math.max(maxRow, card.slotRow)
		}
	})
	
	// Total rows = highest row used + 2 empty rows (minimum 3 rows)
	const totalRows = Math.max(maxRow + 3, 3)
	const slotsNeeded = totalRows * gridCols
	
	// Validate array size
	if (slotsNeeded <= 0 || slotsNeeded > 1000) {
		console.error('Invalid slots calculation', { totalRows, gridCols, slotsNeeded })
		return []
	}
	
	const slots = new Array(slotsNeeded).fill(null)
	
	// Place each card at its row/col position
	cards.forEach(card => {
		const slotIndex = card.slotRow * gridCols + card.slotCol
		if (slotIndex >= 0 && slotIndex < slots.length) {
			slots[slotIndex] = card
		}
	})
	
	return slots
}

function getCardClasses(type) {
	const classes = {
		'Proceso': 'nyr-card-proceso',
		'Producto': 'nyr-card-producto',
		'Punto de Venta': 'nyr-card-venta',
		'Empresa': 'nyr-card-empresa',
		'Variable': 'nyr-card-variable'
	}
	return classes[type] || 'nyr-card-default'
}

function getCardIcon(type) {
	const icons = {
		'Proceso': 'fa-gears',
		'Producto': 'fa-wine-bottle',
		'Punto de Venta': 'fa-shop',
		'Empresa': 'fa-building',
		'Variable': 'fa-chart-line'
	}
	return icons[type] || 'fa-square'
}

function increaseColumns(columnId) {
	const column = localColumns.value.find(c => c.id === columnId)
	if (column) {
		column.gridCols++
	}
}

function canDecreaseColumns(columnId) {
	const column = localColumns.value.find(c => c.id === columnId)
	if (!column || column.gridCols <= 1) return false
	
	// Check if last column has any cards
	const cards = localCards.value[columnId] || []
	const lastColIndex = column.gridCols - 1
	const hasCardsInLastCol = cards.some(card => card.slotCol === lastColIndex)
	
	return !hasCardsInLastCol
}

function decreaseColumns(columnId) {
	const column = localColumns.value.find(c => c.id === columnId)
	if (!column || column.gridCols <= 1) return
	
	// Check if last column has any cards
	if (!canDecreaseColumns(columnId)) {
		console.warn('Cannot reduce columns - last column has cards')
		return
	}
	
	column.gridCols--
}

function addCard(columnId) {
	const column = localColumns.value.find(c => c.id === columnId)
	if (!column) return
	
	const newCard = {
		id: Date.now(),
		type: column.allowedTypes[0],
		name: ''
	}
	
	if (!localCards.value[columnId]) {
		localCards.value[columnId] = []
	}
	
	localCards.value[columnId].push(newCard)
	emit('update:cards', localCards.value)
}

let draggedItem = null

function onDragStart(event, columnId, index, card) {
	draggedItem = { columnId, index, card }
	event.dataTransfer.effectAllowed = 'move'
}

function onDrop(event, targetColumnId, targetIndex) {
	if (!draggedItem || draggedItem.columnId !== targetColumnId) return
	
	const cards = [...(localCards.value[targetColumnId] || [])]
	const draggedCard = cards[draggedItem.index]
	
	// Remove from old position
	cards.splice(draggedItem.index, 1)
	
	// Insert at new position
	const actualTargetIndex = Math.min(targetIndex, cards.length)
	cards.splice(actualTargetIndex, 0, draggedCard)
	
	localCards.value[targetColumnId] = cards
	emit('update:cards', localCards.value)
	draggedItem = null
}
</script>

<style scoped>
.nyr-card-proceso {
	background-color: #ede8db;
	border-color: var(--nyr-info);
}

.nyr-card-producto {
	background-color: #f5f0e8;
	border-color: var(--nyr-accent);
}

.nyr-card-venta {
	background-color: #e8ede3;
	border-color: var(--nyr-success);
}

.nyr-card-empresa {
	background-color: #e8eaed;
	border-color: var(--nyr-border);
}

.nyr-card-variable {
	background-color: #f0e8ed;
	border-color: #7d5c84;
}

.nyr-card-default {
	background-color: var(--nyr-surface);
	border-color: var(--nyr-border);
}
</style>

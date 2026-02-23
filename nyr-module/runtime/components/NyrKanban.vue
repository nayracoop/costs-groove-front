<template>
	<div class="relative flex gap-4 overflow-x-auto pb-4">
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
					<NyrKanbanCard
						v-if="slot"
						:name="slot.name"
						:type="slot.type"
						:icon="slot.icon"
						:color="slot.type"
						:tags="slot.tags"
						:group="slot.group"
						:selected="isSelected(slot.id)"
						@dragstart="onDragStart($event, column.id, index, slot)"
						@click="onCardClick($event, slot)"
						@contextmenu="onCardContextMenu($event, slot)"
					/>
					<div
						v-else
						class="w-full h-full rounded-lg border-2 border-dashed border-gray-300 bg-white"
					></div>
				</div>
			</div>
		</div>

		<div
			v-if="contextMenu.visible"
			class="fixed z-50 min-w-[180px] rounded-md border border-black/10 bg-white shadow-lg py-1"
			:style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
		>
			<button class="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-black/5" type="button">
				Abrir
			</button>
			<button class="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-black/5" type="button">
				Duplicar
			</button>
			<button class="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-black/5" type="button">
				Eliminar
			</button>
			<button
				class="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-black/5"
				:class="{ 'opacity-50 pointer-events-none': selectedCardIds.size <= 1 }"
				type="button"
			>
				Agrupar
			</button>
		</div>
	</div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import NyrKanbanCard from './NyrKanbanCard.vue'

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

const selectedCardIds = ref(new Set())
const contextMenu = ref({ visible: false, x: 0, y: 0 })

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

function isSelected(cardId) {
	return selectedCardIds.value.has(cardId)
}

function clearSelection() {
	selectedCardIds.value = new Set()
}

function onCardClick(event, card) {
	const isMultiSelect = event.ctrlKey || event.metaKey
	const nextSelection = new Set(selectedCardIds.value)

	if (isMultiSelect) {
		if (nextSelection.has(card.id)) {
			nextSelection.delete(card.id)
		} else {
			nextSelection.add(card.id)
		}
	} else {
		nextSelection.clear()
		nextSelection.add(card.id)
	}

	selectedCardIds.value = nextSelection
}

function openContextMenu(event, card) {
	const nextSelection = new Set(selectedCardIds.value)
	if (!nextSelection.has(card.id)) {
		nextSelection.clear()
		nextSelection.add(card.id)
		selectedCardIds.value = nextSelection
	}

	contextMenu.value = {
		visible: true,
		x: event.clientX,
		y: event.clientY
	}
}

function closeContextMenu() {
	if (contextMenu.value.visible) {
		contextMenu.value = { visible: false, x: 0, y: 0 }
	}
}

function onCardContextMenu(event, card) {
	event.preventDefault()
	openContextMenu(event, card)
}

function handleKeydown(event) {
	if (event.key === 'Escape') {
		clearSelection()
		closeContextMenu()
	}
}

function handleGlobalClick() {
	closeContextMenu()
}

onMounted(() => {
	window.addEventListener('keydown', handleKeydown)
	window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
	window.removeEventListener('keydown', handleKeydown)
	window.removeEventListener('click', handleGlobalClick)
})

function onDragStart(event, columnId, slotIndex, card) {
	const column = localColumns.value.find(c => c.id === columnId)
	const gridCols = column?.gridCols || 1
	const slotRow = typeof card.slotRow === 'number' ? card.slotRow : Math.floor(slotIndex / gridCols)
	const slotCol = typeof card.slotCol === 'number' ? card.slotCol : slotIndex % gridCols

	draggedItem = { columnId, cardId: card.id, slotRow, slotCol }
	event.dataTransfer.effectAllowed = 'move'
}

function onDrop(event, targetColumnId, targetIndex) {
	if (!draggedItem) return

	const targetColumn = localColumns.value.find(c => c.id === targetColumnId)
	if (!targetColumn) return

	const targetGridCols = targetColumn.gridCols || 1
	const targetSlotRow = Math.floor(targetIndex / targetGridCols)
	const targetSlotCol = targetIndex % targetGridCols

	const sourceColumnId = draggedItem.columnId
	const sourceCards = [...(localCards.value[sourceColumnId] || [])]
	const targetCards = sourceColumnId === targetColumnId
		? sourceCards
		: [...(localCards.value[targetColumnId] || [])]

	const sourceIndex = sourceCards.findIndex(card => card.id === draggedItem.cardId)
	if (sourceIndex === -1) return

	const draggedCard = sourceCards[sourceIndex]
	const targetCardIndex = targetCards.findIndex(
		card => card.slotRow === targetSlotRow && card.slotCol === targetSlotCol
	)

	draggedCard.slotRow = targetSlotRow
	draggedCard.slotCol = targetSlotCol

	if (sourceColumnId === targetColumnId) {
		if (targetCardIndex !== -1 && targetCards[targetCardIndex].id !== draggedCard.id) {
			const targetCard = targetCards[targetCardIndex]
			targetCard.slotRow = draggedItem.slotRow
			targetCard.slotCol = draggedItem.slotCol
		}
		localCards.value[targetColumnId] = targetCards
	} else {
		sourceCards.splice(sourceIndex, 1)

		if (targetCardIndex !== -1) {
			const targetCard = targetCards[targetCardIndex]
			targetCard.slotRow = draggedItem.slotRow
			targetCard.slotCol = draggedItem.slotCol
			sourceCards.push(targetCard)
			targetCards.splice(targetCardIndex, 1)
		}

		targetCards.push(draggedCard)
		localCards.value[sourceColumnId] = sourceCards
		localCards.value[targetColumnId] = targetCards
	}

	emit('update:cards', localCards.value)
	draggedItem = null
}
</script>

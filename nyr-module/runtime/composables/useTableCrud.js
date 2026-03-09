import { ref } from 'vue'

export function useTableCrud(rows, options = {}) {
	const { onAddRow, onResetForm, onImportCSV, onSave } = options
	const filterText = ref('')
	const showDeleteModal = ref(false)
	const showAddModal = ref(false)
	const rowToDelete = ref(null)

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

	function onImportCSVClick() {
		if (onImportCSV) {
			onImportCSV()
		}
	}

	function onSaveClick() {
		if (onSave) {
			onSave()
		}
	}

	function onAgregar() {
		showAddModal.value = true
	}

	function onCancelAgregar() {
		showAddModal.value = false
		if (onResetForm) {
			onResetForm()
		}
	}

	function onConfirmAgregar() {
		const newRow = onAddRow ? onAddRow() : null
		if (newRow) {
			rows.value.unshift(newRow)
		}
		showAddModal.value = false
		if (onResetForm) {
			onResetForm()
		}
	}

	function onDeleteClick(rowIndex) {
		rowToDelete.value = rowIndex
		showDeleteModal.value = true
	}

	function onConfirmDelete() {
		if (rowToDelete.value !== null) {
			rows.value.splice(rowToDelete.value, 1)
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

	return {
		filterText,
		showDeleteModal,
		showAddModal,
		rowToDelete,
		onCellEdited,
		onImportCSV: onImportCSVClick,
		onSave: onSaveClick,
		onAgregar,
		onCancelAgregar,
		onConfirmAgregar,
		onDeleteClick,
		onConfirmDelete,
		onCancelDelete,
		onToggleTablero
	}
}

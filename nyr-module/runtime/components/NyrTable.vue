<template>
  <div class="nyr-table-container">
    <table :class="tableClasses">
      <thead>
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="`header-${index}`"
            :class="['nyr-table-header', header.class]"
          >
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in paginatedRows"
          :key="`row-${rowIndex}`"
          :class="getRowClasses(rowIndex)"
        >
          <td
            v-for="(cell, colIndex) in row"
            :key="`cell-${rowIndex}-${colIndex}`"
            :class="['nyr-table-cell', cell.class]"
          >
            <!-- Custom component slot -->
            <slot 
              v-if="cell.component" 
              :name="`cell-${cell.component}`" 
              :rowIndex="getActualRowIndex(rowIndex)"
              :colIndex="colIndex"
              :cell="cell"
            ></slot>
            <!-- Select dropdown -->
            <select
              v-else-if="hasOptions(cell)"
              :class="['nyr-table-select', cell.selectClass]"
              :value="cell.value ?? cell.text"
              :disabled="cell.editable === false"
              @change="onSelectChange($event, getActualRowIndex(rowIndex), colIndex, cell)"
            >
              <option
                v-for="option in cell.options"
                :key="option.key"
                :value="option.key"
              >
                {{ option.value }}
              </option>
            </select>
            <!-- Editable text cell -->
            <span
              v-else
              class="nyr-table-cell-text"
              :contenteditable="cell.editable === true"
              @blur="onCellBlur($event, getActualRowIndex(rowIndex), colIndex, cell)"
              @keydown.enter.prevent="onEnterKey($event)"
            >
              {{ cell.text }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="paginate" class="nyr-table-pagination">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="nyr-pagination-btn"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      
      <div class="nyr-pagination-info">
        Página {{ currentPage }} de {{ totalPages }}
      </div>
      
      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="nyr-pagination-btn"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  headers: { 
    type: Array, 
    default: () => [] 
    // [{ text: "Name", class: "text-left" }, ...]
  },
  rows: { 
    type: Array, 
    default: () => [] 
    // [[{ text: "John", class: "", editable: false }, ...], ...]
  },
  size: { type: String, default: 'md' }, // sm, md, lg
  striped: { type: Boolean, default: true },
  bordered: { type: Boolean, default: true },
  hover: { type: Boolean, default: true },
  paginate: { type: Boolean, default: false },
  limit: { type: Number, default: 10 }
})

const emit = defineEmits(['cell-edited'])
const currentPage = ref(1)

const tableClasses = computed(() => {
  const classes = ['nyr-table']
  
  if (props.size === 'sm') classes.push('table-sm')
  else if (props.size === 'lg') classes.push('table-lg')
  
  if (props.striped) classes.push('table-striped')
  if (props.bordered) classes.push('table-bordered')
  if (props.hover) classes.push('table-hover')
  
  return classes.join(' ')
})

const totalPages = computed(() => {
  return Math.ceil(props.rows.length / props.limit)
})

const paginatedRows = computed(() => {
  if (!props.paginate) {
    return props.rows
  }
  
  const start = (currentPage.value - 1) * props.limit
  const end = start + props.limit
  return props.rows.slice(start, end)
})

function getActualRowIndex(paginatedIndex) {
  if (!props.paginate) {
    return paginatedIndex
  }
  return (currentPage.value - 1) * props.limit + paginatedIndex
}

function getRowClasses(rowIndex) {
  return 'nyr-table-row'
}

function hasOptions(cell) {
  return Array.isArray(cell.options) && cell.options.length > 0
}

function onCellBlur(event, rowIndex, colIndex, cell) {
  const oldValue = cell.text
  const newValue = event.target.textContent.trim()
  
  if (oldValue !== newValue && cell.editable) {
    emit('cell-edited', {
      rowIndex,
      colIndex,
      oldValue,
      newValue
    })
  }
}

function onSelectChange(event, rowIndex, colIndex, cell) {
  const oldValue = cell.value ?? cell.text
  const newValue = event.target.value

  if (oldValue !== newValue) {
    emit('cell-edited', {
      rowIndex,
      colIndex,
      oldValue,
      newValue
    })
  }
}

function onEnterKey(event) {
  // Blur the cell to trigger save
  event.target.blur()
}
</script>

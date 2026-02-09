<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">NyrTable Component Demo</h1>

      <!-- Basic Table -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Basic Table</h2>
        <NyrTable
          :headers="basicHeaders"
          :rows="basicRows"
        />
      </section>

      <!-- Editable Table -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Editable Table</h2>
        <p class="text-sm text-gray-600 mb-4">
          Click on cells in the "Email" and "Phone" columns to edit them. Press Enter or click outside to save.
        </p>
        <NyrTable
          :headers="editableHeaders"
          :rows="editableRows"
          @cell-edited="onCellEdited"
        />
        
        <!-- Last Edit Info -->
        <div v-if="lastEdit" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p class="text-sm font-medium text-blue-900">Last Edit:</p>
          <p class="text-sm text-blue-700">
            Row {{ lastEdit.rowIndex }}, Column {{ lastEdit.colIndex }}: 
            "{{ lastEdit.oldValue }}" → "{{ lastEdit.newValue }}"
          </p>
        </div>
      </section>

      <!-- Size Variants -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Size Variants</h2>
        
        <h3 class="text-md font-medium text-gray-700 mb-2">Small</h3>
        <NyrTable
          :headers="sizeHeaders"
          :rows="sizeRows"
          size="sm"
          class="mb-6"
        />

        <h3 class="text-md font-medium text-gray-700 mb-2">Medium (Default)</h3>
        <NyrTable
          :headers="sizeHeaders"
          :rows="sizeRows"
          size="md"
          class="mb-6"
        />

        <h3 class="text-md font-medium text-gray-700 mb-2">Large</h3>
        <NyrTable
          :headers="sizeHeaders"
          :rows="sizeRows"
          size="lg"
        />
      </section>

      <!-- Style Variants -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Style Variants</h2>
        
        <h3 class="text-md font-medium text-gray-700 mb-2">No Stripes</h3>
        <NyrTable
          :headers="styleHeaders"
          :rows="styleRows"
          :striped="false"
          class="mb-6"
        />

        <h3 class="text-md font-medium text-gray-700 mb-2">No Borders</h3>
        <NyrTable
          :headers="styleHeaders"
          :rows="styleRows"
          :bordered="false"
          class="mb-6"
        />

        <h3 class="text-md font-medium text-gray-700 mb-2">No Hover</h3>
        <NyrTable
          :headers="styleHeaders"
          :rows="styleRows"
          :hover="false"
        />
      </section>

      <!-- Custom Classes -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Custom Cell Classes</h2>
        <NyrTable
          :headers="customHeaders"
          :rows="customRows"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Basic Table Data
const basicHeaders = [
  { text: 'Name', class: 'text-left' },
  { text: 'Position', class: 'text-left' },
  { text: 'Department', class: 'text-left' },
  { text: 'Status', class: 'text-center' }
]

const basicRows = [
  [
    { text: 'John Doe', class: 'font-medium', editable: false },
    { text: 'Software Engineer', class: '', editable: false },
    { text: 'Engineering', class: '', editable: false },
    { text: 'Active', class: 'text-green-600 font-semibold text-center', editable: false }
  ],
  [
    { text: 'Jane Smith', class: 'font-medium', editable: false },
    { text: 'Product Manager', class: '', editable: false },
    { text: 'Product', class: '', editable: false },
    { text: 'Active', class: 'text-green-600 font-semibold text-center', editable: false }
  ],
  [
    { text: 'Bob Johnson', class: 'font-medium', editable: false },
    { text: 'Designer', class: '', editable: false },
    { text: 'Design', class: '', editable: false },
    { text: 'Inactive', class: 'text-gray-400 font-semibold text-center', editable: false }
  ]
]

// Editable Table Data
const editableHeaders = [
  { text: 'ID', class: 'text-left' },
  { text: 'Name', class: 'text-left' },
  { text: 'Email', class: 'text-left' },
  { text: 'Phone', class: 'text-left' }
]

const editableRows = ref([
  [
    { text: '1', class: 'font-mono text-gray-500', editable: false },
    { text: 'Alice Brown', class: 'font-medium', editable: false },
    { text: 'alice@example.com', class: 'text-blue-600', editable: true },
    { text: '+1 234 567 8901', class: '', editable: true }
  ],
  [
    { text: '2', class: 'font-mono text-gray-500', editable: false },
    { text: 'Charlie Davis', class: 'font-medium', editable: false },
    { text: 'charlie@example.com', class: 'text-blue-600', editable: true },
    { text: '+1 234 567 8902', class: '', editable: true }
  ],
  [
    { text: '3', class: 'font-mono text-gray-500', editable: false },
    { text: 'Diana Evans', class: 'font-medium', editable: false },
    { text: 'diana@example.com', class: 'text-blue-600', editable: true },
    { text: '+1 234 567 8903', class: '', editable: true }
  ]
])

const lastEdit = ref(null)

function onCellEdited(event) {
  lastEdit.value = event
  
  // Update the actual data
  editableRows.value[event.rowIndex][event.colIndex].text = event.newValue
  
  console.log('Cell edited:', event)
}

// Size Table Data
const sizeHeaders = [
  { text: 'Product', class: '' },
  { text: 'Price', class: 'text-right' },
  { text: 'Stock', class: 'text-center' }
]

const sizeRows = [
  [
    { text: 'Widget A', class: '', editable: false },
    { text: '$19.99', class: 'text-right', editable: false },
    { text: '42', class: 'text-center', editable: false }
  ],
  [
    { text: 'Widget B', class: '', editable: false },
    { text: '$29.99', class: 'text-right', editable: false },
    { text: '17', class: 'text-center', editable: false }
  ]
]

// Style Table Data
const styleHeaders = [
  { text: 'Item', class: '' },
  { text: 'Description', class: '' }
]

const styleRows = [
  [
    { text: 'Item 1', class: '', editable: false },
    { text: 'Description for item 1', class: '', editable: false }
  ],
  [
    { text: 'Item 2', class: '', editable: false },
    { text: 'Description for item 2', class: '', editable: false }
  ],
  [
    { text: 'Item 3', class: '', editable: false },
    { text: 'Description for item 3', class: '', editable: false }
  ]
]

// Custom Classes Table Data
const customHeaders = [
  { text: 'Priority', class: 'text-center' },
  { text: 'Task', class: '' },
  { text: 'Assigned To', class: '' },
  { text: 'Progress', class: 'text-right' }
]

const customRows = [
  [
    { text: 'High', class: 'text-red-600 font-bold text-center bg-red-50', editable: false },
    { text: 'Fix critical bug', class: 'font-medium', editable: false },
    { text: 'Engineering Team', class: '', editable: false },
    { text: '85%', class: 'text-right font-semibold text-green-600', editable: false }
  ],
  [
    { text: 'Medium', class: 'text-yellow-600 font-bold text-center bg-yellow-50', editable: false },
    { text: 'Update documentation', class: '', editable: false },
    { text: 'Tech Writers', class: '', editable: false },
    { text: '50%', class: 'text-right font-semibold text-yellow-600', editable: false }
  ],
  [
    { text: 'Low', class: 'text-blue-600 font-bold text-center bg-blue-50', editable: false },
    { text: 'Refactor legacy code', class: '', editable: false },
    { text: 'Backend Team', class: '', editable: false },
    { text: '20%', class: 'text-right font-semibold text-gray-600', editable: false }
  ]
]
</script>

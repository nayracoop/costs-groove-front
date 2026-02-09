<template>
  <div class="nyr-date-container">
    <label v-if="label" :for="inputId" class="nyr-date-label">
      {{ label }}
    </label>
    <div class="flex gap-2">
      <select
        :id="inputId"
        v-model="selectedMonth"
        :class="selectClasses"
        :disabled="disabled"
        @change="onDateChange"
      >
        <option value="">Mes</option>
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
      <select
        v-model="selectedYear"
        :class="selectClasses"
        :disabled="disabled"
        @change="onDateChange"
      >
        <option value="">Año</option>
        <option v-for="year in yearRange" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '' // Format: "MM/YYYY"
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  startYear: {
    type: Number,
    default: 2020
  },
  endYear: {
    type: Number,
    default: 2030
  }
})

const emit = defineEmits(['update:modelValue'])

const inputId = `nyr-date-${Math.random().toString(36).substr(2, 9)}`
const selectedMonth = ref('')
const selectedYear = ref('')

const months = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' }
]

const yearRange = computed(() => {
  const years = []
  for (let year = props.startYear; year <= props.endYear; year++) {
    years.push(year)
  }
  return years
})

const selectClasses = computed(() => {
  return [
    'nyr-date-select',
    'px-3 py-2 border rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
  ].join(' ')
})

// Initialize from modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const [month, year] = newValue.split('/')
    selectedMonth.value = month
    selectedYear.value = year
  } else {
    selectedMonth.value = ''
    selectedYear.value = ''
  }
}, { immediate: true })

function onDateChange() {
  if (selectedMonth.value && selectedYear.value) {
    emit('update:modelValue', `${selectedMonth.value}/${selectedYear.value}`)
  } else {
    emit('update:modelValue', '')
  }
}
</script>

<style scoped>
.nyr-date-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nyr-date-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.nyr-date-select {
  flex: 1;
  min-width: 0;
}
</style>

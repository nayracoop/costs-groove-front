<template>
  <div class="nyr-input-container">
    <label v-if="label" class="nyr-input-label">{{ label }}</label>
    
    <!-- Multiple selection with badges -->
    <div v-if="multiple" class="nyr-multiselect-container">
      <!-- Dropdown -->
      <div class="nyr-select-wrapper">
        <select
          :value="''"
          :class="selectClasses"
          :disabled="disabled"
          @change="onMultiChange"
          @blur="$emit('blur')"
          @focus="$emit('focus')"
        >
          <option value="" disabled>
            {{ placeholder || 'Select options...' }}
          </option>
          <option
            v-for="option in options"
            :key="option.key"
            :value="option.key"
            :disabled="selectedValues.includes(option.key)"
          >
            {{ option.value }}
          </option>
        </select>
        <div class="nyr-select-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      
      <!-- Selected badges -->
      <div v-if="selectedValues.length > 0" class="nyr-multiselect-badges">
        <span
          v-for="key in selectedValues"
          :key="key"
          class="nyr-badge"
        >
          {{ getOptionLabel(key) }}
          <button
            type="button"
            class="nyr-badge-close"
            @click="removeOption(key)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </span>
      </div>
    </div>
    
    <!-- Single selection -->
    <div v-else class="nyr-select-wrapper">
      <select
        :value="modelValue"
        :class="selectClasses"
        :disabled="disabled"
        @change="onChange"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option v-if="defaultOption" :value="defaultOption.key">
          {{ defaultOption.value }}
        </option>
        <option
          v-for="option in options"
          :key="option.key"
          :value="option.key"
        >
          {{ option.value }}
        </option>
      </select>
      <div class="nyr-select-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    
    <p v-if="hint" class="nyr-input-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number, Array], default: '' },
  options: { type: Array, default: () => [] }, // [{ key: '1', value: 'Option 1' }, ...]
  defaultOption: { type: Object, default: null }, // { key: 'default', value: 'Default Option' }
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm, md, lg
  state: { type: String, default: '' }, // '', error, success
  disabled: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])

const selectedValues = computed(() => {
  if (!props.multiple) return []
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

const selectClasses = computed(() => {
  const classes = ['nyr-select-field']
  
  if (props.size === 'sm') classes.push('input-sm')
  else if (props.size === 'lg') classes.push('input-lg')
  
  if (props.state === 'error') classes.push('input-error')
  else if (props.state === 'success') classes.push('input-success')
  
  return classes.join(' ')
})

function onChange(e) {
  const value = e.target.value
  emit('update:modelValue', value)
  emit('change', value)
}

function onMultiChange(e) {
  const value = e.target.value
  if (!value) return
  
  const newValues = [...selectedValues.value, value]
  emit('update:modelValue', newValues)
  emit('change', newValues)
  
  // Reset select after selection
  e.target.value = ''
}

function removeOption(key) {
  const newValues = selectedValues.value.filter(v => v !== key)
  emit('update:modelValue', newValues)
  emit('change', newValues)
}

function getOptionLabel(key) {
  const option = props.options.find(o => o.key === key)
  return option ? option.value : key
}
</script>

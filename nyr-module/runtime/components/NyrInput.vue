<template>
  <div class="nyr-input-container">
    <label v-if="label" class="nyr-input-label">{{ label }}</label>
    <input
      :type="inputType"
      :value="displayValue"
      :class="inputClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
    />
    <p v-if="hint" class="nyr-input-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNyr } from '#imports'

const props = defineProps({
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  modelValue: { type: [String, Number], default: '' },
  formatter: { type: [String, Function], default: null },
  hint: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm, md, lg
  state: { type: String, default: '' }, // '', error, success
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue','blur','focus','keydown','keyup'])
const { prefs, perms } = useNyr()

const inputType = computed(() => (props.type === 'number' ? 'text' : props.type))

const inputClasses = computed(() => {
  const classes = ['nyr-input-field']
  
  if (props.size === 'sm') classes.push('input-sm')
  else if (props.size === 'lg') classes.push('input-lg')
  
  if (props.state === 'error') classes.push('input-error')
  else if (props.state === 'success') classes.push('input-success')
  
  return classes.join(' ')
})

const displayValue = computed(() => {
  if (!props.formatter) return props.modelValue
  if (typeof props.formatter === 'function') {
    try { return props.formatter(props.modelValue, { prefs: prefs.value, perms: perms.value }) } catch { return props.modelValue }
  }
  if (props.formatter === 'number') {
    const n = Number(props.modelValue)
    if (Number.isNaN(n)) return props.modelValue
    const r = Number(prefs.value?.numberRounding ?? 2)
    return n.toFixed(r)
  }
  if (props.formatter === 'trim') {
    return String(props.modelValue).trim()
  }
  return props.modelValue
})

function onInput(e) {
  const raw = e.target.value
  emit('update:modelValue', raw)
}
</script>

<style scoped>
.nyr-hint {
  font-style: italic;
}
</style>

<template>
  <component :is="tag" :class="componentClass">
    <template v-if="hasPrefix">{{ prefix }}</template>
    <template v-if="type === 'number'">{{ formattedNumber }}</template>
    <template v-else-if="type === 'icon'">
      <span aria-hidden="true">{{ value }}</span>
    </template>
    <template v-else-if="type === 'pad'">{{ paddedValue }}</template>
    <template v-else>
      <slot>{{ value }}</slot>
    </template>
    <template v-if="hasPostfix">{{ postfix }}</template>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useNyr } from '#imports'

const props = defineProps({
  type: { type: String, default: 'p' },
  value: { type: [String, Number], default: '' },
  prefix: { type: String, default: '' },
  postfix: { type: String, default: '' }
})

const { prefs } = useNyr()

const typeClassMap = {
  h1: 'nyr-h1',
  h2: 'nyr-h2',
  h3: 'nyr-h3',
  h4: 'nyr-h4',
  h5: 'nyr-h5',
  h6: 'nyr-h6',
  number: 'nyr-number',
  icon: 'nyr-icon',
  pad: 'nyr-pad',
  p: 'nyr-p'
}

const componentClass = computed(() => {
  const baseClass = 'nyr-text'
  const typeClass = typeClassMap[props.type] || typeClassMap.p
  return `${baseClass} ${typeClass}`
})

const tag = computed(() => {
  const t = props.type
  if (['h1','h2','h3','h4','h5','h6','p'].includes(t)) return t
  return 'p'
})

const hasPrefix = computed(() => props.prefix !== '')
const hasPostfix = computed(() => props.postfix !== '')

const formattedNumber = computed(() => {
  const n = Number(props.value)
  if (Number.isNaN(n)) return String(props.value)
  const r = Number(prefs.value?.numberRounding ?? 2)
  return n.toFixed(r)
})

const paddedValue = computed(() => {
  const v = String(props.value)
  const len = Number(prefs.value?.padLength ?? v.length)
  const char = String(prefs.value?.padChar ?? '0')
  return v.padStart(len, char)
})
</script>

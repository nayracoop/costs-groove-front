<template>
  <div>
    <h3 v-if="isMenuExpanded && headerLevel === 'h3'" class="px-6 text-[10px] font-bold uppercase tracking-wider mb-2 text-white">{{ label }}</h3>
    <h4 v-if="isMenuExpanded && headerLevel === 'h4'" class="px-6 text-[10px] font-bold uppercase text-white/80 mb-1 mt-2">{{ label }}</h4>
    <nav class="space-y-0.5" :class="headerLevel === 'h3' ? 'mb-6' : 'mb-3'">
      <slot />
    </nav>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const isMenuExpanded = inject('isMenuExpanded')

defineProps({
  label: {
    type: String,
    required: true
  },
  headerLevel: {
    type: String,
    default: 'h3',
    validator: (value) => ['h3', 'h4'].includes(value)
  }
})
</script>

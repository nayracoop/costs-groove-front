<template>
  <div class="flex items-center gap-3">
    <div :class="['w-9 h-9 rounded-full text-white flex items-center justify-center font-semibold text-xs tracking-wide flex-shrink-0', colorClass]">
      {{ initials }}
    </div>
    <div v-if="isMenuExpanded && name" class="text-sm text-cream font-medium">
      {{ name }}
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const isMenuExpanded = inject('isMenuExpanded')

defineProps({
  initials: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  colorClass: {
    type: String,
    default: 'bg-blue-600'
  }
})
</script>

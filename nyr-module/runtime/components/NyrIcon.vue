<template>
  <i :class="iconClasses" aria-hidden="true"></i>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  size: { type: String, default: 'md' } // sm, md, lg
})

const iconClasses = computed(() => {
  const classes = ['fa-solid']
  
  // Icon name with fa- prefix
  classes.push(`fa-${props.icon}`)
  
  // Size classes
  if (props.size === 'sm') classes.push('text-sm')
  else if (props.size === 'lg') classes.push('text-lg')
  
  return classes.join(' ')
})
</script>

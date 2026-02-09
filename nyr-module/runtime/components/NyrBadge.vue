<template>
  <span :class="badgeClasses">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  variant: { type: String, default: 'default' }, // default, primary, success, warning, danger, info
  size: { type: String, default: 'md' }, // sm, md, lg
  rounded: { type: Boolean, default: true }
})

const badgeClasses = computed(() => {
  const classes = ['nyr-badge']
  
  // Variant classes
  if (props.variant === 'primary') classes.push('badge-primary')
  else if (props.variant === 'success') classes.push('badge-success')
  else if (props.variant === 'warning') classes.push('badge-warning')
  else if (props.variant === 'danger') classes.push('badge-danger')
  else if (props.variant === 'info') classes.push('badge-info')
  else classes.push('badge-default')
  
  // Size classes
  if (props.size === 'sm') classes.push('badge-sm')
  else if (props.size === 'lg') classes.push('badge-lg')
  
  // Rounded
  if (props.rounded) classes.push('badge-rounded')
  
  return classes.join(' ')
})
</script>

<style scoped>
.nyr-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
}

.badge-rounded {
  border-radius: 20px;
}

/* Sizes */
.badge-sm {
  padding: 2px 8px;
  font-size: 11px;
}

.badge-lg {
  padding: 6px 16px;
  font-size: 14px;
}

/* Variants */
.badge-default {
  background-color: #f3f4f6;
  color: #374151;
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-info {
  background-color: #e0e7ff;
  color: #3730a3;
}
</style>

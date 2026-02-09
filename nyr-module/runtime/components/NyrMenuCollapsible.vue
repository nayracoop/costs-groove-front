<template>
  <div>
    <a href="#" @click.prevent="$emit('click')" :class="['nav-link', { 'active': active }]">
      <i :class="['fa-solid', icon, 'w-5 mr-2']"></i>
      <span v-if="isMenuExpanded">{{ label }}</span>
      <i v-if="isMenuExpanded" :class="['ml-auto text-xs fa-solid', active ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
    </a>
    <div v-if="active" class="bg-black/40 border-l-2 border-l-sage/70">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const isMenuExpanded = inject('isMenuExpanded')

defineProps({
  icon: {
    type: String,
    default: 'fa-folder'
  },
  label: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  color: #9d9ea2;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.nav-link i,
.nav-link span {
  color: inherit;
}

.nav-link:hover {
  background-color: rgba(64, 34, 16, 0.5);
  color: #f4ecdd;
}

.nav-link.active {
  background-color: #402210;
  color: #f4ecdd;
  border-right: 3px solid #b1bca2;
}
</style>

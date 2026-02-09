<template>
  <a @click.prevent="handleClick" :class="[levelClass, { 'active': active }]">
    <i v-if="icon" :class="['fa-solid', icon, 'w-5 mr-2']"></i>
    <span v-if="isMenuExpanded">{{ label }}</span>
  </a>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter } from '#imports'

const isMenuExpanded = inject('isMenuExpanded')
const router = useRouter()

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  level: {
    type: Number,
    default: 0
  },
  to: {
    type: String,
    default: ''
  }
})

const levelClass = computed(() => {
  return props.level === 0 ? 'nav-link' : 'sub-nav-link'
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
  if (props.to) {
    router.push(props.to)
  }
}
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
  cursor: pointer;
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

.sub-nav-link {
  display: flex;
  align-items: center;
  padding: 0.375rem 1.5rem;
  color: #9d9ea2;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.75rem;
  border-left: 2px solid transparent;
  cursor: pointer;
}

.sub-nav-link i,
.sub-nav-link span {
  color: inherit;
}

.sub-nav-link:hover {
  background-color: rgba(64, 34, 16, 0.3);
  color: #f4ecdd;
}

.sub-nav-link.active {
  color: #f4ecdd;
  background-color: rgba(64, 34, 16, 0.5);
  font-weight: 600;
  border-left-color: #b1bca2;
}
</style>

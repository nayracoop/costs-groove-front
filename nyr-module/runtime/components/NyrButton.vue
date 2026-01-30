<template>
  <div>
    <button
      :class="buttonClasses"
      @click="onClick"
      :disabled="disabled"
    >
      <slot />
    </button>
    <p v-if="hint" class="nyr-button-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from '#imports'

const props = defineProps({
  redirect: { type: String, default: '' },
  hint: { type: String, default: '' },
  variant: { type: String, default: 'primary' }, // primary, secondary, outline, ghost
  size: { type: String, default: 'md' }, // sm, md, lg
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
const router = useRouter()

const buttonClasses = computed(() => {
  const classes = ['nyr-button']
  
  // Variant classes
  if (props.variant === 'secondary') classes.push('btn-secondary')
  else if (props.variant === 'outline') classes.push('btn-outline')
  else if (props.variant === 'ghost') classes.push('btn-ghost')
  
  // Size classes
  if (props.size === 'sm') classes.push('btn-sm')
  else if (props.size === 'lg') classes.push('btn-lg')
  
  return classes.join(' ')
})

async function onClick(ev) {
  if (props.disabled) return
  emit('click', ev)
  if (props.redirect) {
    try { await router.push(props.redirect) } catch {}
  }
}
</script>

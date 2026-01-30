<template>
  <div
    class="nyr-card"
    :data-nyr-theme="theme"
    tabindex="0"
  >
    <slot />
    <div v-if="hint" class="nyr-card-hint">
      {{ hint }}
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
const props = defineProps({
  theme: { type: String, default: 'default' },
  hint: { type: String, default: '' }
})
</script>

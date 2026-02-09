<template>
  <div class="h-screen w-screen overflow-hidden bg-cream text-charcoal">
    <div class="flex h-full overflow-hidden">
      <Menu />
      <main class="flex-1 bg-cream flex flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>
        <footer class="bg-transparent text-gray-500 text-xs py-2 text-center flex-shrink-0">
          <span>version: {{ gitHash }} · cuenta: Viñedos "El Amanecer"</span>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Menu from '~/components/Menu.vue'

// Get git hash - in production this would come from build process
const gitHash = ref('a7f3c9e')
</script>

<style scoped>
:root {
  --nyr-olive: #6e634a;
  --nyr-cream: #f4ecdd;
  --nyr-charcoal: #21241e;
  --nyr-sage: #b1bca2;
  --nyr-stone: #9d9ea2;
  --nyr-cocoa: #402210;
}
</style>

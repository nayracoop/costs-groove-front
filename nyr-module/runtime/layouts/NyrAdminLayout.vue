<template>
  <div
    class="min-h-screen"
    :style="{
      backgroundColor: 'var(--nyr-bg)',
      color: 'var(--nyr-fg)'
    }"
  >
    <div class="w-full px-8 py-6">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

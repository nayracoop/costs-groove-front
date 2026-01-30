<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    }
  ]
})
</script>

<style>
:root {
  --nyr-olive: #6e634a;
  --nyr-cream: #f4ecdd;
  --nyr-charcoal: #21241e;
  --nyr-sage: #b1bca2;
  --nyr-stone: #9d9ea2;
  --nyr-cocoa: #402210;
}

body {
  margin: 0;
  padding: 0;
}
</style>

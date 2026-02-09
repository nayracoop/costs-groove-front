<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const diagramaName = ref('Diagrama')
</script>

<template>
	<div class="flex h-screen overflow-hidden">
		<Menu />
		<main class="flex-1 bg-cream overflow-y-auto">
			<div class="p-8">
				<div class="bg-white rounded-lg shadow-sm p-6">
					<h1 class="text-2xl font-semibold text-charcoal mb-6">{{ diagramaName }}</h1>
					
					<p class="text-gray-600">Contenido del diagrama...</p>
				</div>
			</div>
		</main>
	</div>
</template>

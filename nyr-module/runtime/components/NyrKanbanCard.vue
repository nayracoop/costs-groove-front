<template>
	<div
		:draggable="true"
		@dragstart="$emit('dragstart', $event)"
		@contextmenu.prevent="$emit('contextmenu', $event)"
		class="w-full h-full rounded-lg border-2 shadow-sm cursor-move hover:shadow-md transition-shadow"
		:class="[cardClasses, { 'nyr-card-selected': selected }]"
	>
		<div class="p-3 h-full flex flex-col">
			<div class="flex gap-2">
				<i :class="['fa-solid', icon, 'text-sm', 'flex-shrink-0', 'mt-0.5']"></i>
				<div class="flex-1 min-w-0">
					<span class="text-sm font-medium text-charcoal break-words leading-tight">{{ name || '...' }}</span>
				</div>
			</div>
			<!-- Tags (if provided) -->
			<div v-if="tags && tags.length" class="flex gap-1 mt-2 flex-wrap">
				<span
					v-for="tag in tags"
					:key="tag"
					class="text-xs px-2 py-0.5 rounded-full bg-black/10 text-charcoal"
				>
					{{ tag }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	type: { type: String, required: true },
	icon: { type: String, required: true },
	color: { type: String, default: 'default' },
	tags: { type: Array, default: () => [] },
	name: { type: String, default: '' },
	group: { type: String, default: '' },
	selected: { type: Boolean, default: false }
})

defineEmits(['dragstart', 'contextmenu'])

const cardClasses = computed(() => {
	const colorMap = {
		'Proceso': 'nyr-card-proceso',
		'Producto': 'nyr-card-producto',
		'Punto de Venta': 'nyr-card-venta',
		'Empresa': 'nyr-card-empresa',
		'Variable': 'nyr-card-variable',
		'Indicador': 'nyr-card-indicador',
		'default': 'nyr-card-default'
	}
	return colorMap[props.color] || colorMap['default']
})
</script>

<style scoped>
.nyr-card-proceso {
	background-color: #ede8db;
	border-color: var(--nyr-info);
}

.nyr-card-producto {
	background-color: #f5f0e8;
	border-color: var(--nyr-accent);
}

.nyr-card-venta {
	background-color: #e8ede3;
	border-color: var(--nyr-success);
}

.nyr-card-empresa {
	background-color: #e8eaed;
	border-color: var(--nyr-border);
}

.nyr-card-variable {
	background-color: #f0e8ed;
	border-color: #7d5c84;
}

.nyr-card-indicador {
	background-color: #e8f5e9;
	border-color: #4caf50;
}

.nyr-card-default {
	background-color: var(--nyr-surface);
	border-color: var(--nyr-border);
}

.nyr-card-selected {
	border-color: var(--nyr-accent);
	box-shadow: 0 0 0 2px var(--nyr-accent);
}
</style>

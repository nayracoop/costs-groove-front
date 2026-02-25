<template>
  <div
    :draggable="true"
    class="w-full h-full rounded-lg shadow-sm hover:shadow-md transition-all outline-none"
    :class="[cardClasses, { 'nyr-card-selected': selected }]"
    :style="{ cursor: cursorStyle }"
    @dragstart="$emit('dragstart', $event)"
    @contextmenu.prevent="$emit('contextmenu', $event)"
    @dblclick="$emit('dblclick', $event)"
  >
    <div class="p-1.5 h-full flex flex-col">
      <div class="flex gap-1.5 items-start">
        <i :class="['fa-solid', icon, 'text-xs', 'flex-shrink-0']" />
        <div class="flex-1 min-w-0">
          <span class="card-name">{{ name || '...' }}</span>
        </div>
      </div>
      <!-- Tags (if provided) -->
      <div
        v-if="tags && tags.length"
        class="flex gap-1 mt-1.5 flex-wrap"
      >
        <span
          v-for="tag in tags"
          :key="tag"
          class="text-[10px] px-1.5 py-1 rounded-full bg-black/10 text-charcoal"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, onMounted, onBeforeUnmount} from "vue";

const props = defineProps({
  type: {type: String, required: true},
  icon: {type: String, required: true},
  color: {type: String, default: "default"},
  tags: {type: Array, default: () => { return []; }},
  name: {type: String, default: ""},
  group: {type: String, default: ""},
  selected: {type: Boolean, default: false}
});

defineEmits(["dragstart", "contextmenu", "dblclick"]);

const isCtrlPressed = ref(false);

const cardClasses = computed(() => {
  const colorMap = {
    Proceso: "nyr-card-proceso",
    Producto: "nyr-card-producto",
    "Punto de Venta": "nyr-card-venta",
    Empresa: "nyr-card-empresa",
    Variable: "nyr-card-variable",
    Indicador: "nyr-card-indicador",
    default: "nyr-card-default"
  };
  return colorMap[props.color] || colorMap.default;
});

const cursorStyle = computed(() => {
  return isCtrlPressed.value ? "copy" : "move";
});

function handleKeyDown(e) {
  if (e.ctrlKey || e.metaKey) {
    isCtrlPressed.value = true;
  }
}

function handleKeyUp(e) {
  if (!e.ctrlKey && !e.metaKey) {
    isCtrlPressed.value = false;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});
</script>

<style scoped>
.card-name {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--nyr-text, #1a1a1a);
  word-break: break-word;
  line-height: 0.95;
}

.nyr-card-proceso {
  background-color: #ede8db;
}

.nyr-card-producto {
  background-color: #f5f0e8;
}

.nyr-card-venta {
  background-color: #e8ede3;
}

.nyr-card-empresa {
  background-color: #e8eaed;
}

.nyr-card-variable {
  background-color: #f0e8ed;
}

.nyr-card-indicador {
  background-color: #e8f5e9;
}

.nyr-card-default {
  background-color: var(--nyr-surface);
}

.nyr-card-selected {
  outline: 1px solid var(--nyr-accent);
  outline-offset: -1px;
}
</style>

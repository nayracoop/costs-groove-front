<template>
  <NyrModal
    v-model="isVisible"
    size="lg"
  >
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start gap-3 mb-6">
        <i :class="['fa-solid', icon, 'text-lg', 'mt-1']" />
        <h2 class="text-xl font-semibold text-charcoal flex-1">
          {{ name }}
        </h2>
        <button
          class="text-gray-400 hover:text-gray-600 p-1"
          type="button"
          @click="handleClose"
        >
          <i class="fa-solid fa-xmark text-xl" />
        </button>
      </div>

      <!-- Content area -->
      <div class="mb-6">
        <!-- Future content goes here -->
      </div>

      <!-- Footer buttons -->
      <div class="flex justify-end gap-3">
        <NyrButton
          variant="outline"
          @click="handleClose"
        >
          Cancelar
        </NyrButton>
        <NyrButton
          variant="primary"
          @click="handleSave"
        >
          Guardar
        </NyrButton>
      </div>
    </div>
  </NyrModal>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  visible: {type: Boolean, default: false},
  icon: {type: String, required: true},
  name: {type: String, required: true}
});

const emit = defineEmits(["close", "save"]);

const isVisible = computed({
  get: () => {
    return props.visible;
  },
  set: (value) => {
    if (!value) emit("close");
  }
});

function handleClose() {
  emit("close");
}

function handleSave() {
  emit("save");
  emit("close");
}
</script>

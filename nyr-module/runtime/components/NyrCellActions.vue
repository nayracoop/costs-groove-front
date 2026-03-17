<template>
  <div class="flex gap-2 justify-center">
    <button
      v-for="(action, index) in actions"
      :key="index"
      :class="getButtonClasses(action.variant)"
      :title="action.title"
      @click="action.onClick"
    >
      <nyr-icon
        :icon="action.icon"
        :size="action.size || 'sm'"
      />
    </button>
  </div>
</template>

<script setup>
defineProps({
  actions: {
    type: Array,
    required: true,
    validator: (actions) => {
      return actions.every((action) => {
        return action.icon &&
        action.title &&
        typeof action.onClick === "function";
      });
    }
  }
});

function getButtonClasses(variant = "primary") {
  const baseClasses = "transition-colors p-2";
  const variants = {
    primary: "text-blue-600 hover:text-blue-800",
    success: "text-green-600 hover:text-green-800",
    warning: "text-orange-600 hover:text-orange-800",
    danger: "text-red-600 hover:text-red-800",
    secondary: "text-gray-600 hover:text-gray-800"
  };

  return `${baseClasses} ${variants[variant] || variants.primary}`;
}
</script>

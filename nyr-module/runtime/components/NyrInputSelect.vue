<template>
  <div
    ref="rootRef"
    class="relative nyr-input-container"
  >
    <label
      v-if="label"
      class="nyr-input-label"
    >
      {{ label }}
    </label>

    <input
      :value="inputValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @focus="onFocus"
      @input="onInput"
      @keydown.down.prevent="onArrowDown"
      @keydown.up.prevent="onArrowUp"
      @keydown.enter.prevent="onEnter"
      @keydown.esc="closeDropdown"
    >

    <div
      v-if="showDropdown"
      class="mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-sm"
    >
      <button
        v-for="(option, index) in filteredOptions"
        :key="option.key"
        type="button"
        class="block w-full px-3 py-2 text-left text-sm text-charcoal hover:bg-gray-100"
        :class="index === highlightedIndex ? 'bg-gray-100' : ''"
        @mousedown.prevent="selectOption(option)"
        @mousemove="highlightedIndex = index"
      >
        {{ option.value }}
      </button>

      <div
        v-if="filteredOptions.length === 0"
        class="px-3 py-2 text-sm text-gray-500"
      >
        Sin coincidencias
      </div>
    </div>

    <p
      v-if="hint"
      class="nyr-input-hint"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = defineProps({
  label: {type: String, default: ""},
  modelValue: {type: String, default: ""},
  options: {type: Array, default: () => { return []; }},
  placeholder: {type: String, default: ""},
  hint: {type: String, default: ""},
  size: {type: String, default: "md"},
  state: {type: String, default: ""},
  disabled: {type: Boolean, default: false}
});

const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);

const rootRef = ref(null);
const inputValue = ref(props.modelValue || "");
const showDropdown = ref(false);
const highlightedIndex = ref(-1);

watch(() => {
  return props.modelValue;
}, (nextValue) => {
  inputValue.value = nextValue || "";
});

const inputClasses = computed(() => {
  const classes = ["nyr-input-field"];

  if (props.size === "sm") classes.push("input-sm");
  else if (props.size === "lg") classes.push("input-lg");

  if (props.state === "error") classes.push("input-error");
  else if (props.state === "success") classes.push("input-success");

  return classes.join(" ");
});

const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === "string") {
      return {key: option, value: option};
    }

    return {
      key: option.key,
      value: option.value
    };
  });
});

const filteredOptions = computed(() => {
  const query = inputValue.value.trim().toLowerCase();

  return normalizedOptions.value.filter((option) => {
    if (!query) return true;
    return String(option.value).toLowerCase().includes(query);
  });
});

function onFocus() {
  if (!props.disabled) {
    showDropdown.value = true;
    highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1;
  }
  emit("focus");
}

function onInput(event) {
  const value = event.target.value;
  inputValue.value = value;
  showDropdown.value = true;
  highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1;
  emit("update:modelValue", value);
  emit("change", value);
}

function selectOption(option) {
  inputValue.value = option.value;
  emit("update:modelValue", option.value);
  emit("change", option.value);
  showDropdown.value = false;
  highlightedIndex.value = -1;
}

function closeDropdown() {
  showDropdown.value = false;
  highlightedIndex.value = -1;
  emit("blur");
}

function onArrowDown() {
  if (!showDropdown.value) {
    showDropdown.value = true;
  }

  if (filteredOptions.value.length === 0) return;

  highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1);
}

function onArrowUp() {
  if (!showDropdown.value || filteredOptions.value.length === 0) return;
  highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
}

function onEnter() {
  if (!showDropdown.value || filteredOptions.value.length === 0) return;

  const targetIndex = highlightedIndex.value >= 0 ? highlightedIndex.value : 0;
  const option = filteredOptions.value[targetIndex];

  if (option) {
    selectOption(option);
  }
}

function handleOutsideClick(event) {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(event.target)) {
    closeDropdown();
  }
}

onMounted(() => {
  window.addEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousedown", handleOutsideClick);
});
</script>

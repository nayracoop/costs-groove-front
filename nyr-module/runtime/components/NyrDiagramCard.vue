<template>
  <div
    class="relative h-full w-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
    :class="[
      isComment ? 'border-dashed bg-orange-50' : 'select-none',
      isComment && !isEditingComment ? 'cursor-pointer' : ''
    ]"
    @mousedown="onDragStart"
  >
    <button
      v-for="port in inputPorts"
      :key="`in-${port.id}`"
      type="button"
      class="absolute h-3 w-3 rounded-full border border-blue-600 bg-white"
      :class="getPortClass(port.side)"
      :style="getPortStyle(port.side, port.index, port.count, 'inputs')"
      @mouseup.stop.prevent="emitInput(port)"
    />

    <button
      v-for="port in outputPorts"
      :key="`out-${port.id}`"
      type="button"
      class="absolute h-3 w-3 rounded-full border border-green-600 bg-green-600"
      :class="getPortClass(port.side)"
      :style="getPortStyle(port.side, port.index, port.count, 'outputs')"
      @mousedown.stop.prevent="emitOutput(port)"
    />

    <div class="flex h-full flex-col">
      <div
        v-if="!isComment"
        class="mb-2 flex items-start gap-2"
      >
        <i
          v-if="card.icon"
          :class="['fa-solid', card.icon, 'mt-0.5 text-sm text-gray-600']"
        />
        <div class="min-w-0 text-sm font-medium text-charcoal">
          {{ card.name }}
        </div>
      </div>

      <div
        v-if="!isComment"
        class="relative mb-2 flex-1"
      >
        <div
          v-for="row in inputPortRows"
          :key="row.id"
          class="absolute left-0 right-0 flex -translate-y-1/2 items-center gap-1"
          :style="getLabelRowStyle('inputs', row.index, row.count)"
        >
          <span class="h-2 w-2 shrink-0 rounded-full border border-blue-600 bg-white" />
          <span class="min-w-1 flex-1 truncate text-[11px] leading-4 text-blue-700 ">{{ row.label || "\u00A0" }}</span>
        </div>

        <div class="absolute left-0 right-0 top-1/2 border-t border-dashed border-gray-300" />

        <div
          v-for="row in outputPortRows"
          :key="row.id"
          class="absolute left-0 right-0 flex -translate-y-1/2 items-center gap-1"
          :style="getLabelRowStyle('outputs', row.index, row.count)"
        >
          <span class="h-2 w-2 shrink-0 rounded-full border border-green-600 bg-green-600" />
          <span class="min-w-0 flex-1 truncate text-[11px] leading-4 text-green-700">{{ row.label || "\u00A0" }}</span>
        </div>
      </div>

      <div
        v-if="isComment"
        class="h-full"
      >
        <textarea
          v-if="isEditingComment"
          ref="commentTextareaRef"
          :value="card.name"
          class="h-full w-full resize-none select-text rounded-md border border-orange-200 bg-white p-2 text-sm text-charcoal
            focus:border-orange-500 focus:outline-none"
          placeholder="Comentario..."
          rows="3"
          @blur="finishCommentEdit"
          @keydown.esc.prevent="finishCommentEdit"
          @input="onCommentInput"
        />
        <div
          v-else
          class="h-full w-full whitespace-pre-wrap rounded-md border border-orange-200 bg-white p-2 text-sm text-charcoal"
          @dblclick.stop="startCommentEdit"
        >
          {{ card.name || "Doble clic para editar comentario..." }}
        </div>
      </div>

      <div
        v-if="showTypeLabel"
        class="mt-auto text-xs text-gray-500"
      >
        {{ card.type }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, ref, watch} from "vue";

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
});

const emit = defineEmits([
  "drag-start",
  "start-connect",
  "finish-connect",
  "update-comment"
]);

const isComment = computed(() => {
  return props.card.type === "Comentario";
});

const showTypeLabel = computed(() => {
  return !isComment.value && props.card.type !== "Proceso";
});

const isEditingComment = ref(false);
const commentTextareaRef = ref(null);

watch(() => {
  return props.card.id;
}, () => {
  isEditingComment.value = false;
});

function normalizePorts(rawPorts, legacyMap, prefix) {
  if (Array.isArray(rawPorts)) {
    return rawPorts.map((port, index) => {
      return {
        id: port.id || `${prefix}-${index}`,
        side: port.side || "l"
      };
    });
  }

  const ports = [];
  if (!legacyMap) return ports;

  ["t", "r", "b", "l"].forEach((side) => {
    if (legacyMap[side]) {
      ports.push({
        id: `${prefix}-${side}-0`,
        side
      });
    }
  });

  return ports;
}

function withPortOrder(ports) {
  const grouped = {
    t: [],
    r: [],
    b: [],
    l: []
  };

  ports.forEach((port) => {
    grouped[port.side]?.push(port);
  });

  return ports.map((port) => {
    const sidePorts = grouped[port.side] || [];
    const index = sidePorts.findIndex((item) => {
      return item.id === port.id;
    });

    return {
      ...port,
      index,
      count: sidePorts.length
    };
  });
}

const inputPorts = computed(() => {
  if (isComment.value) return [];

  const ports = normalizePorts(props.card.inputs, props.card.inputs, `in-${props.card.id}`);
  return withPortOrder(ports);
});

const outputPorts = computed(() => {
  if (isComment.value) return [];

  const ports = normalizePorts(props.card.outputs, props.card.outputs, `out-${props.card.id}`);
  return withPortOrder(ports);
});

function normalizeProductLabels(rawProducts) {
  if (Array.isArray(rawProducts)) {
    return rawProducts.map((item) => {
      return typeof item === "string" ? item.trim() : "";
    });
  }

  if (typeof rawProducts === "string") {
    return [rawProducts.trim()];
  }

  return [];
}

function buildPortRows(ports, labels, prefix) {
  const rowCount = Math.max(ports.length, labels.length);
  if (rowCount === 0) return [];

  return Array.from({length: rowCount}, (_item, index) => {
    return {
      id: ports[index]?.id || `${prefix}-${props.card.id}-${index}`,
      index,
      count: rowCount,
      label: labels[index] || ""
    };
  });
}

const inputProductLabels = computed(() => {
  const products = props.card.inputProducts;
  return normalizeProductLabels(products);
});

const outputProductLabels = computed(() => {
  const products = props.card.outputProducts;
  return normalizeProductLabels(products);
});

const inputPortRows = computed(() => {
  return buildPortRows(inputPorts.value, inputProductLabels.value, "input");
});

const outputPortRows = computed(() => {
  return buildPortRows(outputPorts.value, outputProductLabels.value, "output");
});

function getPortClass(side) {
  if (side === "l") {
    return "-left-1.5 -translate-y-1/2";
  }

  if (side === "r") {
    return "-right-1.5 -translate-y-1/2";
  }

  if (side === "t") {
    return "-top-1.5 -translate-x-1/2";
  }

  return "-bottom-1.5 -translate-x-1/2";
}

function getVerticalPercent(type, index, count) {
  const safeCount = Math.max(count, 1);
  const localRatio = (index + 1) / (safeCount + 1);
  const dividerRatio = 0.5;
  const sectionSpread = 1.5;
  const halfStart = type === "inputs" ? 0 : dividerRatio;
  const halfSize = dividerRatio;
  const innerSize = halfSize * sectionSpread;
  const innerOffset = (halfSize - innerSize) / 2;

  return (halfStart + innerOffset + localRatio * innerSize) * 100;
}

function getPortStyle(side, index, count, type) {
  if (side === "l" || side === "r") {
    return {
      top: `${getVerticalPercent(type, index, count)}%`
    };
  }

  const safeCount = Math.max(count, 1);
  const percent = ((index + 1) / (safeCount + 1)) * 100;

  return {
    left: `${percent}%`
  };
}

function getLabelRowStyle(type, index, count) {
  return {
    top: `${getVerticalPercent(type, index, count)}%`
  };
}

function emitOutput(port) {
  emit("start-connect", {cardId: props.card.id, portId: port.id, side: port.side});
}

function emitInput(port) {
  emit("finish-connect", {cardId: props.card.id, portId: port.id, side: port.side});
}

function onCommentInput(event) {
  emit("update-comment", {cardId: props.card.id, name: event.target.value});
}

function onDragStart(event) {
  const targetTag = event.target?.tagName?.toLowerCase();
  if (isEditingComment.value) return;
  if (targetTag === "button" || targetTag === "textarea") return;

  emit("drag-start", event, props.card.id);
}

async function startCommentEdit() {
  if (!isComment.value) return;
  isEditingComment.value = true;
  await nextTick();
  commentTextareaRef.value?.focus();
}

function finishCommentEdit() {
  isEditingComment.value = false;
}
</script>

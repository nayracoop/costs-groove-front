<template>
  <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <div class="mb-3 flex items-center gap-2">
      <button
        type="button"
        class="rounded-md border px-3 py-1.5 text-xs font-medium"
        :class="snapToGrid ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700'"
        @click="toggleSnapToGrid"
      >
        Snap: {{ snapToGrid ? "ON" : "OFF" }}
      </button>

      <button
        type="button"
        class="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700"
        title="Agregar proceso"
        @click="openProcesoModal"
      >
        <nyr-icon
          icon="gears"
          size="sm"
        />
      </button>

      <button
        type="button"
        class="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700"
        title="Agregar canal de venta"
      >
        <nyr-icon
          icon="shop"
          size="sm"
        />
      </button>

      <button
        type="button"
        class="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700"
        title="Agregar comentario"
        @click="addCommentCard"
      >
        <nyr-icon
          icon="comment"
          size="sm"
        />
      </button>

      <div class="ml-auto flex items-center gap-2">
        <button
          type="button"
          class="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium"
          :class="[
            'border-gray-300 bg-white text-gray-700',
            'disabled:cursor-not-allowed disabled:opacity-50'
          ]"
          title="Alejar"
          :disabled="!canZoomOut"
          @click="zoomOut"
        >
          <nyr-icon
            icon="minus"
            size="sm"
          />
        </button>

        <span class="min-w-14 text-center text-xs font-medium text-gray-600">
          {{ zoomLabel }}
        </span>

        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          title="Restablecer zoom"
          :disabled="isDefaultZoom"
          @click="resetZoom"
        >
          100%
        </button>

        <button
          type="button"
          class="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium"
          :class="[
            'border-gray-300 bg-white text-gray-700',
            'disabled:cursor-not-allowed disabled:opacity-50'
          ]"
          title="Acercar"
          :disabled="!canZoomIn"
          @click="zoomIn"
        >
          <nyr-icon
            icon="plus"
            size="sm"
          />
        </button>
      </div>
    </div>

    <div class="overflow-auto">
      <div
        class="relative"
        :style="canvasContainerStyle"
      >
        <div
          ref="canvasRef"
          class="relative nyr-diagram-canvas"
          :style="canvasStyle"
          @click="onCanvasClick"
          @mousemove="onCanvasMouseMove"
        >
          <div
            class="absolute inset-0 origin-top-left"
            :style="canvasZoomStyle"
          >
            <svg
              class="absolute inset-0 z-10"
              :width="canvasWidth"
              :height="canvasHeight"
            >
              <g
                v-for="connection in renderedConnections"
                :key="connection.id"
              >
                <path
                  :d="connection.path"
                  class="fill-none"
                  :class="selectedConnectionId === connection.id ? 'stroke-red-500' : 'stroke-gray-500'"
                  stroke-width="2"
                />
                <path
                  :d="connection.path"
                  class="cursor-pointer fill-none stroke-transparent"
                  stroke-width="12"
                  @click.stop="selectConnection(connection.id)"
                />
                <polygon
                  :points="connection.arrowPoints"
                  :class="selectedConnectionId === connection.id ? 'fill-red-500' : 'fill-gray-500'"
                />
              </g>

              <path
                v-if="pendingPreviewPath"
                :d="pendingPreviewPath"
                class="fill-none stroke-blue-500"
                stroke-dasharray="6 4"
                stroke-width="2"
              />
            </svg>

            <div class="relative z-20 h-full w-full pointer-events-none">
              <div
                v-for="card in localCards"
                :key="card.id"
                class="absolute pointer-events-auto rounded-lg"
                :class="selectedCardId === card.id ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-gray-50' : ''"
                :style="getCardStyle(card)"
                @mousedown.capture="onCardMouseDown($event, card.id)"
                @contextmenu.prevent.stop="onCardContextMenu($event, card.id)"
                @dblclick.stop="onCardDoubleClick(card.id)"
              >
                <NyrDiagramCard
                  :card="card"
                  @drag-start="onCardDragStart"
                  @start-connect="onStartConnect"
                  @finish-connect="onFinishConnect"
                  @update-comment="onUpdateComment"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="contextMenu.visible"
      ref="contextMenuRef"
      class="fixed z-[60] min-w-36 rounded-md border border-gray-200 bg-white p-1 shadow-sm"
      :style="contextMenuStyle"
    >
      <button
        type="button"
        class="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        @click="onContextMenuAction('open')"
      >
        Open
      </button>
      <button
        type="button"
        class="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        @click="onContextMenuAction('duplicate')"
      >
        Duplicate
      </button>
      <button
        type="button"
        class="block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        @click="onContextMenuAction('remove')"
      >
        Remove
      </button>
    </div>

    <nyr-modal
      v-model="showProcesoModal"
      size="md"
      :close-on-backdrop="true"
    >
      <div class="p-6">
        <h3 class="mb-4 text-lg font-semibold text-charcoal">
          {{ isEditingProceso ? "Editar proceso" : "Agregar proceso" }}
        </h3>

        <div class="space-y-4">
          <NyrInputSelect
            v-model="selectedProcesoName"
            size="sm"
            label="Proceso"
            placeholder="Escribir o seleccionar proceso"
            :options="procesoOptions"
          />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <nyr-select
              v-model="insumosCount"
              size="sm"
              label="Insumos intermedios (in)"
              placeholder="Seleccionar"
              :options="ioCountOptions"
            />

            <nyr-select
              v-model="productosCount"
              size="sm"
              label="Productos intermedios (out)"
              placeholder="Seleccionar"
              :options="ioCountOptions"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <nyr-button
            variant="secondary"
            @click="onCancelProcesoModal"
          >
            Cancelar
          </nyr-button>
          <nyr-button
            variant="primary"
            @click="onAcceptProcesoModal"
          >
            Aceptar
          </nyr-button>
        </div>
      </div>
    </nyr-modal>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import NyrDiagramCard from "./NyrDiagramCard.vue";
import NyrInputSelect from "./NyrInputSelect.vue";
import {DIAGRAM_LAYOUT_CONSTANTS} from "../composables/useDiagramLayoutConstants";

const GRID_CELL_WIDTH = 55;
const GRID_CELL_HEIGHT = 62;
const CARD_WIDTH = 208;
const CARD_HEIGHT = DIAGRAM_LAYOUT_CONSTANTS.cardHeight;
const PORT_ROW_GAP = DIAGRAM_LAYOUT_CONSTANTS.portRowGap;
const HALF_SECTION_PADDING = DIAGRAM_LAYOUT_CONSTANTS.halfSectionPadding;
const CARD_OFFSET_X = 6;
const CARD_OFFSET_Y = 6;
const ARROW_GAP = 10;
const SNAP_STEP = 20;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.1;

const props = defineProps({
  cards: {
    type: Array,
    required: true
  },
  connections: {
    type: Array,
    default: () => { return []; }
  },
  cols: {
    type: Number,
    default: 8
  },
  rows: {
    type: Number,
    default: 6
  }
});

const emit = defineEmits([
  "update:cards",
  "update:connections",
  "card-select",
  "card-context-action"
]);

const localCards = ref([...props.cards]);
const localConnections = ref([...props.connections]);
const canvasRef = ref(null);
const pendingConnection = ref(null);
const pendingPointer = ref({x: 0, y: 0});
const selectedConnectionId = ref(null);
const selectedCardId = ref(null);
const contextMenuRef = ref(null);
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  cardId: null
});
const dragState = ref(null);
const snapToGrid = ref(true);
const zoomLevel = ref(1);
const previousUserSelect = ref("");
const showProcesoModal = ref(false);
const editingProcesoCardId = ref(null);
const selectedProcesoName = ref("");
const insumosCount = ref("0");
const productosCount = ref("0");

const DEFAULT_PROCESO_OPTIONS = [
  "Recepción",
  "Triturado",
  "Fermentación",
  "Clarificación",
  "Ensamble",
  "Crianza",
  "Embotellado"
];

watch(() => {
  return props.cards;
}, (nextCards) => {
  localCards.value = [...nextCards];
}, {deep: true});

watch(() => {
  return props.connections;
}, (nextConnections) => {
  localConnections.value = [...nextConnections];
}, {deep: true});

const canvasWidth = computed(() => {
  return props.cols * GRID_CELL_WIDTH;
});

const canvasHeight = computed(() => {
  return props.rows * GRID_CELL_HEIGHT;
});

const canvasStyle = computed(() => {
  return {
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`
  };
});

const canvasContainerStyle = computed(() => {
  return {
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`
  };
});

const canvasZoomStyle = computed(() => {
  return {
    transform: `scale(${zoomLevel.value})`
  };
});

const zoomLabel = computed(() => {
  return `${Math.round(zoomLevel.value * 100)}%`;
});

const canZoomIn = computed(() => {
  return zoomLevel.value < ZOOM_MAX;
});

const canZoomOut = computed(() => {
  return zoomLevel.value > ZOOM_MIN;
});

const isDefaultZoom = computed(() => {
  return zoomLevel.value === 1;
});

const procesoOptions = computed(() => {
  const processNamesFromCards = localCards.value
    .filter((card) => {
      return card.type === "Proceso" && typeof card.name === "string";
    })
    .map((card) => {
      return card.name.trim();
    })
    .filter((name) => {
      return Boolean(name);
    });

  const uniqueNames = Array.from(new Set([...DEFAULT_PROCESO_OPTIONS, ...processNamesFromCards]));

  return uniqueNames.map((name) => {
    return {
      key: name,
      value: name
    };
  });
});

const ioCountOptions = computed(() => {
  return Array.from({length: 11}, (_item, index) => {
    const value = String(index);
    return {
      key: value,
      value
    };
  });
});

const contextMenuStyle = computed(() => {
  return {
    left: `${contextMenu.value.x}px`,
    top: `${contextMenu.value.y}px`
  };
});

const isEditingProceso = computed(() => {
  return typeof editingProcesoCardId.value === "number";
});

function getCardPosition(card) {
  if (typeof card.x === "number" && typeof card.y === "number") {
    return {
      left: card.x,
      top: card.y
    };
  }

  return {
    left: card.gridCol * GRID_CELL_WIDTH + CARD_OFFSET_X,
    top: card.gridRow * GRID_CELL_HEIGHT + CARD_OFFSET_Y
  };
}

function normalizeListLength(rawValue) {
  if (Array.isArray(rawValue)) return rawValue.length;
  if (typeof rawValue === "string" && rawValue.trim()) return 1;
  return 0;
}

function getCardSideRowCount(card, side) {
  const portsCount = normalizeListLength(side === "inputs" ? card.inputs : card.outputs);
  const labelsCount = normalizeListLength(side === "inputs" ? card.inputProducts : card.outputProducts);
  return Math.max(portsCount, labelsCount);
}

function getMinCardHeightForLabels(card) {
  if (card?.type === "Comentario") {
    return CARD_HEIGHT;
  }

  const inputRows = getCardSideRowCount(card, "inputs");
  const outputRows = getCardSideRowCount(card, "outputs");
  const maxHalfRows = Math.max(inputRows, outputRows, 1);

  const halfNeeded = HALF_SECTION_PADDING * 2 + (maxHalfRows - 1) * PORT_ROW_GAP;
  const minHeightFromRows = Math.ceil(halfNeeded * 2);
  return Math.max(CARD_HEIGHT, minHeightFromRows);
}

function getCardDimensions(card) {
  const minDynamicHeight = getMinCardHeightForLabels(card);
  const baseHeight = typeof card.height === "number" ? card.height : CARD_HEIGHT;

  return {
    width: typeof card.width === "number" ? card.width : CARD_WIDTH,
    height: Math.max(baseHeight, minDynamicHeight)
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function snapToStep(value, step, base) {
  return Math.round((value - base) / step) * step + base;
}

function getVerticalPortRatio(type, index, count, cardHeight) {
  const safeCount = Math.max(count, 1);
  const safeHeight = Math.max(cardHeight, 1);
  const halfHeight = safeHeight / 2;
  const sectionStart = (type === "inputs" ? 0 : halfHeight) + HALF_SECTION_PADDING;
  const sectionEnd = (type === "inputs" ? halfHeight : safeHeight) - HALF_SECTION_PADDING;
  const sectionSize = Math.max(sectionEnd - sectionStart, 0);
  const usedSpan = (safeCount - 1) * PORT_ROW_GAP;
  const initialOffset = Math.max((sectionSize - usedSpan) / 2, 0);
  const y = sectionStart + initialOffset + index * PORT_ROW_GAP;

  return y / safeHeight;
}

function getCanvasPointer(event, clampToCanvas = false) {
  const canvasEl = canvasRef.value;
  if (!canvasEl) return null;

  const rect = canvasEl.getBoundingClientRect();
  const x = (event.clientX - rect.left) / zoomLevel.value;
  const y = (event.clientY - rect.top) / zoomLevel.value;

  if (!clampToCanvas) {
    return {x, y};
  }

  return {
    x: clamp(x, 0, canvasWidth.value),
    y: clamp(y, 0, canvasHeight.value)
  };
}

function onCardDragStart(event, cardId) {
  const card = localCards.value.find((item) => {
    return item.id === cardId;
  });
  const pointer = getCanvasPointer(event);
  if (!pointer || !card) return;

  const position = getCardPosition(card);

  dragState.value = {
    cardId,
    offsetX: pointer.x - position.left,
    offsetY: pointer.y - position.top
  };

  previousUserSelect.value = document.body.style.userSelect || "";
  document.body.style.userSelect = "none";
}

function moveCardToFreePosition(cardId, x, y, emitUpdate) {
  const movingCard = localCards.value.find((card) => {
    return card.id === cardId;
  });
  if (!movingCard) return;

  const dimensions = getCardDimensions(movingCard);
  const boundedX = clamp(x, CARD_OFFSET_X, canvasWidth.value - dimensions.width - CARD_OFFSET_X);
  const boundedY = clamp(y, CARD_OFFSET_Y, canvasHeight.value - dimensions.height - CARD_OFFSET_Y);

  const nextCards = localCards.value.map((card) => {
    if (card.id === cardId) {
      const gridCol = clamp(Math.round((boundedX - CARD_OFFSET_X) / GRID_CELL_WIDTH), 0, props.cols - 1);
      const gridRow = clamp(Math.round((boundedY - CARD_OFFSET_Y) / GRID_CELL_HEIGHT), 0, props.rows - 1);
      return {
        ...card,
        x: boundedX,
        y: boundedY,
        gridCol,
        gridRow
      };
    }

    return card;
  });

  localCards.value = nextCards;
  if (emitUpdate) {
    emit("update:cards", nextCards);
  }
}

function onGlobalMouseMove(event) {
  if (!dragState.value) return;
  const pointer = getCanvasPointer(event);
  if (!pointer) return;

  const rawX = pointer.x - dragState.value.offsetX - CARD_OFFSET_X;
  const rawY = pointer.y - dragState.value.offsetY - CARD_OFFSET_Y;

  let freeX = rawX + CARD_OFFSET_X;
  let freeY = rawY + CARD_OFFSET_Y;

  if (snapToGrid.value) {
    freeX = snapToStep(freeX, SNAP_STEP, CARD_OFFSET_X);
    freeY = snapToStep(freeY, SNAP_STEP, CARD_OFFSET_Y);
  }

  moveCardToFreePosition(dragState.value.cardId, freeX, freeY, false);
}

function onGlobalMouseUp() {
  if (dragState.value) {
    const card = localCards.value.find((item) => {
      return item.id === dragState.value.cardId;
    });

    if (card) {
      const position = getCardPosition(card);
      let finalX = position.left;
      let finalY = position.top;

      if (snapToGrid.value) {
        finalX = snapToStep(finalX, SNAP_STEP, CARD_OFFSET_X);
        finalY = snapToStep(finalY, SNAP_STEP, CARD_OFFSET_Y);
      }

      moveCardToFreePosition(dragState.value.cardId, finalX, finalY, true);
    }

    document.body.style.userSelect = previousUserSelect.value;
    dragState.value = null;
  }

  // Drag-to-connect: if mouse is released outside an input port, cancel the pending wire.
  if (pendingConnection.value) {
    pendingConnection.value = null;
  }
}

function onStartConnect(payload) {
  pendingConnection.value = payload;

  const fromCard = localCards.value.find((card) => {
    return card.id === payload.cardId;
  });
  if (!fromCard) return;

  const dimensions = getCardDimensions(fromCard);
  const cardPosition = getCardPosition(fromCard);
  const outputPorts = Array.isArray(fromCard.outputs) ?
    fromCard.outputs.map((port, index) => {
      return {
        id: port.id || `outputs-${fromCard.id}-${index}`,
        side: port.side || "r"
      };
    }) :
    [];
  const targetPort = outputPorts.find((item) => {
    return item.id === payload.portId;
  }) || outputPorts.find((item) => {
    return item.side === payload.side;
  }) || outputPorts[0];

  if (!targetPort) return;

  const sidePorts = outputPorts.filter((item) => {
    return item.side === targetPort.side;
  });
  const count = Math.max(sidePorts.length, 1);
  const index = Math.max(sidePorts.findIndex((item) => {
    return item.id === targetPort.id;
  }), 0);
  const ratio = (index + 1) / (count + 1);
  const verticalRatio = getVerticalPortRatio("outputs", index, count, dimensions.height);

  let x = cardPosition.left + dimensions.width;
  let y = cardPosition.top + dimensions.height * verticalRatio;

  if (targetPort.side === "l") {
    x = cardPosition.left;
  }

  if (targetPort.side === "t") {
    x = cardPosition.left + dimensions.width * ratio;
    y = cardPosition.top;
  }

  if (targetPort.side === "b") {
    x = cardPosition.left + dimensions.width * ratio;
    y = cardPosition.top + dimensions.height;
  }

  pendingPointer.value = {x, y};
}

function onFinishConnect(payload) {
  if (!pendingConnection.value) return;

  const duplicate = localConnections.value.find((connection) => {
    return connection.from.cardId === pendingConnection.value.cardId &&
      connection.from.portId === pendingConnection.value.portId &&
      connection.to.cardId === payload.cardId &&
      connection.to.portId === payload.portId;
  });

  if (duplicate) {
    selectedConnectionId.value = duplicate.id;
    pendingConnection.value = null;
    return;
  }

  const newConnectionId = Date.now() + Math.floor(Math.random() * 1000);
  const nextConnection = {
    id: newConnectionId,
    from: {
      cardId: pendingConnection.value.cardId,
      portId: pendingConnection.value.portId,
      side: pendingConnection.value.side
    },
    to: {
      cardId: payload.cardId,
      portId: payload.portId,
      side: payload.side
    }
  };

  localConnections.value = [...localConnections.value, nextConnection];
  pendingConnection.value = null;
  selectedConnectionId.value = newConnectionId;
  emit("update:connections", localConnections.value);
}

function onUpdateComment(payload) {
  const nextCards = localCards.value.map((card) => {
    if (card.id === payload.cardId) {
      return {
        ...card,
        name: payload.name
      };
    }
    return card;
  });

  localCards.value = nextCards;
  emit("update:cards", nextCards);
}

function getCardById(id) {
  return localCards.value.find((card) => {
    return card.id === id;
  });
}

function closeContextMenu() {
  contextMenu.value.visible = false;
}

function resetProcesoModalForm() {
  editingProcesoCardId.value = null;
  selectedProcesoName.value = "";
  insumosCount.value = "0";
  productosCount.value = "0";
}

function openProcesoModal(card = null) {
  if (card && card.type === "Proceso") {
    editingProcesoCardId.value = card.id;
    selectedProcesoName.value = card.name || "";
    insumosCount.value = String(Array.isArray(card.inputs) ? card.inputs.length : 0);
    productosCount.value = String(Array.isArray(card.outputs) ? card.outputs.length : 0);
  } else {
    resetProcesoModalForm();
  }

  showProcesoModal.value = true;
}

function onCanvasClick() {
  selectedConnectionId.value = null;
  selectedCardId.value = null;
  closeContextMenu();
}

function onCanvasMouseMove(event) {
  if (!pendingConnection.value) return;
  const pointer = getCanvasPointer(event, true);
  if (!pointer) return;

  pendingPointer.value = pointer;
}

function selectConnection(connectionId) {
  selectedConnectionId.value = connectionId;
  closeContextMenu();
}

function onCardMouseDown(event, cardId) {
  if (event.button !== 0) return;
  selectedCardId.value = cardId;
  emit("card-select", {
    cardId,
    card: getCardById(cardId)
  });
  closeContextMenu();
}

function onCardContextMenu(event, cardId) {
  selectedCardId.value = cardId;
  emit("card-select", {
    cardId,
    card: getCardById(cardId)
  });

  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    cardId
  };
}

function onCardDoubleClick(cardId) {
  const card = getCardById(cardId);
  if (!card || card.type !== "Proceso") return;

  selectedCardId.value = cardId;
  openProcesoModal(card);
  emit("card-context-action", {
    action: "open",
    cardId,
    card
  });
}

function onContextMenuAction(action) {
  if (!contextMenu.value.cardId) return;

  const cardId = contextMenu.value.cardId;
  const card = getCardById(cardId);

  if (action === "open" && card?.type === "Proceso") {
    openProcesoModal(card);
  }

  emit("card-context-action", {
    action,
    cardId,
    card
  });

  closeContextMenu();
}

function isDeleteKey(event) {
  const key = String(event.key || "").toLowerCase();
  const code = String(event.code || "").toLowerCase();

  if (key === "delete" || key === "backspace" || key === "del" || key === "supr" || key === "suppr") {
    return true;
  }

  if (code === "delete" || code === "numpaddelete") {
    return true;
  }

  if (event.keyCode === 46 || event.which === 46) {
    return true;
  }

  return false;
}

function handleDeleteConnection(event) {
  if (!selectedConnectionId.value) return;
  if (!isDeleteKey(event)) return;

  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (activeTag === "input" || activeTag === "textarea") return;

  const nextConnections = localConnections.value.filter((connection) => {
    return connection.id !== selectedConnectionId.value;
  });

  localConnections.value = nextConnections;
  selectedConnectionId.value = null;
  emit("update:connections", nextConnections);
}

function handleGlobalPointerDown(event) {
  if (!contextMenu.value.visible) return;

  const menuEl = contextMenuRef.value;
  if (menuEl && menuEl.contains(event.target)) return;

  closeContextMenu();
}

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

function getOrderedPorts(card, type) {
  const rawPorts = type === "inputs" ? card.inputs : card.outputs;
  const ports = normalizePorts(rawPorts, rawPorts, `${type}-${card.id}`);

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
      count: Math.max(sidePorts.length, 1)
    };
  });
}

function getPortPosition(card, type, portId, fallbackSide) {
  const ports = getOrderedPorts(card, type);
  const port = ports.find((item) => {
    return item.id === portId;
  }) || ports.find((item) => {
    return item.side === fallbackSide;
  }) || ports[0];

  if (!port) {
    return null;
  }

  const cardPosition = getCardPosition(card);
  const dimensions = getCardDimensions(card);
  const cardX = cardPosition.left;
  const cardY = cardPosition.top;
  const ratio = (port.index + 1) / (port.count + 1);
  const verticalRatio = getVerticalPortRatio(type, port.index, port.count, dimensions.height);

  if (port.side === "l") {
    return {
      x: cardX,
      y: cardY + dimensions.height * verticalRatio
    };
  }

  if (port.side === "r") {
    return {
      x: cardX + dimensions.width,
      y: cardY + dimensions.height * verticalRatio
    };
  }

  if (port.side === "t") {
    return {
      x: cardX + dimensions.width * ratio,
      y: cardY
    };
  }

  return {
    x: cardX + dimensions.width * ratio,
    y: cardY + dimensions.height
  };
}

function getRenderedConnection(connection) {
  const fromCard = getCardById(connection.from.cardId);
  const toCard = getCardById(connection.to.cardId);
  if (!fromCard || !toCard) return null;

  const start = getPortPosition(fromCard, "outputs", connection.from.portId, connection.from.side);
  const end = getPortPosition(toCard, "inputs", connection.to.portId, connection.to.side);
  if (!start || !end) return null;

  const curve = Math.max(30, Math.abs(end.x - start.x) * 0.4);

  const c1x = start.x + (connection.from.side === "r" ? curve : -curve);
  const c2x = end.x + (connection.to.side === "l" ? -curve : curve);
  const c1 = {x: c1x, y: start.y};
  const c2 = {x: c2x, y: end.y};
  const tangent = {
    x: end.x - c2.x,
    y: end.y - c2.y
  };
  const norm = Math.hypot(tangent.x, tangent.y) || 1;
  const ux = tangent.x / norm;
  const uy = tangent.y / norm;

  const wireEnd = {
    x: end.x - ux * ARROW_GAP,
    y: end.y - uy * ARROW_GAP
  };

  const path = `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${wireEnd.x} ${wireEnd.y}`;

  const arrowLength = 10;
  const arrowWidth = 4;
  const baseX = end.x - ux * arrowLength;
  const baseY = end.y - uy * arrowLength;
  const px = -uy;
  const py = ux;

  const p1 = `${end.x},${end.y}`;
  const p2 = `${baseX + px * arrowWidth},${baseY + py * arrowWidth}`;
  const p3 = `${baseX - px * arrowWidth},${baseY - py * arrowWidth}`;

  return {
    id: connection.id,
    path,
    arrowPoints: `${p1} ${p2} ${p3}`
  };
}

function getCardStyle(card) {
  const position = getCardPosition(card);
  const dimensions = getCardDimensions(card);

  return {
    left: `${position.left}px`,
    top: `${position.top}px`,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`
  };
}

function toggleSnapToGrid() {
  const nextSnapValue = !snapToGrid.value;
  snapToGrid.value = nextSnapValue;

  if (nextSnapValue) {
    const nextCards = localCards.value.map((card) => {
      const currentPosition = getCardPosition(card);
      const nextX = snapToStep(currentPosition.left, SNAP_STEP, CARD_OFFSET_X);
      const nextY = snapToStep(currentPosition.top, SNAP_STEP, CARD_OFFSET_Y);
      const gridCol = clamp(Math.round((nextX - CARD_OFFSET_X) / GRID_CELL_WIDTH), 0, props.cols - 1);
      const gridRow = clamp(Math.round((nextY - CARD_OFFSET_Y) / GRID_CELL_HEIGHT), 0, props.rows - 1);

      return {
        ...card,
        x: nextX,
        y: nextY,
        gridCol,
        gridRow
      };
    });

    localCards.value = nextCards;
    emit("update:cards", nextCards);
  }
}

function setZoom(nextZoom) {
  zoomLevel.value = clamp(Number(nextZoom.toFixed(2)), ZOOM_MIN, ZOOM_MAX);
}

function zoomIn() {
  setZoom(zoomLevel.value + ZOOM_STEP);
}

function zoomOut() {
  setZoom(zoomLevel.value - ZOOM_STEP);
}

function resetZoom() {
  setZoom(1);
}

function sanitizeCount(rawValue) {
  const parsed = Number.parseInt(String(rawValue ?? "0"), 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

function createPortList(prefix, side, count) {
  return Array.from({length: count}, (_item, index) => {
    return {
      id: `${prefix}-${index + 1}`,
      side
    };
  });
}

function createPlaceholderLabels(count) {
  return Array.from({length: count}, () => {
    return "[-]";
  });
}

function getCardGridPosition(card) {
  if (typeof card.gridCol === "number" && typeof card.gridRow === "number") {
    return {
      gridCol: card.gridCol,
      gridRow: card.gridRow
    };
  }

  const position = getCardPosition(card);
  return {
    gridCol: clamp(Math.round((position.left - CARD_OFFSET_X) / GRID_CELL_WIDTH), 0, props.cols - 1),
    gridRow: clamp(Math.round((position.top - CARD_OFFSET_Y) / GRID_CELL_HEIGHT), 0, props.rows - 1)
  };
}

function getNextProcesoPlacement() {
  const procesoCards = localCards.value.filter((card) => {
    return card.type === "Proceso";
  });

  if (procesoCards.length === 0) {
    return {
      targetGridCol: 1,
      targetGridRow: 1
    };
  }

  const maxGridCol = Math.max(...procesoCards.map((card) => {
    return getCardGridPosition(card).gridCol;
  }));
  const centerRow = Math.max(1, Math.floor(props.rows / 2));

  return {
    targetGridCol: clamp(maxGridCol + 4, 0, props.cols - 1),
    targetGridRow: centerRow
  };
}

function addProcesoCard(config) {
  const {targetGridCol, targetGridRow} = getNextProcesoPlacement();
  const targetX = CARD_OFFSET_X + targetGridCol * GRID_CELL_WIDTH;
  const targetY = CARD_OFFSET_Y + targetGridRow * GRID_CELL_HEIGHT;

  const x = snapToGrid.value ? snapToStep(targetX, SNAP_STEP, CARD_OFFSET_X) : targetX;
  const y = snapToGrid.value ? snapToStep(targetY, SNAP_STEP, CARD_OFFSET_Y) : targetY;

  const safeX = clamp(x, CARD_OFFSET_X, canvasWidth.value - CARD_WIDTH - CARD_OFFSET_X);
  const safeY = clamp(y, CARD_OFFSET_Y, canvasHeight.value - CARD_HEIGHT - CARD_OFFSET_Y);
  const inputCount = sanitizeCount(config.inputCount);
  const outputCount = sanitizeCount(config.outputCount);
  const processName = config.name?.trim() || "Nuevo proceso";

  const newCard = {
    id: Date.now(),
    type: "Proceso",
    name: processName,
    icon: "fa-gears",
    x: safeX,
    y: safeY,
    gridCol: clamp(Math.round((safeX - CARD_OFFSET_X) / GRID_CELL_WIDTH), 0, props.cols - 1),
    gridRow: clamp(Math.round((safeY - CARD_OFFSET_Y) / GRID_CELL_HEIGHT), 0, props.rows - 1),
    inputProducts: createPlaceholderLabels(inputCount),
    outputProducts: createPlaceholderLabels(outputCount),
    inputs: createPortList("in-l", "l", inputCount),
    outputs: createPortList("out-r", "r", outputCount)
  };

  const nextCards = [...localCards.value, newCard];
  localCards.value = nextCards;
  emit("update:cards", nextCards);
}

function resizeProductLabels(existingLabels, targetCount) {
  const safeExisting = Array.isArray(existingLabels) ? existingLabels : [];
  const nextLabels = safeExisting.slice(0, targetCount);

  while (nextLabels.length < targetCount) {
    nextLabels.push("[-]");
  }

  return nextLabels;
}

function updateProcesoCard(cardId, config) {
  const inputCount = sanitizeCount(config.inputCount);
  const outputCount = sanitizeCount(config.outputCount);
  const processName = config.name?.trim() || "Nuevo proceso";

  const nextCards = localCards.value.map((card) => {
    if (card.id !== cardId) return card;

    return {
      ...card,
      name: processName,
      inputs: createPortList("in-l", "l", inputCount),
      outputs: createPortList("out-r", "r", outputCount),
      inputProducts: resizeProductLabels(card.inputProducts, inputCount),
      outputProducts: resizeProductLabels(card.outputProducts, outputCount)
    };
  });

  localCards.value = nextCards;
  emit("update:cards", nextCards);
}

function onCancelProcesoModal() {
  showProcesoModal.value = false;
  resetProcesoModalForm();
}

function onAcceptProcesoModal() {
  const config = {
    name: selectedProcesoName.value || "Nuevo proceso",
    inputCount: insumosCount.value,
    outputCount: productosCount.value
  };

  if (isEditingProceso.value) {
    updateProcesoCard(editingProcesoCardId.value, config);
  } else {
    addProcesoCard(config);
  }

  showProcesoModal.value = false;
  resetProcesoModalForm();
}

function addCommentCard() {
  const targetX = CARD_OFFSET_X + GRID_CELL_WIDTH * 0.25;
  const targetY = canvasHeight.value - CARD_HEIGHT - GRID_CELL_HEIGHT * 0.5;

  const x = snapToGrid.value ?
    snapToStep(targetX, SNAP_STEP, CARD_OFFSET_X) :
    targetX;
  const y = snapToGrid.value ?
    snapToStep(targetY, SNAP_STEP, CARD_OFFSET_Y) :
    targetY;

  const safeX = clamp(x, CARD_OFFSET_X, canvasWidth.value - CARD_WIDTH - CARD_OFFSET_X);
  const safeY = clamp(y, CARD_OFFSET_Y, canvasHeight.value - CARD_HEIGHT - CARD_OFFSET_Y);

  const newCard = {
    id: Date.now(),
    type: "Comentario",
    name: "Nuevo comentario",
    icon: "",
    x: safeX,
    y: safeY,
    gridCol: clamp(Math.round((safeX - CARD_OFFSET_X) / GRID_CELL_WIDTH), 0, props.cols - 1),
    gridRow: clamp(Math.round((safeY - CARD_OFFSET_Y) / GRID_CELL_HEIGHT), 0, props.rows - 1),
    inputs: [],
    outputs: []
  };

  const nextCards = [...localCards.value, newCard];
  localCards.value = nextCards;
  emit("update:cards", nextCards);
}

const renderedConnections = computed(() => {
  return localConnections.value
    .map((connection) => {
      return getRenderedConnection(connection);
    })
    .filter((connection) => {
      return Boolean(connection);
    });
});

const pendingPreviewPath = computed(() => {
  if (!pendingConnection.value) return "";

  const fromCard = getCardById(pendingConnection.value.cardId);
  if (!fromCard) return "";

  const start = getPortPosition(
    fromCard,
    "outputs",
    pendingConnection.value.portId,
    pendingConnection.value.side
  );
  if (!start) return "";

  const end = pendingPointer.value;
  const curve = Math.max(30, Math.abs(end.x - start.x) * 0.4);
  const c1x = start.x + (pendingConnection.value.side === "r" ? curve : -curve);
  const c2x = end.x - curve;

  return `M ${start.x} ${start.y} C ${c1x} ${start.y}, ${c2x} ${end.y}, ${end.x} ${end.y}`;
});

onMounted(() => {
  window.addEventListener("mousemove", onGlobalMouseMove);
  window.addEventListener("mouseup", onGlobalMouseUp);
  window.addEventListener("keydown", handleDeleteConnection);
  window.addEventListener("mousedown", handleGlobalPointerDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onGlobalMouseMove);
  window.removeEventListener("mouseup", onGlobalMouseUp);
  window.removeEventListener("keydown", handleDeleteConnection);
  window.removeEventListener("mousedown", handleGlobalPointerDown);
  document.body.style.userSelect = previousUserSelect.value;
});
</script>

<style scoped>
.nyr-diagram-canvas {
  background-color: #fafafa;
  background-image:
    linear-gradient(to right, rgba(17, 24, 39, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(17, 24, 39, 0.06) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>

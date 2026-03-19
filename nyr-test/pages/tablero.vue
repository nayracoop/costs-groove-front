<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {definePageMeta} from "#imports";

defineOptions({name: "TableroDashboardPage"});
definePageMeta({layout: "admin"});

const GROUP_COLUMNS = 2;

const tableroName = ref("VENDIMIA_2026_A");

const gestionCards = ref([
  {id: 0, type: "Empresa", name: "Alquileres", icon: "building", disabled: false},
  {id: 1, type: "Empresa", name: "Sueldos", icon: "building", disabled: false},
  {id: 2, type: "Variable", name: "Variables Macro", icon: "chart-line", disabled: false}
]);

const costCenterGroups = ref([
  {
    id: "grupo-varietales",
    name: "Línea Varietales",
    rows: 2,
    swatchClass: "bg-blue-500",
    borderClass: "border-blue-500",
    accentClass: "text-blue-600",
    products: [
      {id: 10, name: "Chardonnay", icon: "wine-bottle", disabled: false},
      {id: 11, name: "Malbec", icon: "wine-bottle", disabled: false},
      {id: 12, name: "Blend", icon: "wine-bottle", disabled: false}
    ]
  },
  {
    id: "grupo-especiales",
    name: "Línea Especiales",
    rows: 1,
    swatchClass: "bg-orange-500",
    borderClass: "border-orange-500",
    accentClass: "text-orange-600",
    products: [
      {id: 13, name: "Vermouth", icon: "wine-bottle", disabled: false},
      {id: 14, name: "Vino especiado", icon: "wine-bottle", disabled: false}
    ]
  },
  {
    id: "grupo-reserva",
    name: "Línea Reserva",
    rows: 1,
    swatchClass: "bg-green-500",
    borderClass: "border-green-500",
    accentClass: "text-green-600",
    products: [
      {id: 15, name: "Cabernet Reserva", icon: "wine-bottle", disabled: false},
      {id: 16, name: "Blend de Guarda", icon: "wine-bottle", disabled: false}
    ]
  }
]);

const indicadoresCards = ref([
  {id: 20, type: "Indicador", name: "Punto de cierre", icon: "chart-simple"},
  {id: 21, type: "Indicador", name: "Punto de equilibrio", icon: "chart-simple"},
  {id: 22, type: "Indicador", name: "Margen de contribución", icon: "chart-simple"}
]);

const selectedTablero = ref("vendimia_2026_a");
const selectedTags = ref([]);
const cardNameFilter = ref("");
const dragPayload = ref(null);
const contextMenuRef = ref(null);
const cardContextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  area: "",
  groupId: null,
  cardId: null
});

const tableroOptions = [
  {key: "vendimia_2026_a", value: "VENDIMIA_2026_A"},
  {key: "vendimia_2026_b", value: "VENDIMIA_2026_B"}
];

const tagOptions = [
  {key: "urgente", value: "Urgente"},
  {key: "revision", value: "Revisión"},
  {key: "aprobado", value: "Aprobado"}
];

function matchesNameFilter(value) {
  const filter = cardNameFilter.value.trim().toLowerCase();
  if (!filter) return true;
  return value.toLowerCase().includes(filter);
}

function isEmptySlot(item) {
  return item?.kind === "slot";
}

function createEmptySlot() {
  return {
    id: `slot-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    kind: "slot"
  };
}

function countFilledProducts(group) {
  return group.products.filter((item) => {
    return !isEmptySlot(item);
  }).length;
}

function syncGroupSlots(group) {
  if (!group || !Array.isArray(group.products)) return;

  const filledCount = countFilledProducts(group);
  const minRows = Math.max(1, Math.ceil(filledCount / GROUP_COLUMNS));
  const currentRows = typeof group.rows === "number" ? group.rows : minRows;
  const targetRows = Math.max(currentRows, minRows);
  const targetSlots = targetRows * GROUP_COLUMNS;
  const targetEmptySlots = Math.max(targetSlots - filledCount, 0);

  const slotIndices = [];
  group.products.forEach((item, index) => {
    if (isEmptySlot(item)) {
      slotIndices.push(index);
    }
  });

  const currentEmptySlots = slotIndices.length;

  if (currentEmptySlots < targetEmptySlots) {
    const missing = targetEmptySlots - currentEmptySlots;
    for (let i = 0; i < missing; i += 1) {
      group.products.push(createEmptySlot());
    }
  }

  if (currentEmptySlots > targetEmptySlots) {
    let extra = currentEmptySlots - targetEmptySlots;
    for (let i = group.products.length - 1; i >= 0 && extra > 0; i -= 1) {
      if (isEmptySlot(group.products[i])) {
        group.products.splice(i, 1);
        extra -= 1;
      }
    }
  }

  group.rows = targetRows;
}

function syncAllGroupSlots() {
  costCenterGroups.value.forEach((group) => {
    syncGroupSlots(group);
  });
}

const filteredGestionCards = computed(() => {
  return gestionCards.value.filter((card) => {
    return matchesNameFilter(card.name);
  });
});

const filteredCostCenterGroups = computed(() => {
  return costCenterGroups.value
    .map((group) => {
      const matchesGroup = matchesNameFilter(group.name);
      const products = group.products.filter((product) => {
        if (isEmptySlot(product)) return true;
        return matchesNameFilter(product.name);
      });

      if (matchesGroup && !cardNameFilter.value.trim()) {
        return group;
      }

      if (matchesGroup && products.length === 0) {
        return {
          ...group,
          products: [...group.products]
        };
      }

      return {
        ...group,
        products
      };
    })
    .filter((group) => {
      return group.products.length > 0 || matchesNameFilter(group.name);
    });
});

const filteredIndicadoresCards = computed(() => {
  return indicadoresCards.value.filter((card) => {
    return matchesNameFilter(card.name);
  });
});

const cardContextMenuStyle = computed(() => {
  return {
    left: `${cardContextMenu.value.x}px`,
    top: `${cardContextMenu.value.y}px`
  };
});

function closeCardContextMenu() {
  cardContextMenu.value.visible = false;
}

function findGroupById(groupId) {
  return costCenterGroups.value.find((group) => {
    return group.id === groupId;
  });
}

function onProductDragStart(groupId, productId) {
  const group = findGroupById(groupId);
  const product = group?.products.find((item) => {
    return item.id === productId;
  });
  if (!product || isEmptySlot(product)) return;

  dragPayload.value = {groupId, productId};
}

function onProductDragOver(event, groupId) {
  if (!dragPayload.value) return;
  if (dragPayload.value.groupId !== groupId) return;
  event.preventDefault();
}

function onProductDrop(targetGroupId, targetProductId) {
  if (!dragPayload.value) return;
  if (dragPayload.value.groupId !== targetGroupId) {
    dragPayload.value = null;
    return;
  }

  const group = findGroupById(targetGroupId);
  if (!group) {
    dragPayload.value = null;
    return;
  }

  const sourceIndex = group.products.findIndex((product) => {
    return product.id === dragPayload.value.productId;
  });
  const targetIndex = group.products.findIndex((product) => {
    return product.id === targetProductId;
  });

  if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
    dragPayload.value = null;
    return;
  }

  const moved = group.products.splice(sourceIndex, 1)[0];
  group.products.splice(targetIndex, 0, moved);
  dragPayload.value = null;
}

function onProductDropToEmptySlot(targetGroupId, slotId) {
  if (!dragPayload.value) return;
  if (dragPayload.value.groupId !== targetGroupId) {
    dragPayload.value = null;
    return;
  }

  const group = findGroupById(targetGroupId);
  if (!group) {
    dragPayload.value = null;
    return;
  }

  const sourceIndex = group.products.findIndex((product) => {
    return product.id === dragPayload.value.productId;
  });
  const slotIndex = group.products.findIndex((product) => {
    return product.id === slotId;
  });

  if (sourceIndex === -1 || slotIndex === -1) {
    dragPayload.value = null;
    return;
  }

  const sourceCard = group.products[sourceIndex];
  const slotCard = group.products[slotIndex];
  if (isEmptySlot(sourceCard) || !isEmptySlot(slotCard)) {
    dragPayload.value = null;
    return;
  }

  group.products[sourceIndex] = slotCard;
  group.products[slotIndex] = sourceCard;
  dragPayload.value = null;
}

function addEmptyRowToGroup(groupId) {
  const group = findGroupById(groupId);
  if (!group) return;

  const currentRows = typeof group.rows === "number" ? group.rows : Math.max(1, Math.ceil(countFilledProducts(group) / GROUP_COLUMNS));
  group.rows = currentRows + 1;
  syncGroupSlots(group);
}

function hasEmptyLastRow(group) {
  const totalSlots = group.products.length;
  if (totalSlots < GROUP_COLUMNS) return false;

  const lastRow = group.products.slice(totalSlots - GROUP_COLUMNS);
  return lastRow.length === GROUP_COLUMNS && lastRow.every((item) => {
    return isEmptySlot(item);
  });
}

function removeLastEmptyRowFromGroup(groupId) {
  const group = findGroupById(groupId);
  if (!group) return;
  if (!hasEmptyLastRow(group)) return;

  const currentRows = typeof group.rows === "number" ? group.rows : Math.max(1, Math.ceil(group.products.length / GROUP_COLUMNS));
  if (currentRows <= 1) return;

  group.rows = currentRows - 1;
  syncGroupSlots(group);
}

function onCardContextMenu(event, payload) {
  cardContextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    area: payload.area,
    groupId: payload.groupId || null,
    cardId: payload.cardId
  };
}

function onContextAction(action) {
  const menu = cardContextMenu.value;
  if (!menu.visible) return;

  if (menu.area === "gestion") {
    const idx = gestionCards.value.findIndex((card) => {
      return card.id === menu.cardId;
    });

    if (idx !== -1) {
      if (action === "eliminar") {
        gestionCards.value.splice(idx, 1);
      }
      if (action === "deshabilitar") {
        gestionCards.value[idx].disabled = !gestionCards.value[idx].disabled;
      }
    }
  }

  if (menu.area === "producto") {
    const group = findGroupById(menu.groupId);
    if (group) {
      const idx = group.products.findIndex((product) => {
        return product.id === menu.cardId;
      });

      if (idx !== -1) {
        if (action === "eliminar") {
          group.products.splice(idx, 1);
          syncGroupSlots(group);
        }
        if (action === "deshabilitar") {
          group.products[idx].disabled = !group.products[idx].disabled;
        }
      }
    }
  }

  if (menu.area === "indicador") {
    const idx = indicadoresCards.value.findIndex((card) => {
      return card.id === menu.cardId;
    });

    if (idx !== -1 && action === "eliminar") {
      indicadoresCards.value.splice(idx, 1);
    }
  }

  closeCardContextMenu();
}

function onGlobalPointerDown(event) {
  if (!cardContextMenu.value.visible) return;
  const menuEl = contextMenuRef.value;
  if (menuEl && menuEl.contains(event.target)) return;
  closeCardContextMenu();
}

onMounted(() => {
  syncAllGroupSlots();
  window.addEventListener("mousedown", onGlobalPointerDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousedown", onGlobalPointerDown);
});
</script>

<template>
  <div class="p-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-semibold text-charcoal mb-6">
        {{ tableroName }}
      </h1>

      <!-- Filters -->
      <NyrCard class="mb-4">
        <div class="flex gap-4 items-start">
          <div class="flex-1">
            <NyrSelect
              v-model="selectedTablero"
              label="Tablero"
              :options="tableroOptions"
            />
          </div>
          <div class="flex-1">
            <NyrSelect
              v-model="selectedTags"
              label="Filtrar por etiquetas"
              :options="tagOptions"
              multiple
            />
          </div>
          <div class="flex-1">
            <NyrInput
              v-model="cardNameFilter"
              label="Buscar tarjeta"
              placeholder="Nombre de tarjeta..."
            />
          </div>
        </div>
      </NyrCard>

      <NyrCard>
        <div class="grid gap-4 xl:grid-cols-12">
          <section class="space-y-3 xl:col-span-3">
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div class="mb-3 flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-charcoal">
                    Gestión Empresa
                  </p>
                  <p class="text-xs text-gray-500">
                    Variables compartidas.
                  </p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700"
                  title="Agregar tarjeta"
                >
                  <NyrIcon
                    icon="plus"
                    size="sm"
                  />
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="card in filteredGestionCards"
                  :key="card.id"
                  class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                  :class="card.disabled ? 'opacity-50' : ''"
                  @contextmenu.prevent.stop="onCardContextMenu($event, {area: 'gestion', cardId: card.id})"
                  @mousedown.right.prevent.stop
                >
                  <div class="flex items-start gap-2">
                    <NyrIcon
                      :icon="card.icon"
                      size="sm"
                      class="mt-0.5 text-gray-500"
                    />
                    <div>
                      <p class="text-sm font-medium text-charcoal">
                        {{ card.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ card.type }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-if="filteredGestionCards.length === 0"
                  class="rounded-lg border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500"
                >
                  Sin resultados en Gestión Empresa.
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-3 xl:col-span-6">
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div class="mb-4">
                <p class="text-sm font-semibold text-charcoal">
                  Gestión de Productos
                </p>
                <p class="text-xs text-gray-500">
                  Productos agrupados por grupo de producto
                </p>
              </div>

              <div class="space-y-4">
                <div
                  v-for="group in filteredCostCenterGroups"
                  :key="group.id"
                  class="rounded-xl border-2 bg-white p-4 shadow-sm"
                  :class="group.borderClass"
                >
                  <div class="mb-3 flex items-center gap-2">
                    <span
                      class="h-3 w-3 rounded-full"
                      :class="group.swatchClass"
                    />
                    <p
                      class="text-sm font-semibold"
                      :class="group.accentClass"
                    >
                      {{ group.name }}
                    </p>

                    <button
                      type="button"
                      class="ml-auto inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700"
                      title="Agregar producto"
                    >
                      <NyrIcon
                        icon="plus"
                        size="sm"
                      />
                    </button>
                  </div>

                  <div
                    class="grid gap-3 sm:grid-cols-2"
                    @dragover.prevent="onProductDragOver($event, group.id)"
                  >
                    <div
                      v-for="product in group.products"
                      :key="product.id"
                      class="h-16 rounded-lg border p-2"
                      :class="isEmptySlot(product) ? 'border-dashed border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 cursor-grab'"
                      :draggable="!isEmptySlot(product)"
                      @dragstart="onProductDragStart(group.id, product.id)"
                      @dragover.prevent="onProductDragOver($event, group.id)"
                      @drop="isEmptySlot(product) ? onProductDropToEmptySlot(group.id, product.id) : onProductDrop(group.id, product.id)"
                      @contextmenu.prevent.stop="!isEmptySlot(product) && onCardContextMenu($event, {area: 'producto', groupId: group.id, cardId: product.id})"
                      @mousedown.right.prevent.stop="!isEmptySlot(product)"
                    >
                      <div
                        v-if="isEmptySlot(product)"
                        class="h-full"
                      />

                      <div
                        v-else
                        class="flex h-full items-start gap-2"
                      >
                        <NyrIcon
                          :icon="product.icon"
                          size="sm"
                          class="mt-0.5 text-gray-500"
                        />
                        <div class="min-w-0">
                          <p class="truncate text-sm font-medium text-charcoal">
                            {{ product.name }}
                          </p>
                          <p class="text-xs text-gray-500">
                            Producto del grupo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 flex justify-center gap-2">
                    <button
                      v-if="hasEmptyLastRow(group)"
                      type="button"
                      class="rounded-md border border-dashed border-gray-300 bg-white px-2 py-0.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                      title="Eliminar última fila vacía"
                      @click="removeLastEmptyRowFromGroup(group.id)"
                    >
                      -
                    </button>

                    <button
                      type="button"
                      class="rounded-md border border-dashed border-gray-300 bg-white px-2 py-0.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                      title="Agregar fila vacía"
                      @click="addEmptyRowToGroup(group.id)"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  v-if="filteredCostCenterGroups.length === 0"
                  class="rounded-lg border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500"
                >
                  Sin productos para mostrar en centros de costos.
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-3 xl:col-span-3">
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div class="mb-3">
                <p class="text-sm font-semibold text-charcoal">
                  Indicadores
                </p>
                <p class="text-xs text-gray-500">
                  Métricas clave del tablero.
                </p>
              </div>

              <div class="space-y-3">
                <div
                  v-for="card in filteredIndicadoresCards"
                  :key="card.id"
                  class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                  @contextmenu.prevent.stop="onCardContextMenu($event, {area: 'indicador', cardId: card.id})"
                  @mousedown.right.prevent.stop
                >
                  <div class="flex items-start gap-2">
                    <NyrIcon
                      :icon="card.icon"
                      size="sm"
                      class="mt-0.5 text-gray-500"
                    />
                    <div>
                      <p class="text-sm font-medium text-charcoal">
                        {{ card.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ card.type }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-if="filteredIndicadoresCards.length === 0"
                  class="rounded-lg border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500"
                >
                  Sin indicadores para este filtro.
                </div>
              </div>
            </div>
          </section>
        </div>
      </NyrCard>
    </div>

    <div
      v-if="cardContextMenu.visible"
      ref="contextMenuRef"
      class="fixed z-[70] min-w-40 rounded-md border border-gray-200 bg-white p-1 shadow-sm"
      :style="cardContextMenuStyle"
    >
      <button
        type="button"
        class="block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        @click="onContextAction('eliminar')"
      >
        Eliminar
      </button>
      <button
        type="button"
        class="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        @click="onContextAction('deshabilitar')"
      >
        Deshabilitar
      </button>
    </div>
  </div>
</template>

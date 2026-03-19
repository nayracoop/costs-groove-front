<script setup>
import {computed, ref} from "vue";
import {definePageMeta} from "#imports";

defineOptions({name: "TableroDashboardPage"});
definePageMeta({layout: "admin"});

const tableroName = ref("VENDIMIA_2026_A");

const gestionCards = ref([
  {id: 0, type: "Empresa", name: "Alquileres", icon: "building"},
  {id: 1, type: "Empresa", name: "Sueldos", icon: "building"},
  {id: 2, type: "Variable", name: "Variables Macro", icon: "chart-line"}
]);

const costCenterGroups = ref([
  {
    id: "grupo-varietales",
    name: "Línea Varietales",
    swatchClass: "bg-blue-500",
    borderClass: "border-blue-500",
    accentClass: "text-blue-600",
    products: [
      {id: 10, name: "Chardonnay", icon: "wine-bottle"},
      {id: 11, name: "Malbec", icon: "wine-bottle"},
      {id: 12, name: "Blend", icon: "wine-bottle"}
    ]
  },
  {
    id: "grupo-especiales",
    name: "Línea Especiales",
    swatchClass: "bg-orange-500",
    borderClass: "border-orange-500",
    accentClass: "text-orange-600",
    products: [
      {id: 13, name: "Vermouth", icon: "wine-bottle"},
      {id: 14, name: "Vino especiado", icon: "wine-bottle"}
    ]
  },
  {
    id: "grupo-reserva",
    name: "Línea Reserva",
    swatchClass: "bg-green-500",
    borderClass: "border-green-500",
    accentClass: "text-green-600",
    products: [
      {id: 15, name: "Cabernet Reserva", icon: "wine-bottle"},
      {id: 16, name: "Blend de Guarda", icon: "wine-bottle"}
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
              </div>

              <div class="space-y-3">
                <div
                  v-for="card in filteredGestionCards"
                  :key="card.id"
                  class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
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
                  Gestión de centros de costos
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
                  </div>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <div
                      v-for="product in group.products"
                      :key="product.id"
                      class="rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <div class="flex items-start gap-2">
                        <NyrIcon
                          :icon="product.icon"
                          size="sm"
                          class="mt-0.5 text-gray-500"
                        />
                        <div>
                          <p class="text-sm font-medium text-charcoal">
                            {{ product.name }}
                          </p>
                          <p class="text-xs text-gray-500">
                            Producto del grupo
                          </p>
                        </div>
                      </div>
                    </div>
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
  </div>
</template>

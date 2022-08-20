<script setup lang="ts">
import { useTableFilters } from './composition/useTableFilters';
import { TableConfig } from './table-types';
import VTableRow from './VTableRow.vue';
import VTableFilter from './VTableFilter.vue';


const props = defineProps<{
    config: TableConfig<object>,
    data: Record<string, unknown>[],
    hiddenHeader?: boolean
}>()

const { checkRow, activeFilters } = useTableFilters(props.config, props.config.filters);
</script>

<template>
<section v-if="activeFilters" class="filters" >
  <VTableFilter v-model="activeFilters[filter.key]" :filter="filter" v-for="filter in config.filters" />
</section>
<table>
  <tr v-if="!hiddenHeader">
    <th v-for="cell in config.columns" class="headCell" >{{ cell.title }}</th>
  </tr>
  <template v-for="rowData in data" >
    <VTableRow :row="rowData" :config="config" :condition="checkRow" />
  </template>
</table>
</template>

<style scoped>
.headCell {
  font-weight: bold;
}

table {
  border: 1px solid black;

  min-width: 750px;
}

.filters {
    display: grid;
    grid-template-columns: 1fr 1fr;

    max-width: 300px;

    gap: 6px;
}
</style>

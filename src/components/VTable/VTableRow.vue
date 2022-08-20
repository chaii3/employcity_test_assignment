<script setup lang="ts">
import { computed, ref } from 'vue';
import { TableConfig, TableRowCondition } from './table-types';

const props = defineProps<{
    row: Record<string, unknown>,
    config: TableConfig<object>,
    nested?: boolean,
    condition: (row: object) => TableRowCondition
}>()

const isManualOpened = ref(false);

const children = computed(() => props.config.nested?.getRowChildren(props.row))

const conditionResult = computed(() => props.condition(props.row))

const isOpened = computed(() => children.value && (conditionResult.value.isActiveChild || isManualOpened.value))

const validChildren = computed(() => {
    return children.value?.filter(ch => {
        return props.condition(ch).isActive
    })
})
</script>

<template>
    <tr
        :class="{ row: true, nested, opened: isOpened }"
        v-if="conditionResult.isActive || conditionResult.isActiveChild"
    >
        <td v-for="cell in config.columns">{{ row[cell.key] }}</td>
        <td v-if="config.nested" class="collapse" >
            <div v-if="validChildren && validChildren.length" @click="isManualOpened = !isManualOpened" :class="{ clickable: children }" >
                <span v-if="isOpened">&#8593;</span>
                <span v-else>&#8595;</span>
            </div>
        </td>
    </tr>
    <template v-if="isOpened" >
        <tr v-if="config.nested.titleGetter" class="nestedTitle" ><td :colspan="config.columns.length">{{ config.nested.titleGetter(row) }}</td></tr>
        <template v-for="row in validChildren">
            <VTableRow :row="row" :config="config" nested v-if="!condition || conditionResult.isActive" :condition="condition" />
        </template>
    </template>
</template>

<style scoped>
.row {
    background-color: #B4D5CD;
}

.nested {
    background-color: #7AA095;
    padding: 6px;
}

.clickable {
    cursor: pointer;
    user-select: none
}

.nestedTitle  {
    text-align: center;
}

.collapse {
    padding: 0 10px;
    min-width: 20px;
}

.opened {
    background-color: #BCB9E7;
}
</style>
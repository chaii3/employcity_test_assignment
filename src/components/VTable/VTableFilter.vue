<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { TableFilter, TableFilterType } from './table-types';

const props = defineProps<{
    modelValue: null | string | boolean,
    filter: TableFilter
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: null | string | boolean): void
}>()

const localValue = computed({
    get: () => props.filter.type === TableFilterType.Boolean ? Boolean(props.modelValue) : props.modelValue,
    set: (v) => emit('update:modelValue', v === false || v === '' ? null : v)
})

const id = String(Math.floor(Math.random() * 100));
</script>

<template>
        <template v-if="filter.type === TableFilterType.String" >
            <label :for="id" >
                {{ filter.label }}
            </label>
            <input v-model="localValue" :id="id" />
        </template>
        <template v-else-if="filter.type === TableFilterType.Boolean">
            <label :for="id" >
                {{ filter.label }}
            </label>
            <input v-model="(localValue as boolean)" type="checkbox" :id="id" />
        </template>
</template>
import { isString } from "@vue/shared";
import { computed, ref, watch } from "vue";
import { TableFilterType, TableFilterAction, TableConfig, TableRowCondition, TableFilter } from "../table-types";

const defaultFilters: Record<Exclude<TableFilterType, TableFilterType.Custom>, TableFilterAction<Record<string, unknown>>> = {
    [TableFilterType.String]: (row, filterValue, key) => {
        const value = row[key];

        if (!isString(value) || !isString(filterValue)) return false;

        return (value as string).includes(filterValue);
     },
    [TableFilterType.Boolean]: (row, filterValue, key) => {
        return row[key] === filterValue
    }
}

export function useTableFilters<T extends object = object>(config: TableConfig<T>, filters?: TableFilter<T>[]) {
    function buildDefaults() {
        return filters?.reduce<Record<string, boolean | null | string>>((acc, f) => {
            acc[f.key as string] = null

            return acc;
        }, {} as Record<string, string | boolean | null>)
    }

    const activeFilters = ref<Record<string,  boolean | null | string> | undefined>(buildDefaults())

    const filtersState = computed(() => {
        const active = new Set();

        if (!activeFilters.value) return active;

        for (const key in activeFilters.value) {
            if (activeFilters.value[key] !== null) {
                active.add(key)
            }
        }

        return active
     })

     const activeRows = new Map()

     watch(activeFilters, () => activeRows.clear())

    function checkRow(row: T): TableRowCondition {
        if (!filters || !filtersState.value.size) return { isActive: true, isActiveChild: false };

        const check = (target: T) => filters.every(f => {
            const identificatorKey = config.nested?.identificatorKey

            if (identificatorKey && activeRows.has(identificatorKey)) {
                return activeRows.get(identificatorKey);
            };

            if (!filtersState.value.has(f.key) || !activeFilters.value) return true;

            const filterValue = activeFilters.value[f.key as string]

            const result = f.action ?
                 f.action(target, filterValue, f.key)
                 : defaultFilters[f.type](target as Record<string, unknown>, filterValue, f.key as string)

            if (result && identificatorKey) {
                activeRows.set(target[identificatorKey], result);
            }

            return result
        })

        const isTargetActive = check(row)

        const children = config.nested.getRowChildren(row)

        const isSomeChildActive = children?.some((ch) => checkRow(ch).isActive)

        return { isActive: Boolean(isTargetActive || isSomeChildActive), isActiveChild: Boolean(isSomeChildActive) }
    }

    return { checkRow, activeFilters }
}
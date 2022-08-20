import { Component } from 'vue'
import { TableConfig } from './table-types'
import VTable from './VTable.vue'

type TableProps<D extends object = object> = {
    config: TableConfig<D>,
    data: D[],
    hiddenHeader?: boolean
}

export default function defineTable<D extends object>() {
    return VTable as Component<TableProps<D>>
}
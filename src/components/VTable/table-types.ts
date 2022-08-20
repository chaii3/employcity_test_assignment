export interface TableColumns<T = unknown> {
    key: keyof T,
    title: string
}

export interface TableConfig<R extends object = object> {
    columns: TableColumns<R>[]
    hiddenRow?: (row: R) => boolean,
    nested: VTableNestedOptions<R>,
    filters?: TableFilter<R>[]
}

export type VTableChildGetter<R = unknown> = (row: R) => R[] | undefined

export interface VTableNestedOptions<R extends object = object> {
    getRowChildren: VTableChildGetter<R>,
    titleGetter?: (parentRow: R) => string,
    //need for search optimisation
    identificatorKey?: keyof R,
}


export enum TableFilterType {
    String = 1,
    Boolean,
    Custom
}

export interface TableFilter<R extends object = object> {
    key: keyof R,
    label: string,
    type: Exclude<TableFilterType, TableFilterType.Custom>
    action?: TableFilterAction<R>
}

export type TableFilterAction<R extends object = object> = (row: R, filterValue: string | boolean | null, filterKey: keyof R) => boolean

export type TableRowCondition = { isActive: boolean, isActiveChild: boolean }
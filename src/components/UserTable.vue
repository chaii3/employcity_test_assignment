<script setup lang="ts">
import { useUserTableData } from '../composition/useTableData';
import { User } from '../types/data-types';
import { TableConfig, TableFilterAction, TableFilterType } from './VTable/table-types';
import { isString } from '@vue/shared';
import defineTable from './VTable/define';

const data = await fetch('../data.json').then<User[]>(d => d.json())

const FIRST_LEVEL_ID = 0;

const { itemsByParent } = useUserTableData(data);

function filterBalance(user: User, filterValue: string | boolean | number, key: keyof User) {
    const userBalance = user[key]

    if (!isString(filterValue) || !isString(userBalance)) return false;

    return userBalance.replaceAll(/\$|,/gi, '').includes(filterValue)
}

const config: TableConfig<User> = {
    columns: [{ key: 'id', title: 'ID' }, { key: 'name', title: 'Name' }, { key: 'balance', title: 'Balance' }, { key: 'isActive', title: 'Status' }, { key: 'email', title: 'email' }],
    nested: { getRowChildren: (r) => itemsByParent.value.get(r.id), titleGetter: (r) => `Children of ${r.name}`, identificatorKey: 'id' },
    filters: [
        { type: TableFilterType.Boolean, key: 'isActive', label: 'Active' },
        { type: TableFilterType.String, key: 'email', label: 'Email' },
        { type: TableFilterType.String, key: 'balance', label: 'Balance', action: filterBalance as TableFilterAction<any>  },
    ]
}

const UserTable = defineTable<User>();
</script>

<template>
    <user-table :config="config" :data="itemsByParent.get(FIRST_LEVEL_ID) || []" />
</template>
import { ref } from "vue";
import {  User } from "../types/data-types";

export function useUserTableData(dataItems: User[]) {
    const itemsByParent = ref(new Map<User['id'], User[]>())

    function update(items: User[]) {
        itemsByParent.value.clear();

        items.forEach(row => {
            if (!itemsByParent.value.get(row.parentId)) {
                itemsByParent.value.set(row.parentId, []);
            }

            itemsByParent.value.get(row.parentId)!.push(row)
        })
    }

    update(dataItems);

    return { itemsByParent, update }
}
export interface IShopping_List_Item{
    shopping_list_id : number,
    item_id: number,
    item_name: string,
    item_qty: number
}

export interface IShopping_List_State{
    shopping_list_id ?: number,
    shopping_list_name?: string,
    items?: IShopping_List_Item[],
    refreshing ?: boolean
}


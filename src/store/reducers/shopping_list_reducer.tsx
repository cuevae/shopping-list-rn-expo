import { IShopping_List_State } from '../../interfaces';
import { ChatActionTypes } from '../types';


const INITIAL_STATE : IShopping_List_State = {
    shopping_list_id : undefined,
    shopping_list_name : '',
    items : [],
    refreshing: false
}

export default function shopping_list_reducer (state = INITIAL_STATE, action : ChatActionTypes ) {
    switch( action.type ){
        default:
            return state;
    }
}
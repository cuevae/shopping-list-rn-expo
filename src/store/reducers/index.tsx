import {combineReducers } from 'redux';
import shopping_list_reducer from './shopping_list_reducer'

export default combineReducers({ shopping_list : shopping_list_reducer});
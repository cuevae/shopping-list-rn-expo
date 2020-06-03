import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList } from 'react-native';
import { SingleItem, NewItem } from '../single_item';

const API_URL = 'http://192.168.10.20:3000/';
const SHOPPING_LISTS_EP = 'shopping_lists';
const SHOPPING_LIST_ITEMS_EP = 'shopping_lists_items';

export interface ShoppingListItem{
    id: number,
    sl_id: number,
    item_name: string,
    item_qty: number
}

interface Store_ShoppingListItemsResponse{
    id: number, 
    name: string, 
    shopping_lists_items: ShoppingListItem[]
}
  
export interface ShoppingListProps{
    shopping_list_name: string,
    items: ShoppingListItem[]
}

export interface ShoppingListState{
    shopping_list_name: string,
    items: ShoppingListItem[]
}

export default class ShoppingList extends React.Component
{
 
  //state declaration
  state: ShoppingListState;

  constructor( props: ShoppingListProps = { shopping_list_name:'', items:[] } )
  {
    super(props);
    this.state = {
        shopping_list_name: '',
        items: []
    }
  }

  setState(arg0: { shopping_list_name: string, items: ShoppingListItem[] }) {
    super.setState(arg0);
  }

  componentDidMount(){

    //get the latest shopping list created and its items
    fetch(API_URL + 'shopping_lists?select=*,shopping_lists_items(*)&limit=1&order=id.desc')
    .then(
      (response, ...rest) => {
        let data = response.json();
        return data;
      }
    )
    .then(
      (data, ...rest) => {
        let res : Store_ShoppingListItemsResponse = data[0];
        this.setState( {shopping_list_name : res.name, items: res.shopping_lists_items} );
      }
    )
  }

  render()
  {
    const shopping_list_items = this.state.items;
    const shopping_list_name = this.state.shopping_list_name;
    return <SafeAreaView style={styles.container}>
    <View style={{marginBottom:20}}><Text style={{fontSize:20, fontWeight: 'bold'}}> {shopping_list_name} </Text></View>
    <View><NewItem sl_id={0} name='test' qty={1} /></View>
    <FlatList
      data = { shopping_list_items }
      renderItem = {
        function ( listEntry: { index: number, item: ShoppingListItem } ) { 
          const item = listEntry.item;
          return <SingleItem id={item.id} sl_id={item.sl_id} name={item.item_name} qty={item.item_qty} />
        }
      }
    />
  </SafeAreaView>;
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10
    }
  });
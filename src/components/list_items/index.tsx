import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList } from 'react-native';

const API_URL = 'http://192.168.10.20:3000/';
const SHOPPING_LISTS_EP = 'shopping_lists';
const SHOPPING_LIST_ITEMS_EP = 'shopping_lists_items';

export interface ShoppingListItem{
    id: string,
    sl_id: number,
    item_name: string,
    item_qty: number
}
  
export interface ShoppingListItemsProps{
    items: ShoppingListItem[]
}

export interface ShoppingListItemsState{
    items: ShoppingListItem[]
}

export default class ShoppingListItems extends React.Component< {items:[]}, {items:[]} >
{
 
  //state declaration
  state: ShoppingListItemsState;

  constructor(props: ShoppingListItemsProps){
    super(props);
    this.state = {
      items: []
    }
  }

  setState(arg0: { items: ShoppingListItem[] }) {
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
        let res = data[0];
        let shopping_list_items = res.shopping_lists_items;
        this.setState({items: shopping_list_items});
      }
    )
  }

  render()
  {
    const shopping_list_items = this.state.items;
    return <SafeAreaView style={styles.container}>
    <View><Text>This is the list of items</Text></View>
    <FlatList
      data = { shopping_list_items }
      renderItem = {
        function ( listEntry: { index: number, item: ShoppingListItem } ) { 
          const item = listEntry.item;
          return <View style={styles.item}><Text>{item.item_qty} - {item.item_name}</Text></View> 
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
    },
    item: {
      padding: 5,
      marginVertical: 1
    },
    header: {
      fontSize: 32
    }
  });
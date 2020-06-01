import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList } from 'react-native';

const API_URL = 'http://192.168.10.20:3000/';
const SHOPPING_LISTS_EP = 'shopping_lists';
const SHOPPING_LIST_ITEMS_EP = 'shopping_lists_items';

interface ShoppingList{
  id: number,
  name: string
}

interface ShoppingListItem{
  id: string,
  sl_id: number,
  item_name: string,
  item_qty: number
}

interface Props{
  shopping_lists: ShoppingList[]
}

interface State{
  sl: ShoppingList,
  items: ShoppingListItem[]
}

export default class ShoppingListDisplay extends React.Component< Props, State >{

  constructor(props: Props){
    super(props);
    this.state = {
      sl: {
        id: null,
        name: ''
      },
      items: []
    }
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
        let shopping_list = {id: res.id, name: res.name};
        let shopping_list_items = res.shopping_lists_items;
        console.log(shopping_list);
        console.log(shopping_list_items);
        this.setState({sl: shopping_list, items: shopping_list_items});
      }
    )
  }

  render(){
    const shopping_list_name = this.state.sl.name;
    const shopping_list_items = this.state.items;
    return <SafeAreaView style={styles.container}>
    <Text>This is the current shopping list: { shopping_list_name }</Text>
    <FlatList
      data = { shopping_list_items }
      renderItem = {
        ({ item }) => { return <View style={styles.item}><Text>{item.item_qty} - {item.item_name}</Text></View> }
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

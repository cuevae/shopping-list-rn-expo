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

interface Props{
  shopping_lists: ShoppingList[]
}

interface State{
  shopping_lists: ShoppingList[]
}

/* async function getDataFromPostgREST(){
  try{
    
    let response = await fetch('http://192.168.10.20:3000/shopping_lists', {method: 'GET'});
    let json = await response.json();
    return json;

  } catch(error) {

    console.error(error);

  }
} */

export default class ShoppingListDisplay extends React.Component< Props, State >{

  constructor(props: Props){
    super(props);
    this.state = {
      //Initialize to an empty list of shopping lists
      shopping_lists: []
    }
  }

  componentDidMount(){
    fetch(API_URL + SHOPPING_LISTS_EP, {method: 'GET'})
    .then(
      (response, ...rest) => {
        let data = response.json();
        return data;
      })
    .then(
      (data, ...rest) => {
        //Update state so the list of shopping lists gets updated with the value retrieved
        //from database
        this.setState({ shopping_lists: data} );
      })
  }

  render(){
    const shopping_lists = this.state.shopping_lists;
    return <SafeAreaView style={styles.container}>
    <Text>This is the current shopping list</Text>
    <FlatList
      data = {shopping_lists}
      renderItem = {
        ({ item }) => { return <View><Text>{item.name}</Text></View> }
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
    padding: 20,
    marginVertical: 1
  },
  header: {
    fontSize: 32
  }
});

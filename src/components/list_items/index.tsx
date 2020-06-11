import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList, ScrollView } from 'react-native';
import { SingleItem, NewItem } from '../single_item';
import * as constants from '../../constants';

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
    shopping_list_name?: string,
    items?: ShoppingListItem[]
}

export interface ShoppingListProps{
    shopping_list_name: string,
    items: ShoppingListItem[]
}

export default class ShoppingList extends React.Component
{
 
  //state declaration
  state: ShoppingListState;
  props: ShoppingListProps;

  constructor( props: ShoppingListProps = { shopping_list_name:'', items:[] } )
  {
    super(props);
    this.state = {
        shopping_list_name: '',
        items: []
    }

    this.newItemHandler = this.newItemHandler.bind(this);
    this.deleteItemHandler = this.deleteItemHandler.bind(this);
  }

  setState(arg0: { shopping_list_name?: string, items?: ShoppingListItem[], test_bool?: boolean}) {
      super.setState(arg0);
  }

  componentDidMount(){

    console.log('did mount list')

    //get the latest shopping list created and its items
    fetch(constants.API_URL + 'shopping_lists?select=*,shopping_lists_items(*)&limit=1&order=id.desc&shopping_lists_items.order=id.desc')
    .then(
      (response, ...rest) => {
        if(response.status != 200){
            throw 'Could not retrieve items';
        }
        let data = response.json();
        return data;
      }
    )
    .then(
      (data, ...rest) => {
        let res : Store_ShoppingListItemsResponse = data[0];
        this.setState( {shopping_list_name : res.name, items: res.shopping_lists_items, test_bool: false} );
      }
    )
    //todo handle error 
    .catch( (error) => { console.log(error)} )
  }

  newItemHandler(newItem : ShoppingListItem)
  {
      let currentItems = (this.state.items && this.state.items.length > 0) ? this.state.items : [];
      //updated list of items
      let updatedItems = [newItem].concat(currentItems);
      this.setState(
          {
              shopping_list_name : this.state.shopping_list_name,
              items : updatedItems,
            }
        );
  }

  deleteItemHandler(deletedItem : ShoppingListItem)
  {
      const sameItemsAsDeleted = (element: ShoppingListItem) => { return element.id === deletedItem.id };
      if(this.state.items && this.state.items.length > 0)
      {
        let currentItems : ShoppingListItem[] = this.state.items;
        let updatedItems;
        let index = currentItems.findIndex(sameItemsAsDeleted);
        if(index >= 0){
            //First item
            if(index === 0 ){
                updatedItems = currentItems;
                updatedItems.shift();
            }
            //Last item 
            else if (index === currentItems.length - 1 ) 
            {
                updatedItems = currentItems;
                updatedItems.pop();
            }
            //Any other item
            else
            {
                updatedItems = currentItems.slice(0,index).concat(currentItems.slice(index+1,currentItems.length))
            }
        }

        if(updatedItems){
            this.setState({items:updatedItems});
        }
      }
  }

  render()
  {
      let parentItemAdditionHandler = this.newItemHandler;
      let parentItemDeletionHandler = this.deleteItemHandler;
      return <View style={{flex:1, alignItems:'center'}}>
              <View style={{flex:1, justifyContent: 'center', height: 30, minHeight:30}}>
                <Text style={{fontSize:20, fontWeight: 'bold', padding: 3}}> {this.state.shopping_list_name} </Text>
              </View>
              <View style={{flex:11, justifyContent:'flex-start', alignSelf:'stretch'}}>
                <View style={{flex:1}}>
                  <NewItem sl_id={0} name='' qty={1} parentItemAdditionHandler = { parentItemAdditionHandler } />
                </View>
                <View style={{flex:10}}>
                  <ScrollView>
                    <FlatList
                      data = { this.state.items }
                      renderItem = {
                          function ( listEntry: { index: number, item: ShoppingListItem } ) { 
                          const item = listEntry.item;
                          return <SingleItem id={item.id} sl_id={item.sl_id} name={item.item_name} qty={item.item_qty} parentItemDeletionHandler={ parentItemDeletionHandler } />
                          }
                      }
                    />
                  </ScrollView>
                </View>
              </View>
            </View>
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center'
    }
  });
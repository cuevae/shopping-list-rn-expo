import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList, ScrollView, RefreshControl } from 'react-native';
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
    sl_id ?: number,
    shopping_list_name?: string,
    items?: ShoppingListItem[],
    refreshing ?: boolean
}

export interface ShoppingListProps{
    shopping_list_name: string,
    items: ShoppingListItem[],
    client_socket: SocketIOClient.Socket
}

export default class ShoppingList extends React.Component
{
 
  //state declaration
  state: ShoppingListState;
  props: ShoppingListProps;
  client_socket : SocketIOClient.Socket;

  constructor( props: ShoppingListProps )
  {
    super(props);
    this.client_socket = props.client_socket;
    this.state = {
        sl_id: 0,
        shopping_list_name: '',
        items: [],
        refreshing: true
    }

    this.client_socket.on(constants.ITEMS_RETRIEVED, (res : Store_ShoppingListItemsResponse) => {
      this.setState( {sl_id: res.id, shopping_list_name : res.name, items: res.shopping_lists_items, refreshing: false} );
    });

    this.client_socket.on('CLIENT_AVAILABLE_SHOPPING_LISTS', (data) => {
      console.log('here');
      console.log(data);
    });

    this.newItemHandler = this.newItemHandler.bind(this);
    this.deleteItemHandler = this.deleteItemHandler.bind(this);
  }

  setState(newState: { sl_id ?: number, shopping_list_name?: string, items?: ShoppingListItem[], refreshing?: boolean}) 
  {
    // console.log('list set state called');
    // if(newState.items){
    //   console.log('with items:')
    //   console.log(newState.items);
    // }
    super.setState(newState);
  }

  componentDidMount()
  {
    console.log('list mount called');
    if(this.client_socket){
      this.setState( { refreshing:true } );

      this.client_socket.emit(constants.LIST_ITEMS);
    }
  }

  newItemHandler(newItem : ShoppingListItem)
  {
      // let currentItems = (this.state.items && this.state.items.length > 0) ? this.state.items : [];
      // //updated list of items
      // let updatedItems = [newItem].concat(currentItems);
      // this.setState(
      //     {
      //       items : updatedItems,
      //     }
      //   );
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

  handleListItemsRefresh(){
    this.setState({refreshing:true});

    this.client_socket.emit(constants.LIST_ITEMS);

    this.client_socket.on(constants.ITEMS_RETRIEVED, (res : Store_ShoppingListItemsResponse) => {
      this.setState( {shopping_list_name : res.name, items: res.shopping_lists_items, refreshing: false} );
    });

    //this.fetchItemsFromApi();
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
                  <NewItem sl_id={this.state.sl_id} name='' qty={1} client_socket={this.client_socket} parentItemAdditionHandler = { parentItemAdditionHandler } />
                </View>
                <View style={{flex:10}}>
                  <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing ? this.state.refreshing : false} onRefresh={this.handleListItemsRefresh.bind(this)}></RefreshControl>}>
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
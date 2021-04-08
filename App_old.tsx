import React, {Component} from 'react';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux'
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList, ScrollView } from 'react-native';
//import ShoppingList from './src/components/list_items'
import Constants from 'expo-constants';
//import openSocket from 'socket.io-client';
//import reducer from './src/store/reducers'

//const store = createStore(reducer);

export default class Test extends React.Component {

  constructor(props)
  {
    super(props);
  }

  render(){
    return(
        <View>
          <Text>Hello world</Text>
        </View>
    )
  }
}

/*class ShoppingListDisplay extends React.Component
{

  client_socket : SocketIOClient.Socket|null = null;

  constructor(props)
  {
    super(props);

    console.log('constructor');

    //Connect to socket
    if(this.client_socket){
      console.log('Socket already exists with id: ' + this.client_socket.id);
    } else {

      console.log('est socket connection');
      
      this.client_socket = openSocket('http://192.168.1.149:3333/shopping_lists', {reconnection : false});
      this.client_socket.on('connect_error', () => {
        console.log('failed connecting to socker server');
        this.client_socket.close();
        this.client_socket = null;
      });
      this.client_socket.on('connect', () => {
        this.setState({socket_connected:true})
        console.log('socket connected: ' + this.client_socket.id);
      });
    }

  }

  render()
  {
    if(this.client_socket && this.client_socket.connected){
      //By default showing an empty shopping list
      return (
        <Provider store={store}>
          <View style={styles.container}>
            <SafeAreaView style={{flex:1}}>
              <ShoppingList shopping_list_name='' items={[]} client_socket ={this.client_socket}/>
            </SafeAreaView>
          </View>
        </Provider>
      );
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            <SafeAreaView style={{flex:1}}>
              <Text>Could not connect to socket</Text>
            </SafeAreaView>
          </View>
        </Provider>
      );
    }
  }
}*/

function mapStateToProps (state)
{
  return {
    test : state.test
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: Constants.statusBarHeight,
    alignItems: 'center'
  }
});
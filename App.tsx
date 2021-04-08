import React, {Component} from 'react';
import Constants from 'expo-constants';
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList, ScrollView } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { PersistGate } from 'redux-persist/integration/react';


/**
 * 
 * CONFIG STORE AND PERSISTORS
 * 
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const {
  middleware: offlineMiddleware,
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore
} = createOffline({
  ...offlineConfig,
  persist: false
});

const initialState = { value: 0 }
function reducer(state = initialState, action){
  if(action.type === 'sla/add_item_request'){
    console.log('add_item_request');
  } else if (action.type === 'sla/add_item_commit'){
    console.log('add_item_commit')
  } else {
    console.log('other')
  }
  return state;
}

const persistedReducer = persistReducer(
  persistConfig,
  offlineEnhanceReducer(reducer)
);

const store = createStore(
  persistedReducer,
  composeWithDevTools(
    offlineEnhanceStore,
    applyMiddleware(thunk, offlineMiddleware)
  )
);

const persistor = persistStore(store);

/**
 * 
 * END config store and persistors
 * 
 */


/**
 * 
 * Actions and action creators
 * 
 */

/** Example */
/*const followUser = userId => ({
  type: 'FOLLOW_USER_REQUEST',
  payload: { userId },
  meta: {
    offline: {
      // the network action to execute:
      effect: { url: '/api/follow', method: 'POST', json: { userId } },
      // action to dispatch when effect succeeds:
      commit: { type: 'FOLLOW_USER_COMMIT', meta: { userId } },
      // action to dispatch if network action fails permanently:
      rollback: { type: 'FOLLOW_USER_ROLLBACK', meta: { userId } }
    }
  }
});*/

const add_item = payload => ({
  type: 'sla/add_item_request',
  payload: payload,
  meta: {
    offline: {
      effect: {url:'',method:'', json:{}},
      commit: {type: 'sla/add_item_commit', meta:{}},
      rollback: {type: 'sla/add_item_rollback', meta:{}}
    }
  }
});

const remove_item = payload => ({
  type: 'sla/remove_item_request',
  payload: payload,
  meta: {
    offline: {
      effect: {url:'',method:'', json:{}},
      commit: {type: 'sla/remove_item_commit', meta:{}},
      rollback: {type: 'sla/remove_item_rollback', meta:{}}
    }
  }
});

/**
 * 
 * END Actions and action creators
 * 
 */

class Test2 extends React.Component {
  
  render(){
    return(
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text style={{flex:1}}>Loading... boom boom</Text>
      </View>
    )
  }

}

export default class Test extends React.Component {

  constructor(props)
  {
    super(props);
  }

  render(){
    return(
      <Provider store={store}>
        <PersistGate loading={<Test2 />} persistor={persistor}>
        <View style={styles.container}>
          <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, alignItems:'center'}}>
                <View style={{flex:1, alignItems:'flex-end'}}>
                  <Text>Online</Text>
                </View>
                <View style={{flex:1, justifyContent: 'center', height: 30, minHeight:30}}>
                  <Text style={{fontSize:20, fontWeight: 'bold', padding: 3}}>Shopping List Name Here</Text>
                </View>
                <View style={{flex:11, justifyContent:'flex-start', alignSelf:'stretch'}}>
                  <View style={{flex:1}}>
                    <Text>New Item</Text>
                  </View>
                  <View style={{flex:10}}>
                    <Text>Scroll View + Flat List</Text>
                  </View>
                </View>
              </View>

          </SafeAreaView>
          </View>
        </PersistGate>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: Constants.statusBarHeight,
    alignItems: 'center'
  }
});


/*<View style={{flex:1, alignItems:'center'}}>
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
              </View>*/
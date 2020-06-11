import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList, ScrollView } from 'react-native';
import ShoppingList from './src/components/list_items'
import Constants from 'expo-constants';

export default class ShoppingListDisplay extends React.Component
{
  render()
  {
    //By default showing an empty shopping list
    return <View style={styles.container}>
      <SafeAreaView style={{flex:1}}>
        <ShoppingList shopping_list_name='' items={[]}/>
      </SafeAreaView>
    </View>
    ;
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: Constants.statusBarHeight,
    alignItems: 'center'
  }
})
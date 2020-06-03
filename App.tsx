import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList } from 'react-native';
import ShoppingList from './src/components/list_items'

export default class ShoppingListDisplay extends React.Component
{
  render()
  {
    //By default showing an empty shopping list
    return <SafeAreaView><ShoppingList shopping_list_name='' items={[]}/></SafeAreaView>;
  }
}
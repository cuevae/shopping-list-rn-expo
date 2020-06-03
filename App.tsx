import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { StyleSheet, Text, View, SafeAreaView, SectionList, FlatList } from 'react-native';
import Header from './src/components/header'
import ShoppingListItems from './src/components/list_items'

export default class ShoppingListDisplay extends React.Component< {}, {} >
{
  render()
  {
    return <SafeAreaView>
    <Header></Header>
    <ShoppingListItems items={[]}></ShoppingListItems>
  </SafeAreaView>;
  }
}

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';


export interface HeaderProps
{
    headline: string;
}

export interface HeaderState
{
    headline: string;
}

export default class Header extends React.Component< {}, {} >
{
  constructor(props: {})
  {
    super(props);
  }

  render()
  {
    return <SafeAreaView><View><Text>This is the header</Text></View></SafeAreaView>
  }

}
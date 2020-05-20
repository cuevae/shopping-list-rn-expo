import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, SectionList } from 'react-native';

interface Section {
  title: string,
  data: string[]
}

const DATA: Section[] = 
[
  {
    title: "Main dishes",
    data: ["Pizza", "Burger", "Risotto"]
  },
  {
    title: "Sides",
    data: ["French Fries", "Onion Rings", "Fried Shrimps"]
  },
  {
    title: "Drinks",
    data: ["Water", "Coke", "Beer"]
  },
  {
    title: "Desserts",
    data: ["Cheese Cake", "Ice Cream"]
  }
];

function ItemDisplay(itemName: string){
  return <View style={styles.item}>
    <Text>{itemName}</Text>
    </View>
}

function ItemHeaderDisplay(section: {title: string}){
  return <View>
    <Text style={styles.header}>{section.title}</Text>
    </View>
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the current shopping list</Text>
      <SectionList
        sections = {DATA}
        keyExtractor = {
          (itemName: string, itemIndex: number) => 
          {
            return itemName + itemIndex;
          }
        }
        renderItem = {
          (itemObject: {item: string}) => ItemDisplay(itemObject.item)
        }
        renderSectionHeader = {
          (sectionWrapObject: {section: {title: string}}) => ItemHeaderDisplay(sectionWrapObject.section)
        }
      />
    </SafeAreaView>
  );
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

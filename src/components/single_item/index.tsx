import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';

interface SingleItemProps{
    id: number,
    sl_id: number,
    name: string,
    qty: number
}

interface SingleItemState{
    loading: boolean,
}

export class SingleItem extends React.Component < SingleItemProps, SingleItemState >
{

    state: SingleItemState;
    props: SingleItemProps;

    constructor(props: SingleItemProps){
        super(props);
        this.state = {
            loading: false
        }
    }

    render(){
        return <View style={{flexDirection:'row', flex:1, width:300, justifyContent:'flex-start', alignItems:'center', marginBottom: 3}}>
                    <Text style={{flex:1}}>{this.props.qty}</Text>
                    <Text style={{flex:5}}>{this.props.name}</Text>
                    <Button 
                        style={{flex:2}} 
                        color='grey'
                        title="Rem" 
                        onPress={()=>console.log('Remove button pressed')} 
                    />
                </View>
    }
}

interface NewItemProps{
    sl_id: number,
    name: string,
    qty: 1
}

interface NewItemState{}

export class NewItem extends React.Component< NewItemProps, NewItemState >
{

    state: NewItemState;
    props: NewItemProps;

    constructor(props:NewItemProps)
    {
        super(props);
        this.state = {}
    }

    render(){
        return <View style={{flexDirection:'row', flex:1, width:300, justifyContent:'flex-start', alignItems:'center', marginBottom: 3 }}>
                    <TextInput defaultValue='1' style={{flex:1, width:5, color: 'lightgray'}}/>
                    <TextInput defaultValue='Add a new item to the list...' style={{flex:5, color: 'lightgray'}}/>
                    <Button 
                        style={{flex:2}} 
                        color='yellowgreen'
                        title="Add" 
                        onPress={()=>console.log('Add button pressed')} 
                    />
                </View>
    }

}
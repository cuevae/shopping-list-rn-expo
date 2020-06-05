import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity } from 'react-native';
import * as constants from '../../constants';
import { ShoppingListItem } from '../list_items';

interface SingleItemProps{
    id: number,
    sl_id: number,
    name: string,
    qty: number
    parentItemDeletionHandler: (deletedItem : ShoppingListItem) => void
}

interface SingleItemState{
    editable: boolean
}

export class SingleItem extends React.Component < SingleItemProps, SingleItemState >
{

    state: SingleItemState;
    props: SingleItemProps;

    constructor(props: SingleItemProps){
        super(props);
        this.state = {
            editable: false
        }
    }

    setState(state: SingleItemState ) 
    {
        super.setState(state);
    }

    handleExistingItemRemoval(existingItem : SingleItemProps)
    {
        let {id, sl_id} = existingItem;
        if(id && sl_id)
        {
            fetch(
                constants.API_URL + 'shopping_lists_items?id=eq.' + id + '&sl_id=eq.' + sl_id,
                {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Prefer: 'return=representation'
                    }
                }
            )
            .then(
                (response) => {
                    if(response.status !== 200){
                        throw 'Item could not be deleted';
                    }
                    let data = response.json();
                    return data;
                }
            )
            .then(
                (data) => {
                    let deletedItem = data[0];
                    this.props.parentItemDeletionHandler(deletedItem);
                }
            )
            .catch(
                //TODO: handle error
                (error) => {console.log(error)}
            )
        }
    }

    turnItemEditable()
    {
        console.log('turning editable on');
        this.setState({editable:true});
    }

    render(){
        let {name, qty} = this.props;
        let enoughDetailsToSubmit = (name && name.length > 0);
        if(this.state.editable)
        {
            console.log('editable now');
            return <View style={{flexDirection:'row', flex:1, width:300, justifyContent:'flex-start', alignItems:'center', marginBottom: 3 }}>
                <TextInput
                    placeholder={`${qty}`}
                    placeholderTextColor='lightgray'
                    style={{flex:1, width:5}}
                    value= {( (qty && qty > 0) ? `${qty}` : '')}
                    onChangeText={(text: string) => {
                        console.log(text);
                        //this.handleExistingItemQtyChange(text)
                    }}
                />
                <TextInput
                    placeholder={name}
                    placeholderTextColor='lightgray'
                    onChangeText={(text: string) => {
                        console.log(text);
                        //this.handleExistingItemNameChange(text)
                    }}
                    style={{flex:5}}
                    value={((name && name.length > 0 ? name : ''))}
                />
                <TouchableOpacity
                    style={[styles.submitButton, !enoughDetailsToSubmit ? styles.submitButtonDisabled : []]}
                    disabled={!enoughDetailsToSubmit}
                    onPress={() => {
                        console.log('Save Button pressed')
                        //this.handleNewItemSubmission()
                    }}
                >
                    <Text style={{}}>UPD</Text>
                </TouchableOpacity>
            </View>
        } else {
            console.log('non - editable');
            let {name, qty} = this.props;
            let qtyToDisplay = (qty && qty > 1) ? ' (' + `${qty}` + ')'  : '';
            return <View style={{flexDirection:'row', flex:1, width:300, justifyContent:'flex-start', alignItems:'center', marginBottom: 3}}>
                        <Text 
                            style={{flex:6}}
                            onPress={()=>{
                                this.turnItemEditable()
                                console.log('Press')
                            }}
                            onLongPress={()=>{
                                console.log('LongPress');
                                //this.turnItemEditable
                            }}
                        >
                            {name + qtyToDisplay}
                        </Text>
                        <TouchableOpacity
                            style={styles.removeButton} 
                            onPress={() => {this.handleExistingItemRemoval(this.props)}}
                        >
                            <Text style={{}}>REM</Text>
                        </TouchableOpacity>
                    </View>
        }
    }
}

interface NewItemProps{
    sl_id: number,
    name: string,
    qty: 1,
    parentItemAdditionHandler: (newItem : ShoppingListItem) => void
}

interface NewItemState{
    qty?: number,
    name?: string
}

export class NewItem extends React.Component< NewItemProps, NewItemState >
{

    state: NewItemState;
    props: NewItemProps;

    constructor(props: NewItemProps)
    {
        super(props);
        this.state = {}
    }

    setState(state: NewItemState) {
        super.setState(state);
    }

    handleNewItemSubmission()
    {
        let name = this.state.name;
        if(name && name.length > 0)
        {
            fetch(
                constants.API_URL + 'shopping_lists_items',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Prefer: 'return=representation'
                    },
                    body: JSON.stringify(
                        {
                            sl_id: 2,
                            item_name: this.state.name,
                            item_qty: this.state.qty && this.state.qty > 0 ? this.state.qty : 1
                        }
                    )
                }
            )
            .then(
                (response) => {
                    if(response.status !== 201){
                        throw 'Item could not be added';
                    }
                    let data = response.json();
                    return data;
                }
            )
            .then(
                (data) => {
                    let newItem = data[0];
                    this.props.parentItemAdditionHandler(newItem);
                    this.setState({qty:undefined,name:''});
                }
            )
            .catch(
                //TODO: handle error
                (error) => {console.log(error)}
            )
        }
    }

    handleNewItemQtyChange( text: string ){
        let qtyReceived = (text && text.length > 0 ) ? parseInt(text) : undefined;
        let qtyToUse;
        if( qtyReceived ){
            if(qtyReceived>0 && qtyReceived < 1000)
            {
                qtyToUse = qtyReceived;
            } else if(qtyReceived > 1000) {
                //Max number of items
                qtyToUse = 1000;
            } else {
                qtyToUse = 1
            }
        } else {
            qtyToUse = undefined;
        }
        this.setState({qty: qtyToUse})
    }

    handleNewItemNameChange( text: string ){
        this.setState({name: text})
    }

    render(){
        let {qty, name } = this.state;
        let enoughDetailsToSubmit = (name && name.length > 0);
        return <View style={{flexDirection:'row', flex:1, width:300, justifyContent:'flex-start', alignItems:'center', marginBottom: 3 }}>
                <TextInput
                    placeholder='1'
                    placeholderTextColor='lightgray'
                    style={{flex:1, width:5}}
                    value= {( (qty && qty > 0) ? `${qty}` : '')}
                    onChangeText={(text: string) => {this.handleNewItemQtyChange(text)}}
                />
                <TextInput
                    placeholder='Start typing to add a new item'
                    placeholderTextColor='lightgray'
                    onChangeText={(text: string) => {this.handleNewItemNameChange(text)}}
                    style={{flex:5}}
                    value={((name && name.length > 0 ? name : ''))}
                />
                <TouchableOpacity
                    style={[styles.submitButton, !enoughDetailsToSubmit ? styles.submitButtonDisabled : []]}
                    disabled={!enoughDetailsToSubmit}
                    onPress={() => this.handleNewItemSubmission()}
                >
                    <Text style={{}}>ADD</Text>
                </TouchableOpacity>
            </View>
        
    }

}

const styles = StyleSheet.create({
    submitButton: {
      alignItems: "center",
      backgroundColor: 'yellowgreen',
      padding: 10
    },
    submitButtonDisabled: {
        opacity: 0.5
    },
    removeButton: {
        alignItems: "center",
        backgroundColor: 'lightgray',
        padding: 10
      }
  });
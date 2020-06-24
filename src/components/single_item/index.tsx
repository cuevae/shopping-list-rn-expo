import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity } from 'react-native';
import * as constants from '../../constants';
import { ShoppingListItem } from '../list_items';

interface SingleItemProps{
    id: number,
    sl_id: number,
    name: string,
    qty: number,
    parentItemDeletionHandler: (deletedItem : ShoppingListItem) => void
}

interface SingleItemState{
    name ?: string,
    qty ?: number,
    editable ?: boolean
}

export class SingleItem extends React.Component < SingleItemProps, SingleItemState >
{

    state: SingleItemState;
    props: SingleItemProps;

    constructor(props: SingleItemProps){
        super(props);
        this.state = {
            name : props.name,
            qty: props.qty,
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

    handleItemQtyChange( text: string ){
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

    handleItemUpdate()
    {
        let name = this.state.name;
        let qty = this.state.qty;
        let id = this.props.id;
        if(name && name.length > 0)
        {
            fetch(
                constants.API_URL + 'shopping_lists_items?id=eq.' + id,
                {
                    method: 'PATCH',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Prefer: 'return=representation'
                    },
                    body: JSON.stringify(
                        {
                            item_name: name,
                            item_qty: ( qty && qty > 0 ) ? qty : 1
                        }
                    )
                }
            )
            .then(
                (response) => {
                    if(response.status !== 200){
                        throw 'Item could not be added';
                    }
                    let data = response.json();
                    return data;
                }
            )
            .then(
                (data) => {
                    let newItem = data[0];
                    //this.props.parentItemUpdateHandler(updatedItem);
                    this.setState({editable:false});
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
        this.setState({editable:true});
    }

    render(){
        if(this.state.editable)
        {
            let {name, qty} = this.state;
            let enoughDetailsToSubmit = (name && name.length > 0);
            return <View style={{flexDirection:'row', flex:1, width:300, justifyContent:'flex-start', alignItems:'center', marginBottom: 3 }}>
                <TextInput
                    placeholder={`${qty}`}
                    placeholderTextColor='lightgray'
                    style={{flex:1, width:5}}
                    value= {( (qty && qty > 0) ? `${qty}` : '')}
                    onChangeText={(text: string) => {this.handleItemQtyChange(text)}}
                />
                <TextInput
                    placeholder={name}
                    placeholderTextColor='lightgray'
                    onChangeText={(text: string) => {this.setState({name:text})}}
                    style={{flex:5}}
                    value={((name && name.length > 0 ? name : ''))}
                />
                <TouchableOpacity
                    style={[styles.submitButton, !enoughDetailsToSubmit ? styles.submitButtonDisabled : []]}
                    disabled={!enoughDetailsToSubmit}
                    onPress={() => {
                        this.handleItemUpdate();
                    }}
                >
                    <Text style={{}}>UPD</Text>
                </TouchableOpacity>
            </View>
        } else {
            let {name, qty} = this.state;
            let qtyToDisplay = (qty && qty > 1) ? ' (' + `${qty}` + ')'  : '';
            return <View style={{flexDirection:'row', flex:1, width:300, justifyContent:'flex-start', alignItems:'center', marginBottom: 3}}>
                        <Text 
                            style={{flex:6}}
                            onLongPress={()=>{
                                this.turnItemEditable()
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
    client_socket: SocketIOClient.Socket,
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
    client_socket: SocketIOClient.Socket;

    constructor(props: NewItemProps)
    {
        super(props);
        this.client_socket = props.client_socket;
        this.state = {}
    }

    setState(state: NewItemState) {
        super.setState(state);
    }

    handleNewItemSubmission()
    {

        console.log('handling new item submission');
        //console.log(this.client_socket);

        let name = this.state.name;
        if(name && name.length > 0)
        {

            this.client_socket.emit(
                constants.ADD_ITEM, 
                {
                    sl_id: this.props.sl_id, 
                    name: this.state.name, 
                    qty: this.state.qty
                }
            );

            this.setState({qty:undefined,name:''});

            this.client_socket.emit(constants.LIST_ITEMS);

            // this.client_socket.on(
            //     constants.ITEM_ADDED, 
            //     (newItem: ShoppingListItem) => {
            //         this.props.parentItemAdditionHandler(newItem);
            //         this.setState({qty:undefined,name:''});
            //     }
            // );

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
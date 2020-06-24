import { Message, SEND_MESSAGE, DELETE_MESSAGE, ChatActionTypes } from './types';

export function send_message( new_message: Message ) : ChatActionTypes {
    return {
        type: SEND_MESSAGE,
        payload: new_message
    }
}

export function delete_message( timestamp: number ) : ChatActionTypes {
    return {
        type: DELETE_MESSAGE,
        meta: {
            timestamp
        }
    }
}
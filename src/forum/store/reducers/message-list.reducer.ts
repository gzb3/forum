
import * as fromMessageList from '../actions/message-list.actions';
import {Message} from '../../models/message.model';
import {Conversation} from '../../models/conversation.model';

export interface MessageListState {
    conversation:Conversation
    entities:{[id:number]:Message};//conversation messages
    newMessages?:{[id:number]:Message};//notification new messages
    loaded?:any;
}

export const initialState:MessageListState={
    conversation:null,
    entities:{},
    newMessages:{},
    loaded:false

};

export function reducer(state=initialState,action:fromMessageList.messageListAction):MessageListState {

    switch (action.type){

        //notification messages (from all conversations)
        case fromMessageList.LOAD_NEW_MESSAGES_SUCCESS:{
            const newMessages=action.payload.reduce(
                (newMessages:{[id:number]:Message},message:Message)=>{
                    return{
                        ...newMessages,
                        [message.id]:message
                    }
                },{...state.newMessages
                });
            return{
                ...state,
                loaded:true,
                newMessages
            }
        }
        case fromMessageList.LOAD_NEW_MESSAGES:{
            return{
                ...state,
                loaded:false,
                newMessages:{}
            }
        }
                //from single conversation
        case fromMessageList.UPDATE_MESSAGES_SUCCESS:
        case fromMessageList.LOAD_MESSAGES_SUCCESS:{
            const conversation=action.payload.conversation;
            const entities=action.payload.messages.reduce(
                (entities:{[id:number]:Message},message:Message)=>{
                    return{
                        ...entities,
                        [message.id]:message
                    }
                },{...state.entities
                });
            return{
                ...state,
                conversation,
                entities
            }
        }
        case fromMessageList.ADD_MESSAGE_SUCCESS:{

            const message=action.payload;
            const entities={
                ...state.entities,
                [message.id]:message
            };
            return{
                ...state,
                entities
            }
        }
        case fromMessageList.LOAD_MESSAGES:{
            return {
                ...state,
                entities:{}
            };
        }

    }
    return state
}

export const getMessageListEntities=(state:MessageListState)=>state.entities;
export const getConversation= (state:MessageListState)=>state.conversation;
export  const getNewMessagesEntities=(state:MessageListState)=>state.newMessages;
export const newMessagesLoaded=(state:MessageListState)=>state.loaded;















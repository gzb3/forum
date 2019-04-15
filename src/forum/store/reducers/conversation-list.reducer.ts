import * as fromConversationList from '../actions/conversation-list.actions';
import {Conversation} from '../../models/conversation.model';

export interface ConversationListState {
    entities:{[id:number]:Conversation};
}

export const initialState:ConversationListState={
    entities:{},
};

export function reducer(state=initialState,action:fromConversationList.conversationListAction):ConversationListState {

    switch (action.type){

        case fromConversationList.LOAD_CONVERSATIONS_SUCCESS:{

            const entities=action.payload.reduce(
                (entities:{[id:number]:Conversation},conversation:Conversation)=>{
                    return {
                        ...entities,
                        [conversation.id]:conversation
                    }
                },{
                    ...state.entities
                });
            return{
                ...state,
                entities
            }
        }
        case fromConversationList.LOAD_CONVERSATIONS:{
            return {entities:{}};
        }
        case fromConversationList.ADD_CONVERSATION_SUCCESS:{
            const conversation=action.payload;
            const entities={
                ...state.entities,
                [conversation.id]:conversation
            };
            return{
                ...state,
                entities
            }
        }
    }
    return state
}

export const getConversationListEntities=(state:ConversationListState)=>state.entities;




import {Action} from '@ngrx/store';
import {Message} from '../../models/message.model';
import {Conversation} from '../../models/conversation.model';

export const ADD_CONVERSATION='[Forum] Add Conversation';
export const ADD_CONVERSATION_SUCCESS='[Forum] Add Conversation Success';
export const REMOVE_CONVERSATION='[Forum] Remove Conversation';
export const REMOVE_CONVERSATION_SUCCESS='[Forum] Remove Conversation Success';
export const LOAD_CONVERSATIONS='[Forum] Load Conversations';
export const LOAD_CONVERSATIONS_SUCCESS='[Forum] Load Conversations Success';

export class AddConversation implements Action{
    readonly type= ADD_CONVERSATION;
    constructor(public payload:[Conversation,Message]){}
}
export class AddConversationSuccess implements Action{
    readonly type= ADD_CONVERSATION_SUCCESS;
    constructor(public payload:any){}
}

export class RemoveConversation implements Action{
    readonly type= REMOVE_CONVERSATION;
    constructor(public payload:any){}
}

export class RemoveConversationSuccess implements Action{
    readonly type= REMOVE_CONVERSATION_SUCCESS;
    constructor(public payload:any){}
}

export class LoadConversations implements Action{
    readonly type=LOAD_CONVERSATIONS;
    constructor(public payload:string){}
}

export class LoadConversationsSuccess implements Action{
    readonly type=LOAD_CONVERSATIONS_SUCCESS;
    constructor(public payload:any[]){}
}

export type conversationListAction= LoadConversations| LoadConversationsSuccess| AddConversation| AddConversationSuccess|RemoveConversation|RemoveConversationSuccess;

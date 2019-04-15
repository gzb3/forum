import {Action} from '@ngrx/store';
import {Message} from '../../models/message.model';
import {Conversation} from '../../models/conversation.model';

export const ADD_MESSAGE='[Forum] Add Message';
export const ADD_MESSAGE_SUCCESS='[Forum] Add Message Success';
export const REMOVE_MESSAGE='[Forum] Remove Message';
export const REMOVE_MESSAGE_SUCCESS='[Forum] Remove Message Success';
export const LOAD_MESSAGES='[Forum] Load Messages';//LOADS ALL MESSAGES FROM CONVERSATION
export const LOAD_MESSAGES_SUCCESS='[Forum] Load Messages Success';
export const UPDATE_MESSAGES='[Forum] Update Messages';//UPDATES MESSAGES FROM CONVERSATION
export const UPDATE_MESSAGES_SUCCESS='[Forum] Update Messages Success';
export const LOAD_NEW_MESSAGES='[Forum] Load New Messages';//LOADS ALL NEW MESSAGES FOR USER FROM ALL CONVERSATIONS
export const LOAD_NEW_MESSAGES_SUCCESS='[Forum] Load New Messages Success';
export const NOTIFICATION_CHECK='[Forum] Notification Check';
export const NOTIFICATION_CHECK_SUCCESS='[Forum] Notification Check Success';

export class NotificationCheck implements Action{
    readonly type= NOTIFICATION_CHECK;//userId
    constructor(public payload:string){}
}
export class NotificationCheckSuccess implements Action{
    readonly type= NOTIFICATION_CHECK_SUCCESS;
    constructor(public payload:any){}
}
export class LoadNewMessages implements Action{
    readonly type=LOAD_NEW_MESSAGES;
                            //userId
    constructor(public payload:string){}
}

export class LoadNewMessagesSuccess implements Action{
    readonly type=LOAD_NEW_MESSAGES_SUCCESS;
    constructor(public payload:Message[]){}
}

export class AddMessage implements Action{
    readonly type= ADD_MESSAGE;
    constructor(public payload:Message){}
}

export class AddMessageSuccess implements Action{
    readonly type= ADD_MESSAGE_SUCCESS;
    constructor(public payload:any){}
}

export class RemoveMessage implements Action{
    readonly type= REMOVE_MESSAGE;
    constructor(public payload:any){}
}

export class RemoveMessageSuccess implements Action{
    readonly type= REMOVE_MESSAGE_SUCCESS;
    constructor(public payload:any){}
}

export class LoadMessages implements Action{
    readonly type= LOAD_MESSAGES;
    constructor(public payload:any){}
}
export class LoadMessagesSuccess implements Action{
    readonly type = LOAD_MESSAGES_SUCCESS;
    constructor(public payload:{conversation:Conversation,messages:Message[]}){}
}

export class UpdateMessages implements Action{
    readonly type= UPDATE_MESSAGES;
    constructor(public payload:{conversationId:any,lastMessageId:any}){}
}
export class UpdateMessagesSuccess implements Action{
    readonly type = UPDATE_MESSAGES_SUCCESS;
    constructor(public payload:{conversation:Conversation,messages:Message[]}){}

}

export type messageListAction= NotificationCheck | NotificationCheckSuccess |LoadNewMessages|LoadNewMessagesSuccess| UpdateMessages| UpdateMessagesSuccess|LoadMessages|LoadMessagesSuccess| AddMessage| AddMessageSuccess|RemoveMessage|RemoveMessageSuccess;
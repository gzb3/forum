import {Action} from '@ngrx/store';
import {User} from '../../models/user.model';

export const LOAD_USER='[Forum] Load User';
export const LOAD_USER_SUCCESS='[Forum] Load User Success';
export const LOAD_USERS='[Forum] Load Users';
export const LOAD_RECENT_USERS='[Forum] Load Recent Users';
export const LOAD_SEARCH_USERS='[Forum] Load Search Users';
export const LOAD_USERS_SUCCESS='[Forum] Load Users Success';
export const CHECK_CONVERSATION_AVAILABILITY='[Forum] Check Conversation Availability';
export const CHECK_CONVERSATION_AVAILABILITY_COMPLETED='[Forum] Check Conversation Availability Completed';
export const BAN_USERS='[Forum] Ban Users';
export const UNBAN_USERS='[Forum] Unban Users';
export const DELETE_USERS='[Forum] Delete Users';
export const EDIT_USER_PROFILE='[Forum] Edit User Profile';

export class EditUserProfile implements Action{
    readonly type =EDIT_USER_PROFILE;
    constructor(public payload:any){}
}
export class BanUsers implements Action{//userIds time
    readonly type=BAN_USERS;
            constructor(public payload:[string[],string]){}
}
export class UnbanUsers implements Action{
    readonly type=UNBAN_USERS;//userIDs
    constructor(public payload:string[]){}
}
export class DeleteUsers implements Action{
    readonly type=DELETE_USERS;         //delete content
    constructor(public payload:[string[],boolean]){}
}
export class LoadUsers implements Action{
    readonly type =LOAD_USERS;
    constructor(public payload?:any){}
}
export class LoadUsersSuccess implements Action{
    readonly  type= LOAD_USERS_SUCCESS;
    constructor(public payload:User){}
}
export class LoadUser implements Action{
    readonly type =LOAD_USER;
    constructor(public  payload:string){}
}
export class LoadUserSuccess implements Action{
    readonly  type= LOAD_USER_SUCCESS;
    constructor(public payload:User){}
}
export class LoadRecentUsers implements Action{
    readonly type =LOAD_RECENT_USERS;
    constructor (){}
}
export class LoadSearchUsers implements Action{
    readonly type =LOAD_SEARCH_USERS;
    constructor (public payload:any){}
}
export class CheckConversationAvailability implements Action{
    readonly type =CHECK_CONVERSATION_AVAILABILITY;
                                //conversationId,token
    constructor (public payload:string[]){}
}
export class CheckConversationAvailabilityCompleted implements Action{
    readonly type =CHECK_CONVERSATION_AVAILABILITY_COMPLETED;
    constructor (public payload:boolean){}

}
export type userAction=EditUserProfile|BanUsers|UnbanUsers|DeleteUsers|LoadUsers|LoadUser|LoadUserSuccess|
    LoadUsersSuccess| CheckConversationAvailability|CheckConversationAvailabilityCompleted|LoadRecentUsers|LoadSearchUsers;


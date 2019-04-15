import * as fromUser from '../actions/user.actions';
import {User} from '../../models/user.model';

export interface UserState {
    userList:any,
    user:User,
    loading:boolean,
    loaded:boolean,
    activateConversation:boolean
}
export const initialState:UserState={
    userList:[],
    user:{id:null},
    loading:false,
    loaded:false,
    activateConversation:null
};

export function reducer(state=initialState,action:fromUser.userAction):UserState{
     switch (action.type){

         case fromUser.CHECK_CONVERSATION_AVAILABILITY_COMPLETED:{
             let activateConversation=action.payload;
             return{
                 ...state,
                 activateConversation
             }
         }
         case fromUser.LOAD_USER:{
             return {
                 ...state,
                 loading:true,
                 loaded:false
             }
         }
         case fromUser.LOAD_USER_SUCCESS:{
             let user=action.payload;

             return{
                ...state,
                 loading:false,
                 loaded:true,
                 user
             }
         }
         case fromUser.LOAD_USERS_SUCCESS:{
             let userList=action.payload;
             return{
                 ...state,
                 userList
             }
         }
         case fromUser.LOAD_USERS:
         case fromUser.LOAD_RECENT_USERS:
         case fromUser.LOAD_SEARCH_USERS:{
             return{
                 ...state,
                 userList:[]
             }
         }
     }

     return state;
}

export const getProfile=(state:UserState)=>state.user;
export const getActivateConversation=(state:UserState)=>state.activateConversation;
export const getUsers=(state:UserState)=>state.userList;
export const getUserLoading=(state:UserState)=>state.loading;
export const getUserLoaded=(state:UserState)=>state.loaded;











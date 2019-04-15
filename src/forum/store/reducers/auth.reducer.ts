import {User} from '../../models/user.model';
import * as fromAuth from '../actions/auth.actions';

export interface AuthState {
    isAuthenticated:boolean;
    user:User|null;
    errorMessage:string|null;
}

export  const initialState:AuthState={
    isAuthenticated:!!localStorage.getItem('token'),
    user:{},
    errorMessage:null

};

export function reducer(state=initialState,action:fromAuth.authAction) {
    switch (action.type){

        case fromAuth.SIGNUP_SUCCESS:
        case fromAuth.LOGIN_SUCCESS:{
            let user=action.payload;
            return{
                ...state,
                isAuthenticated:true,
                user,
                errorMessage:null
            };
        }
        case fromAuth.LOGIN_FAILURE:{
            return {
                ...state,
                errorMessage:'Incorect email and/or password'
            };
        }
        case fromAuth.SIGNUP_FAILURE:{
            return{
                ...state,
                errorMessage:'That email is already in use.'
            }
        }
        case fromAuth.LOGOUT:{
            localStorage.removeItem('token');
            return{
                    isAuthenticated:false,
                    user:{},
                    errorMessage:null
            }
        }
        case fromAuth.KEEP_SUCCESS:{
            let user=action.payload;
            return{
                ...state,
                user
            }
        }
        default:
            return state;

    }
}
export const getErrorMessage=(state:AuthState)=>state.errorMessage;
export const getUser=(state:AuthState)=>state.user;
export const getIsAuthenticated=(state:AuthState)=>state.isAuthenticated;

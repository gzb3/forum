import {Action} from '@ngrx/store';
import {User} from '../../models/user.model';

export const LOGIN='[Forum] LogIn';
export const LOGIN_SUCCESS='[Forum] LogIn Success';
export const LOGIN_FAILURE='[Forum] Login Failure';
export const LOGOUT='[Forum] Logout';
export const SIGNUP='[Forum] Signup';
export const SIGNUP_SUCCESS='[Forum] SignUp Success';
export const SIGNUP_FAILURE='[Forum] SignUp Failure';

export const KEEP_LOGGED_IN='[Forum] Keep Logged In';
export const KEEP_SUCCESS='[Forum] Keep Success';

export class LogIn implements Action{
    readonly type=LOGIN;
    constructor(public payload:any){}
}

export class KeepLoggedIn implements Action{
    readonly  type=KEEP_LOGGED_IN;
    constructor(public  payload:string){}
}
export class KeepSuccess implements Action{
    readonly type=KEEP_SUCCESS;
    constructor(public payload:any){}
}

export class LogInSuccess implements Action{
    readonly type=LOGIN_SUCCESS;
    constructor(public payload:User){}
}

export class LoginFailure implements  Action{
    readonly type =LOGIN_FAILURE;
    constructor(public payload:any){}
}

export class SignUp implements Action{
    readonly type=SIGNUP;
    constructor(public payload:User){}
}

export class SignUpSuccess implements Action{
    readonly type =SIGNUP_SUCCESS;
    constructor(public payload:User){}
}

export class SignUpFailure implements Action{
    readonly type =SIGNUP_FAILURE;
    constructor(public payload:any){}
}

export class LogOut implements Action{
    readonly type=LOGOUT;
}
export type authAction=LogIn|LogInSuccess|LoginFailure|SignUp|SignUpSuccess|SignUpFailure|LogOut|KeepLoggedIn| KeepSuccess;
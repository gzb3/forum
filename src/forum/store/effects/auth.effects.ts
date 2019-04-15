import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as authActions from '../actions/auth.actions';
import * as fromRoot from '../../../app/store';
import {map, switchMap} from 'rxjs/operators';
import {User} from '../../models/user.model';
import {BackendUrlService} from '../../services/backendUrl.service';

@Injectable()
export class AuthEffects{
    servicesUrl;

    constructor(private actions$:Actions,private httpClient:HttpClient,private burl: BackendUrlService){
        this.servicesUrl=burl.getUrl();
    }
    @Effect()
    keepLoggedIn=this.actions$.pipe(
        ofType(authActions.KEEP_LOGGED_IN),
        map((action:authActions.KeepLoggedIn)=>action.payload),
        switchMap(
            payload=>{
                let url=this.servicesUrl+'/user.service.php';
                let body= new HttpParams()
                    .set('keep','1')
                    .set('token',payload);
                return this.httpClient.post(url,body,
                ).pipe(map(
                    (user)=>{
                        if(user){return new authActions.KeepSuccess(user)}
                    }));
            }
        )
    );
    @Effect()
    logIn=this.actions$.pipe(
        ofType(authActions.LOGIN),
        map((action:authActions.LogIn)=>action.payload),
        switchMap(payload=>{
            let url=this.servicesUrl+'/user.service.php';
            let body= new HttpParams()
                .set('login','1')
                .set('email',payload.email)
                .set('password',payload.password);
            return this.httpClient.post(url,body,
                                ).pipe(map(
                                    (user)=>{
                                        if(user){return new authActions.LogInSuccess(user)}
                                        else return new authActions.LoginFailure(user);
                                     }));
        })
    );

    @Effect()
    signUp=this.actions$.pipe(
        ofType(authActions.SIGNUP),
        map((action:authActions.SignUp)=>action.payload),
        switchMap(payload=>{
            let url=this.servicesUrl+'/user.service.php';
            let body= new HttpParams()
                .set('signup','1')
                .set('email',payload.email)
                .set('username',payload.username)
                .set('password',payload.password);

            return this.httpClient.post(url,body,
                {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
            ).pipe(map(
                (user)=>{
                    if(user){return new authActions.SignUpSuccess(user)}
                    else{return new authActions.SignUpFailure(user);}
                }));
        })
    );
    @Effect()
    logOut=this.actions$.pipe(
        ofType(authActions.LOGOUT),
        map((user)=>{
            localStorage.removeItem('token');
            return new fromRoot.Go({
                path:['./']
            });
        })
    );

    @Effect()
    authSuccess=this.actions$.pipe(
        ofType(authActions.LOGIN_SUCCESS,authActions.SIGNUP_SUCCESS),
        map((action:authActions.LogInSuccess|authActions.SignUpSuccess)=>action.payload),
        map((user:User)=>{
            localStorage.setItem('token',user.token);
            return new fromRoot.Go({
                path:['./']
            });
        })
    );

    @Effect({ dispatch: false })
    authFailure= this.actions$.pipe(
        ofType(authActions.LOGIN_FAILURE,authActions.SIGNUP_FAILURE)
    );
}
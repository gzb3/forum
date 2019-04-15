import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as userActions from '../actions/user.actions';
import * as authActions from '../actions/auth.actions';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {User} from '../../models/user.model';
import {Injectable} from '@angular/core';
import {BackendUrlService} from '../../services/backendUrl.service';

@Injectable()
export class UserEffects{
servicesUrl;

    constructor(private actions$:Actions,private httpClient:HttpClient,private burl:BackendUrlService){
        this.servicesUrl=burl.getUrl();
    }

    @Effect()
    editUserProfile$=this.actions$.pipe(
        ofType(userActions.EDIT_USER_PROFILE),
        map((action:userActions.EditUserProfile)=>action.payload),
        switchMap(formData=>{
            let url=this.servicesUrl+'/user.service.php';
            const headers = new HttpHeaders();
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');


            return this.httpClient.post(url,formData,{headers:headers}).pipe(
                map((user:User)=>{
                    return new authActions.KeepSuccess(user);
                })
            )
        })
    );

    @Effect()
    banUsers=this.actions$.pipe(
        ofType(userActions.BAN_USERS),
        map((action:userActions.BanUsers)=>action.payload),
        switchMap(payload=>{

            let url=this.servicesUrl+'/user.service.php';
            let body=new HttpParams()
                .set('banUsers','1')
                .set('userIds',payload[0].toString())
                .set('time',payload[1].toString());
            return this.httpClient.post(url,body).pipe(
                map(()=>{
                        return new userActions.LoadUsers();
                    }
                )
            )
        })
    );

    @Effect()
    deleteUsers=this.actions$.pipe(
        ofType(userActions.DELETE_USERS),
        map((action:userActions.DeleteUsers)=>action.payload),
        switchMap(payload=>{
            let url=this.servicesUrl+'/user.service.php';
            let body=new HttpParams()
                .set('deleteUsers','1')
                .set('deleteContent',payload[1].toString())
                .set('userIds',payload[0].toString());
            return this.httpClient.post(url,body).pipe(
                map(()=>{
                        return new userActions.LoadUsers();
                    }
                )
            )
        })
    );

    @Effect()
    unbanUsers=this.actions$.pipe(
        ofType(userActions.UNBAN_USERS),
        map((action:userActions.UnbanUsers)=>action.payload),
        switchMap(payload=>{
            let url=this.servicesUrl+'/user.service.php';
            let body=new HttpParams()
                .set('unbanUsers','1')
                .set('userIds',payload.toString());
            return this.httpClient.post(url,body).pipe(
                map(()=>{
                        return new userActions.LoadUsers();
                    }
                )
            )
        })
    );

    @Effect()
    checkConversation=this.actions$.pipe(
        ofType(userActions.CHECK_CONVERSATION_AVAILABILITY),
        map((action:userActions.CheckConversationAvailability)=>action.payload),
        switchMap(payload=>{

            let url=this.servicesUrl+'/user.service.php?checkConversation=1&userToken='+payload[1]+'&conversationId='+payload[0];
            return this.httpClient.get(url).pipe(
                map(
                    (res:boolean)=>{
                        return new userActions.CheckConversationAvailabilityCompleted(res);
                    }
                )
            )
            }
        )
    );

    @Effect()
    loadUsers=this.actions$.pipe(
        ofType(userActions.LOAD_USERS),
        switchMap(payload=>{
                let url=this.servicesUrl+'/user.service.php?loadUsers=1';
                return this.httpClient.get(url).pipe(
                    map(
                        (users)=>{
                            return new userActions.LoadUsersSuccess(users);
                        }
                    )
                )
            }
        )
    );

    @Effect()
    loadSearchUsers=this.actions$.pipe(
        ofType(userActions.LOAD_SEARCH_USERS),
        map((action:userActions.LoadSearchUsers)=>action.payload),
        switchMap(payload=>{
                let url=this.servicesUrl+'/user.service.php?loadSearchUsers=1&string='+payload;
                return this.httpClient.get(url).pipe(
                    map(
                        (users)=>{
                            return new userActions.LoadUsersSuccess(users);
                        }
                    )
                )
            }
        )

    );


    @Effect()
    loadRecentUsers=this.actions$.pipe(
        ofType(userActions.LOAD_RECENT_USERS),
        switchMap(
            ()=>{
                let url=this.servicesUrl+'/user.service.php';
                let body=new HttpParams()
                    .set('loadRecentUsers','1');
                return this.httpClient.post(url,body.toString(),
                    {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
                ).pipe(
                    map(
                        (users)=>{
                           return new userActions.LoadUsersSuccess(users);
                        }
                    )
                )
            }
        )

    );

    @Effect()
    loadUser=this.actions$.pipe(
        ofType(userActions.LOAD_USER),
        map((action:userActions.LoadUser)=>action.payload),
        mergeMap(
            payload=>{
                let url=this.servicesUrl+'/user.service.php';
                let body=new HttpParams()
                    .set('loadUser','1')
                    .set('userId',payload);
                return this.httpClient.post(url,body).pipe(
                    map(
                        (user:User)=>{
                            if(user) return new userActions.LoadUserSuccess(user)
                        }
                    )
                )
            }
        )
    )
}
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import * as messageListActions from '../actions/message-list.actions';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {Conversation} from '../../models/conversation.model';
import {Message} from '../../models/message.model';
import { timer} from 'rxjs';
import {Router} from '@angular/router';
import {BackendUrlService} from '../../services/backendUrl.service';
@Injectable()
export class MessageListEffects {
    conversationId='';
    lastMessageId='';
    userId='';
    servicesUrl;

    constructor(private actions$:Actions,private httpClient:HttpClient,private burl:BackendUrlService,private router:Router){
        this.servicesUrl=burl.getUrl();
    }

    @Effect()//load new messages by user
    loadNewMessages$=this.actions$.pipe(
        ofType(messageListActions.LOAD_NEW_MESSAGES),
        map((action:messageListActions.LoadNewMessages)=>action.payload),
        switchMap((payload)=>{
            let url=this.servicesUrl+'/conversation.service.php?loadNewMessages=1&userId='+payload;

            return this.httpClient.get(url).pipe(map((result:Message[])=>{
                return new messageListActions.LoadNewMessagesSuccess(result)
            }))
        })
    );

    @Effect()
    //load messages (conversation)
    loadMessages$=this.actions$.pipe(
        ofType(messageListActions.LOAD_MESSAGES),
        map((action:messageListActions.LoadMessages)=>action.payload),
        switchMap((payload)=>{//if user logged in send userId also
            this.userId=payload[1];
            let  url=this.servicesUrl+'/conversation.service.php?loadMessages=1&conversationId='+payload[0]+'&userId='+payload[1];
            return this.httpClient.get(url).pipe(
                map((result:[Conversation,Message[]])=>{return new messageListActions.LoadMessagesSuccess({conversation:result[0],messages:result[1]})  })
            )
        })
    );

    //updating conversation--------------------------------------------------------
    @Effect()
        //start updating messages when load succeeds
    startUpdating$=this.actions$.pipe(
        ofType(messageListActions.LOAD_MESSAGES_SUCCESS),
        map((action:messageListActions.LoadMessagesSuccess)=>action.payload),
        map((payload)=> {
            this.conversationId=payload.conversation.id;
            if(payload.messages && payload.messages[payload.messages.length-1]) this.lastMessageId=payload.messages[payload.messages.length-1].id;
            return new messageListActions.UpdateMessages({conversationId:this.conversationId,lastMessageId:this.lastMessageId})
         }
        )
    );
    @Effect()//call update after last one succeeds after 4 seconds
    callUpdateAfterTimeout$=this.actions$.pipe(
        ofType(messageListActions.UPDATE_MESSAGES_SUCCESS),
        map((action:messageListActions.UpdateMessages)=>action.payload),
        switchMap(( )=>{
            return timer(4000).pipe(
                map(()=>{                                           //conversationId    //last message id
                    return new messageListActions.UpdateMessages({conversationId:this.conversationId,lastMessageId:this.lastMessageId})
                }),takeUntil(this.router.events)
            )
        })
    );
   @Effect()//update messages
    update$=this.actions$.pipe(
        ofType(messageListActions.UPDATE_MESSAGES),
        map((action:messageListActions.UpdateMessages)=>action.payload),
        switchMap((payload)=>{
                let url=this.servicesUrl+'/conversation.service.php?loadMessages=1&conversationId='+payload.conversationId+'&lastMessageId='+payload.lastMessageId+'&userId='+this.userId;
            return this.httpClient.get(url).pipe(
                map((result:[Conversation,Message[]])=>{
                    this.conversationId=result[0].id;
                    if(result[1] && result[1][result[1].length-1]) this.lastMessageId=result[1][result[1].length-1].id;
                    return new messageListActions.UpdateMessagesSuccess({conversation:result[0],messages:result[1]});
                }),takeUntil(this.router.events)
            )
        })
    );
    //-------------------------------------------------------------
    @Effect()//create message
    createMessage$=this.actions$.pipe(
        ofType(messageListActions.ADD_MESSAGE),
        map((action:messageListActions.AddMessage)=>action.payload),
        switchMap((payload:Message)=>{
            let url=this.servicesUrl+'/conversation.service.php';
            let body=new HttpParams()
                .set('createMessage','1')
                .set('message',JSON.stringify(payload));
            return this.httpClient.post(url,body.toString(),
                {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
            ).pipe(map((message:Message)=>{return new messageListActions.AddMessageSuccess(message)}  ));
        })
    );
}
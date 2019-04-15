import * as conversationListActions from '../actions/conversation-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import * as fromRoot from '../../../app/store';
import {Conversation} from '../../models/conversation.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Message} from '../../models/message.model';
import {BackendUrlService} from '../../services/backendUrl.service';

@Injectable()
export class ConversationListEffects {
    servicesUrl;

    constructor(private actions$:Actions,private httpClient:HttpClient,private burl: BackendUrlService){
        this.servicesUrl=burl.getUrl();
    }

    @Effect()//load conversations
    loadConversations=this.actions$.pipe(
        ofType(conversationListActions.LOAD_CONVERSATIONS),
        map((action:conversationListActions.LoadConversations)=>action.payload),
        switchMap((userId)=>{
            let url=this.servicesUrl+'/conversation.service.php?loadConversations=1&userId='+userId;
            return this.httpClient.get(url).pipe(
                map((result:any[])=>{
                    return new conversationListActions.LoadConversationsSuccess(result)
                })
            )
        })
    );

    @Effect()//create conversation
    createConversation$=this.actions$.pipe(
        ofType(conversationListActions.ADD_CONVERSATION),
        map((action:conversationListActions.AddConversation)=>action.payload),
        switchMap((payload:[Conversation,Message])=>{
            let url=this.servicesUrl+'/conversation.service.php';
            let body=new HttpParams()
                .set('createConversation','1')
                .set('conversation',JSON.stringify(payload[0]))
                .set('message',JSON.stringify(payload[1]));
            return this.httpClient.post(url,body.toString(),
                {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
            ).pipe(map((conversation:Conversation)=>{ return new conversationListActions.AddConversationSuccess(conversation)}  ));
        })
    );

    @Effect()//navigate to conversation
    navigateToNewConversation=this.actions$.pipe(
        ofType(conversationListActions.ADD_CONVERSATION_SUCCESS),
        map((action:conversationListActions.AddConversationSuccess)=>action.payload),
        map(conversation=> {
                return new fromRoot.Go({
                    path: ['./user',conversation.author.id,'conversation', conversation.id],
                })
            }
        )
    )
}

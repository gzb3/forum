import {Component, Input} from '@angular/core';
import {Conversation} from '../../models/conversation.model';
import {User} from '../../models/user.model';

@Component({
    selector:'message-list-display',
    styleUrls:['message-list-display.component.scss'],
    template:`        
        <div  class="container">
            <h2>{{conversation && conversation.title}}</h2>
           
            <div class="mb-3">
                <span>author:{{conversation &&conversation.author&& conversation.author.username}}<br> date: {{conversation&& conversation.date}}</span>    
            </div>
            <div><h4>participants:</h4>
                <ul class="list-inline">
                    <li class="list-inline-item" *ngFor="let avatar of conversation && conversation.avatars">
                            <div class="circAvatar">
                                <img  class="smallImg" src="{{avatar}}"/>
                            </div>
                    </li>
                </ul>
                
                <hr>
                
            </div>
            <hr>


            <ul class="list-group pl-5 pr-5" >
                <li class="m-2" *ngFor='let message of messages' style="list-style-type: none">
                    
                    <div  [ngClass]="setStyle(message.author.id)">
                            <div class="circAvatar">
                                <img  class="smallImg" src="{{message&&message.author&&message.author.img}}"/>
                            </div>
                            
                        
                        <div>
                            <div class="textbox" >
                                {{message && message.text}}
                            </div>

                            <div  class=" p-1 mb-2 ml-4" >
                                {{message && message.date | date:'MMM d, EE, h:mm'}}
                            </div>
                        </div>
                        
                    </div>
                    
                    
                </li>
            </ul>
            
        </div>
        
    `
})
export class MessageListDisplayComponent{
    @Input() messages;
    @Input() conversation:Conversation;
    @Input () user:User;

    constructor(){

    }


    setStyle(id){
        if (id==this.user.id) return "ourMessage";
        else return "othersMessage";
    }

}
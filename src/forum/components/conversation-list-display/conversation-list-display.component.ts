import {ChangeDetectionStrategy, Component, Input, OnChanges,SimpleChanges} from '@angular/core';
import {Conversation} from '../../models/conversation.model';
import {User} from '../../models/user.model';

@Component({
    selector:'conversation-list-display', changeDetection:ChangeDetectionStrategy.OnPush,
    styleUrls:['conversation-list-display.component.scss'],
    template:`
                
        <div class="container">
                    <profile-navigation [user]="user"></profile-navigation>
            
                    <div >
                        <h1 style="">{{user&& user.username}}'s Conversations:</h1>
                        <hr>
                        
                        <ul *ngIf="!this.spinner" class="p-0">
                            <li  class="list-group-item listI "  *ngFor="let conv of conversations.slice().reverse()">
                                <a  class="m-0" [routerLink]="['/user',user&&user.id,'conversation',conv && conv.id]">
                                    <h3 class="mt-1">{{conv && conv.title}}</h3>
                                    <div>date: {{conv&& conv.date| date:'medium'}}</div>

                                    <hr>

                                    <div class="d-flex ">
                                        <div>
                                            <span>participants: </span>
                                        </div>

                                        <div>
                                                <ul class="list-inline">
                                                    <li class="list-inline-item" *ngFor="let avatar of conv.avatars let i=index">
                                                        <div  class="circAvatar">
                                                            <img class="smallImg" src="{{avatar}}"/>    
                                                        </div>
                                                        
                                                    </li>
                                                </ul>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                        
                    </div>

                    <div style="height: 500px" *ngIf="this.spinner" class="d-flex flex-column justify-content-center align-items-center">
                        <img src="assets/6.gif"/>
                    </div>
                    <div class="p-4 m-5 text-secondary" *ngIf="this.empty">
                        <h3> You don't have any conversations</h3>
                    </div>
        </div>
    `
})

export class ConversationListDisplayComponent implements OnChanges{

    @Input() conversations:Conversation[];
    @Input() user:User;
    spinner=true;
    empty=false;
    constructor() {
    }
    ngOnChanges(changes: SimpleChanges){
        if(!changes['conversations'].isFirstChange()) {
            if(this.conversations.length==0){this.empty=true;}
            this.spinner=false;
        }
    }
}
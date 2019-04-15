import { Component, Input, OnChanges} from '@angular/core';
import {Message} from '../../models/message.model';

@Component({
    selector:'new-messages-display',
    styleUrls:['new-messages-display.component.scss'],
    template:`

       <div class="newMessagesDiv"> 
                <ul class="uList">
                    <li class="list-group-item "  *ngFor="let message of messages.slice().reverse()">
                        <a [routerLink]="['/user',message&&message.author&&message.author.id,'conversation',message && message.conversationId]">
                            <div class="d-flex flex-column">
                                <div class="d-flex flex-row">
                                    <div class="circAvatar"> <img  class="smallImg" src="{{message.author.img}}"/> </div>
                                    <div>{{message && message.text}}</div>
                                </div>
                            </div>
                        </a>
                        <div>{{message && message.date | date:'medium'}}</div>
                    </li>
                </ul>

           <div class="hdiv" *ngIf="view && messages.length==0">
               <h4  class="h" >When someone sends you a message, you'll see it here. </h4>
           </div>
       </div>
       

       <div class="hdiv"  *ngIf="!view">
           <img style="margin-top: 27%" src="assets/6.gif"/>
       </div>
        
    `
})

export class NewMessagesDisplayComponent implements OnChanges{

    @Input() messages:Message[];
    @Input() loaded:boolean;
    view=false;
    constructor(){}

    ngOnChanges(){
        if(this.loaded==true){
            this.view=true;
        }

    }


}


import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {User} from '../../models/user.model';
import {Conversation} from '../../models/conversation.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from '../../models/message.model';
@Component({
    selector:'add-conversation-display',
    styleUrls:['add-conversation-display.component.scss'],
    template:`        



        <div class="container">
            <profile-navigation [user]="user"></profile-navigation>
            
            <h1>Create Conversation</h1><hr>

                    <div  class="form-group" *ngIf="!submitted">
                        <form [formGroup]="form">
            
                            <label for="userName">participants:</label> 
                            <input #inp type="text" formControlName="userName" class="form-control " (input)="searchUser(inp)" list="users" />
                            <datalist id="users">
                                
                                <option  *ngFor="let user of searchUsers">{{user.username}}</option>
                                
                            </datalist>
                            <div>
                                <ul  class="list-inline ">
                                    <li class="list-inline-item" *ngFor="let user of participants">
                                        <div (click)="removeParticipant(user.id)" class="partDiv" style="padding: 10px;border: 1px solid lightgray;width: 100px;display:flex;justify-content:center;margin-top: 5px">
                                        {{user.username}}
                                    </div>    
                                    
                                    </li>
                                </ul>
                            </div>
            
                            <label for="title">title:</label>
                            <input type="text" class="form-control" formControlName="title" />
                           
                            <div *ngIf="title.invalid && title.touched" class="alert alert-danger">
                                <div >This Field Is Required</div>
                            </div>

                            <label for="text">Message:</label>
                            <textarea class="form-control" formControlName="text" rows="5" cols="155" ></textarea>

                            <div *ngIf="text.invalid && text.touched" class="alert alert-danger">
                                <div >This Field Is Required</div>
                            </div>
            
            
                            <button [disabled]="title.invalid || text.invalid" class="btn btn-primary"  type="button" (click)="createConversation(form)" >Send</button>
                        </form>
                        
                    </div>
    
            <div *ngIf="submitted">
                Please wait...
            </div>
        </div>
    `
})

export class AddConversationDisplayComponent implements OnInit,OnChanges{

    @Output() create = new EventEmitter<any>();
    @Output() search= new EventEmitter<any>();
    @Input() searchUsers:User[];
    @Input() user:User;
    participants=[];
    submitted=false;
    form=this.fb.group({
        userName:[''],
        title:['',Validators.required],
        text:['',Validators.required]
    });

    constructor(private fb:FormBuilder){}
    ngOnInit(){}

    ngOnChanges(){}

    get title(){
        return this.form.get('title')
    }

    get text(){
        return this.form.get('text');
    }

    removeParticipant(id){
        this.participants=this.participants.filter(p=>p.id!=id);
    }
    searchUser(input){
        let str=input.value;
        this.search.emit(str);

        //Add user to participants
        if(this.searchUsers&&this.searchUsers.find(user=>user.username===str)) {
            if(this.user.username!==str){
                if(!this.participants.find(user=>user.username==str))
                    this.participants.push(this.searchUsers.find(user=>user.username===str));
            }
            input.value='';
        }

    }

    createConversation(form:FormGroup){
        //add author of conversation to beginning of participant array
        this.participants.unshift(this.user);
        const{value}=form;
        let message:Message={
            id:'',
            text:value.text,
            author:this.user,
            conversationId:'',
            date:''
        };
        let conversation:Conversation={
            id:'',
            title:value.title,
            author:this.user,
            participants:this.participants,
            date:''
        };

        this.create.emit([conversation,message]);
        this.submitted=true;

    }
}


import { Component, Input, OnChanges} from '@angular/core';
import {User} from '../../models/user.model';

@Component({
    selector:'display-user',
    styleUrls:['display-user.component.scss'],
    template:`

        <div class="container">

            <profile-navigation [user]="user"></profile-navigation>

            <div *ngIf="!this.spinner">
                <h1 style="">{{user&& user.username}}'s Profile</h1><hr>


                <div class="d-flex flex-row bd-highlight mb-3">

                    <div class="flex-column" >
                        <div class="p-1 bd-highlight">Username:</div>
                        <div class="p-1 bd-highlight">Email:</div>
                        <div class="p-1 bd-highlight">Posts:</div>
                        <div class="p-1 bd-highlight">Joined:</div>
                        <div *ngIf="user.signature" class="p-1 bd-highlight">Signature:</div>
                        <div style="color: red" *ngIf="user.ban!=null" class="p-1 bd-highlight">banned until: </div>

                    </div>
                    <div>
                        <div class="p-1 bd-highlight"> {{user.username}}</div>
                        <div class="p-1 bd-highlight"> {{user.email}}</div>
                        <div class="p-1 bd-highlight">{{user.numPosts}}</div>
                        <div class="p-1 bd-highlight"> {{user.regDate}}</div>
                        <div *ngIf="user.signature" class="p-1 bd-highlight">{{user.signature}}</div>
                        <div *ngIf="user.ban!=null" class="p-1 bd-highlight">{{user.ban}}</div>
                    </div>

                </div>

                <div class="imgdiv"><img style="max-width: 100%;height: auto" src="{{user.img}}"></div>

            </div>
            
            <div style="height: 500px" *ngIf="this.spinner" class="d-flex flex-column justify-content-center align-items-center">
                <img src="assets/6.gif"/>

            </div>
        </div>
        
    `
})


export class DisplayUserComponent implements OnChanges{
   @Input() user:User;
   spinner=true;

    constructor(){}

    ngOnChanges(){
        if(this.user.id) this.spinner=false;
    }







}
import {Component, Input, OnChanges} from '@angular/core';
import {User} from '../../models/user.model';

@Component({
    selector:'profile-navigation',
    styles:[''],
    template:`
        <div style="margin-bottom: 50px" *ngIf="this.displayNav">

            <a class="btn btn-secondary" [routerLink]="['/user',user.id]" >
                Profile
            </a>
            <a class="btn btn-secondary" [routerLink]="['/user',user.id,'edit']" >
                Edit Profile
            </a>
            <a class="btn btn-secondary" [routerLink]="['/user',user.id,'conversations']" >
                Conversations
            </a>
            <a class="btn btn-secondary" [routerLink]="['/user',user.id,'conversation','create']" >
                New Conversation
            </a>
            
        </div>
    `
})

export class ProfileNavigationComponent implements OnChanges{
    displayNav;
    @Input() user:User;
    constructor(){}

    ngOnChanges(){
        localStorage.getItem('token')==this.user.token ? this.displayNav=true : this.displayNav=false;
    }


}
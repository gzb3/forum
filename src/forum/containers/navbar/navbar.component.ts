import {Component, ElementRef} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs';
import {AuthState} from '../../store/reducers/auth.reducer';
import {Router} from '@angular/router';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector:'navbar',
    styleUrls:['navbar.component.scss'],
    template:`
        <div class="p-3 mb-5">

                <nav class="navbar navbar-expand-sm navbar-light bg-light">
                    <a class="navbar-brand" [routerLink]="['']">Forum</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarText">
                        <ul class="navbar-nav mr-auto">
                            <li *ngIf="isAuthenticated ">
                                <a   class="nav-item nav-link" [routerLink]="['/user',user.id]">{{user.username}}</a>
                            </li>
                            <li *ngIf="isAuthenticated ">
                                <a *ngIf="user&&user.mod==1" class="nav-item nav-link" [routerLink]="['/manage']">Manage</a>
                            </li>
                            <li *ngIf="isAuthenticated " class="nav-item">
                                <a style="cursor: pointer;" class="nav-item nav-link" (click)="showConvDiv()"><span >M</span></a>
                            </li>
                            <li *ngIf="isAuthenticated "  class="nav-item">
                                <a style="cursor: pointer" class="nav-item nav-link" (click)="logOut()">Log out</a>
                            </li>
                            <li *ngIf="!isAuthenticated">
                                <a  class="nav-item nav-link" [routerLink]="['/log-in']" >Log in</a>
                            </li>
                            <li *ngIf="!isAuthenticated" class="nav-item">
                                <a  class="nav-item nav-link" [routerLink]="['/sign-up']" >Sign Up</a>
                            </li>
                          
                        </ul>
                    </div>
                </nav>
        </div>

        <div class="position-absolute convDiv" *ngIf="showConv">
            <new-messages [reload]="reloadChild"></new-messages>
        </div>
    `
})
export class NavbarComponent {

    getState:Observable<any>;
    isAuthenticated;
    user:User;
    errorMessage;
    showConv=false;
    reloadChild=0;

    constructor(private _eref: ElementRef,private store: Store<fromStore.ForumAppState>,private router:Router,){
        this.getState=this.store.pipe(select(fromStore.getAuthState));
        if(localStorage.getItem('token')){
            let token=localStorage.getItem('token');
            this.store.dispatch(new fromStore.KeepLoggedIn(token));
            this.store.dispatch(new fromStore.NotificationCheck(''));
        }
    }

    onClick(event){
        if (!this._eref.nativeElement.contains(event.target))
            this.showConv=false;
    }
    showConvDiv(){
        this.reloadChild++;
        this.showConv=!this.showConv;
    }
    ngOnInit(){
        this.getState.subscribe((state:AuthState)=>{
            this.isAuthenticated=state.isAuthenticated;
            this.user=state.user;
            this.errorMessage=state.errorMessage;
        });
        this.router.events.subscribe(nav=>this.showConv=false);
    }
    logOut():void{
        this.store.dispatch(new fromStore.LogOut);
    }

}
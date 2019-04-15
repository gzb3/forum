import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import * as fromStore from '../../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

@Component({
    selector:'sign-up',
    styleUrls:['sign-up.component.scss'],
    template:`        
        <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <h1>Sign up</h1>
                        <hr><br>
        
                        <div *ngIf="errorMessage">
                            <div class="alert alert-danger" role="alert">
                                {{errorMessage}}
                            </div>
                        </div>
                        
                        <form (ngSubmit)="onSubmit()" ngNativeValidate>
        
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input
                                        [(ngModel)]="user.username"
                                        name="username"
                                        type="text"
                                        required
                                        class="form-control"
                                        id="username"
                                        placeholder="enter your username">
                            </div>
                            
                            
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input
                                        [(ngModel)]="user.email"
                                        name="email"
                                        type="email"
                                        required
                                        class="form-control"
                                        id="email"
                                        placeholder="enter your email">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input
                                        [(ngModel)]="user.password"
                                        name="password"
                                        type="password"
                                        required
                                        class="form-control"
                                        id="password"
                                        placeholder="enter a password">
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                            <a [routerLink]="['/']" class="btn btn-success">Cancel</a>
                        </form>
                        <p>
                            <span>Already have an account?&nbsp;</span>
                            <a [routerLink]="['/log-in']">Log in!</a>
                        </p>
                    </div>
                </div>

        </div>
    `
})
export class SignUpComponent implements OnInit{
    user:User;
    getState: Observable<any>;
    errorMessage: string | null;

    constructor(private store:Store<fromStore.ForumAppState>){
        this.user={};
        this.getState=this.store.pipe(select(fromStore.getAuthState))
    }
    ngOnInit(){
        this.getState.subscribe((state)=>{
            this.errorMessage=state.errorMessage;
        })
    }
    onSubmit(){
        const payload={
            email:this.user.email,
            username:this.user.username,
            password:this.user.password
        };
        this.store.dispatch(new fromStore.SignUp(payload))
    }
}
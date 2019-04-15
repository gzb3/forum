import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../../models/user.model';
import {Post} from '../../models/post.model';
@Component({
    selector:'manage',
    styleUrls:['manage.component.scss'],
    template:`        
     <nav class="navbar navbar-expand-lg navbar-light bg-light">
         <ul class="navbar-nav mr-auto text-center">
             <li>
                 <button class=" btn-link" (click)="this.sub='users';loadUsers()">Users</button>
             </li>
             <li>
                 <button class="nav-item  btn-link" (click)="this.sub='flags';loadFlags();">Flags</button>
             </li>
         </ul>
     </nav>      
        <manage-users [users]="users$ |async" *ngIf="sub=='users'"
                      (ban)="onBan($event)"
                      (delete)="onDeleteUsers($event)"
                      (unban)="onUnban($event)"
        ></manage-users>
            
     
         <manage-flags [flags]="flags$|async" *ngIf="sub=='flags'"
                       (delete)="onDelete($event)"
                       (unflag)="onUnflag($event)"
         ></manage-flags>
    `
})

export class ManageComponent {
    users$:Observable<User[]>;
    flags$:Observable<Post[]>;
    sub:string;

    constructor(private store:Store<fromStore.ForumAppState>,private router:Router ,private route :ActivatedRoute) {
        this.sub='users';
        this.loadUsers()
    }

    loadUsers(){
        this.store.dispatch(new fromStore.LoadUsers());
        this.users$=this.store.pipe(select(fromStore.getUsers));
    }
    loadFlags(){
        this.store.dispatch(new fromStore.LoadFlags());
        this.flags$=this.store.pipe(select(fromStore.getPosts));
    }

    //flag manage functions
    onDelete(event){
        this.store.dispatch(new fromStore.RemovePost(event));
    }
    onUnflag(event) {
        this.store.dispatch(new fromStore.ToggleFlag(event))
    }

    //user manage functions
    onBan(event){
        this.store.dispatch(new fromStore.BanUsers(event));
    }
    onDeleteUsers(event){
        this.store.dispatch(new fromStore.DeleteUsers(event));
    }
    onUnban(event){

        this.store.dispatch(new fromStore.UnbanUsers(event));

    }




}
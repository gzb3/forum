import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {Observable} from 'rxjs';
import {User} from '../../models/user.model';
import {Thread} from '../../models/thread.model';

@Component({
    selector:'home',    changeDetection:ChangeDetectionStrategy.OnPush,

    styleUrls:['home.component.scss'],
    template:`

        <h4 class="forumTitle">Forum</h4><hr>
        <h5>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. </h5>
        <div class=" d-flex homeContainer">
            <div class="mr-3" >
                        <table *ngIf="stats$ | async as stats " width="100%" class="table myTable">
                            <div *ngIf="stats && stats.forumStats && stats.forumStats.length">
                                <tr class="tRow">
                                    <td class="td" >
                                        <div>
                                            <a [routerLink]="['forum/1']" [queryParams]="{page:1}">
                                                forum1
                                            </a>
                                            <p>Et harum quidem rerum facilis est et expedita distinctio.</p>
                                        </div>
                                    </td>
                                    <td  width="25%" >
                                        <p>threads: {{stats.forumStats[0].threads}}</p>
                                        <p>posts: {{stats.forumStats[0].posts}}</p>
                                    </td>
        
                                </tr>
                                <tr class="tRow">
                                    <td class="" >
                                        <div>
                                            <a [routerLink]="['forum/2']" [queryParams]="{page:1}">
                                                forum2
                                            </a>
                                            <p>facilis est et expedita distinctio.</p>
                                        </div>
        
                                    </td>
                                    <td  width="25%" >
                                        <p>threads: {{stats.forumStats[1].threads}}</p>
                                        <p>posts: {{stats.forumStats[1].posts}}</p>
                                    </td>
        
                                </tr>
                                <tr class="tRow">
                                    <td class="" >
                                        <div>
                                            <a [routerLink]="['forum/3']" [queryParams]="{page:1}">
                                                forum3
                                            </a>
                                            <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. </p>
                                        </div>
        
                                    </td>
                                    <td  width="25%" >
                                        <p>threads: {{stats.forumStats[2].threads}}</p>
                                        <p>posts: {{stats.forumStats[2].posts}}</p>
                                    </td>
                                </tr>
                            </div>
                        </table>

                <div class="stats mt-5">
                    <div *ngIf="stats$ | async as stats ">
                        <div >Threads:
                            <span>{{stats.stats.threads}}</span>
                        </div>
                        <div >Posts:
                            <span>{{stats.stats.posts}}</span>
                        </div>
                        <div >Members:
                            <span>{{stats.stats.users}}</span>
                        </div>
                        <div *ngIf="stats.stats && stats.stats?.newestUser && stats.stats.newestUser?.id">Newest Member:
                            <a [routerLink]="['user',stats.stats.newestUser.id]">{{stats.stats.newestUser.username}}</a>

                        </div>

                    </div>
                </div>

            </div>
            
            
            
            <div >
                <div class="rpanel">
                    <p class="sidePanelTitle">Recently Active Users:</p>
                        <ul class="list-inline" >
                            <li *ngFor="let user of recentUsers$ |async" class="list-inline-item">
                                <a [routerLink]="['/user',user.id]">{{user.username}}</a>,
                            </li>
                        </ul>
                </div>

                <div class="rpanel">
                    <p class="sidePanelTitle" > New Threads:</p>
                    <ul class="list-group ">
                        <li class="list-group-item" *ngFor="let thread of (newThreads$ | async).slice().reverse()">
                            <div class="d-flex flex-column">
                                <a [routerLink]="['forum',thread.forumId,'thread',thread.id]" [queryParams]="{page:1}">{{thread.name}}</a>
                                <span style="font-size: smaller">{{thread.date | date:'medium'}}</span>
                            </div>
                        </li>
                    </ul> 
                </div>
            </div>
            
        </div>
        
    `
})

export class HomeComponent{
    recentUsers$:Observable<User[]>;
    newThreads$:Observable<Thread[]>;
    stats$:Observable<any>;

    constructor(private store: Store<fromStore.ForumAppState>){
         this.recentUsers$=this.store.pipe( select(fromStore.getUsers));
        this.newThreads$=this.store.pipe(select(fromStore.getThreads));
        this.stats$=this.store.pipe(select(fromStore.getStats));
    }
}
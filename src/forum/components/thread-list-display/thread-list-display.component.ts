import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Thread} from '../../models/thread.model';
import {ActivatedRoute} from '@angular/router';
import {Forum} from '../../models/forum.model';
import {User} from '../../models/user.model';


@Component({
    selector:'thread-list-display',
    changeDetection:ChangeDetectionStrategy.OnPush,
    styleUrls:['thread-list-display.component.scss'],
    template:`        
        <div style="">
            <p><strong>Forum: {{forum && forum.name | uppercase}}</strong></p>
            <p>{{forum && forum.description}}</p>
        </div><hr>

        <div>
            <a  class="btn btn-primary" [routerLink]="['./thread/create']">New Thread</a>
        </div>

        <paging [pagesArray]="pagesArray"
                [page]="page"
        ></paging>
        
        <div style="background-color: whitesmoke" class="mb-1 p-3">Threads</div>
        

        <table  width="100%" class=" myTable">

        <div *ngFor="let thread of threads let i = index" >
                <tr>
                    <td style="" class="threadName td" >
                                <p class="m-0" >
                                    <a   [routerLink]="['./thread',thread.id]" [queryParams]="{page:1}">
                                        <b>{{thread.name}}</b>
                                    </a>
                                </p>
                                 <span *ngIf="thread.locked==1">locked<br></span>
                        
                                <a style="font-size: smaller" [routerLink]="['/user',thread.author.id]">{{thread.author.username}}</a>
                                <span>{{thread.date | date:'dd.MM.yyyy'}}</span>
                                       <ul class="pagination pagination-sm m-0 ml-2 ">
                                            <li *ngFor="let page of threadPageArrays[i] let j =index" class="page-item" >
                                                <a *ngIf="j<3" class="page-link" [routerLink]="['./thread',thread.id]" [queryParams]="{page:page}">{{page}}</a>
                                                <span class="page-link " style="border: 0" *ngIf="j==(threadPageArrays[i].length-1) && threadPageArrays[i].length>3 ">...</span>
                                                <a *ngIf="j==(threadPageArrays[i].length-1) && threadPageArrays[i].length>3 " class="page-link" [routerLink]="['./thread',thread.id]" [queryParams]="{page:page}">{{page}}</a>
                                            </li>
                                        </ul>
                    </td>
                    <td  width="15%" class="td" >
                        <div class="d-flex flex-column">
                            <div  ><span>replies: {{thread.postNumber}} </span></div>
                            <div  > <span> views: {{thread.views}} </span></div>
                        </div>
                    </td>
                    
                    <td width="15%" class="td" >
                        
                        <div>
                            <span>last post:</span>
                            <p>{{thread.lastPost.date | date:'dd.MM.yyyy. HH:mm'}}</p>
                        </div>
                        
                    </td>
                    <td *ngIf="user.mod=='1'">
                        <div *ngIf="user.mod=='1'" class="btn-group dropleft">
                            <button type="button" class="btn btn-link " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <b>⋮</b>
                            </button>
                            <div class="dropdown-menu">
                                <button *ngIf="thread.locked==0" class="dropdown-item" type="button" (click)="lockThread(thread.id)">Lock Thread</button>
                                <button *ngIf="thread.locked==1" class="dropdown-item" type="button" (click)="unlockThread(thread.id)">Unlock Thread</button>
                                <button class="dropdown-item" type="button" (click)="deleteThread(thread.id)">Delete Thread</button>
                            </div>
                        </div>
                        
                    </td>
                 
                   
                </tr>
        </div>
            
        </table>
        
        <paging [pagesArray]="pagesArray"
                [page]="page"
        ></paging>

    `
})

export class ThreadListDisplayComponent implements OnChanges,OnInit{


    @Input() threads:Thread[];
    @Input() forum:Forum;
    @Input() page:any; //current page
    @Input() user:User;
    @Input() pagesArray:any; //array of thread pages for every forum
    @Output() lock =new EventEmitter<any>();
    @Output() delete =new EventEmitter<any>();
    @Output() unlock =new EventEmitter<any>();
    threadPageArrays;//array of pages for every thread
    forumId;

    constructor(private route:ActivatedRoute){
        this.threadPageArrays=[];
        this.forumId=route.snapshot.params.forumId;
    }

    lockThread(id){
        this.lock.emit(id);
    }
    deleteThread(id){
        this.delete.emit(id);
    }
    unlockThread(id){
        this.unlock.emit(id);
    }

    ngOnInit(){}

    ngOnChanges(){
        //sort threads by last post
        this.threads=this.threads.sort(function (a, b) {
            if(a.lastPost.date>b.lastPost.date){
                return -1;
            }else if (a.lastPost.date<b.lastPost.date){
                return 1;
            }
            return 0;
        });

        //create page arrays
        this.threads.map((thread,index)=>{this.threadPageArrays[index]=Array.from(new Array(thread.pageNumber), (x,i) => i + 1)});
        this.threads.forEach((thread,index)=>{if(thread.postNumber%20==0) {this.threadPageArrays[index].pop();console.log(this.threadPageArrays[index])}} );
    }

    isActivatedButton(page){
        return page==this.page
    }

}
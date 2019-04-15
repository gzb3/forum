import {AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Post} from '../../models/post.model';
import {Thread} from '../../models/thread.model';
import {User} from '../../models/user.model';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector:'post-list-display',
    styleUrls:['post-list-display.component.scss'],
    template:`   
        <div #top></div>
        <paging [pagesArray]="pagesArray"
                [page]="page"
        ></paging>
        
        <div  >
            <p  class="lead ">Thread: <button class=" btn-link"  (click)="reload()">{{this.thread && this.thread.name}} </button></p>
        </div>
        
        <div *ngIf="isAuthenticated" class="flex-row m-2">
            <a class="btn btn-success" [routerLink]="['new-post']">Add Post</a>
        </div>
        
        
        <!--post -->
            <div *ngFor="let post  of threadPosts let i=index" class="d-flex flex-column  post" [ngStyle]="setMyStyles()" id="{{i+1}}" #p> <!-- post container-->
                
                
                <div class="postHF" > <!-- post header-->
                    <span class="spanLeft">{{post && post.date}}</span>
                    <span class="spanRight" >
                        <a [routerLink]="" (click)="scrollToElement(p)" [queryParams]="{page:this.page}" fragment="{{(page-1)*20+i+1}}" id="{{(page-1)*20+i+1}}">#{{(page-1)*20+i+1}}
                        </a>

                    </span>
                </div>
                
                
                <div class="d-flex postBody"> <!-- post body-->
                        <div  class="postAuthor "> <!-- author info--> 
                                        <a style="font-size: 21px; text-decoration: none" [routerLink]="['/user',((post || {}).author ||{}).id]">{{ ((post || {}).author ||{}).username}}</a>
                                        <div class="smallImgDiv"><img class="smallImg" src="{{((post || {}).author ||{}).img}}"></div>
                                        <div>Joined:  {{ ((post || {}).author ||{}).regDate | slice : 0  : 10 }}</div>
                                        <div>Posts:  {{ ((post || {}).author ||{}).numPosts}}</div>
                        </div>
                    
                        <div class="d-flex flex-column justify-content-between" style="width: 100%"> <!-- post-->
                                    <div >
                                        <div> <!-- inner head-->
                                            <span style="font-size: larger"><b>{{thread && thread.name}}</b></span>
                                        </div>

                                        <div *ngIf="this.editingId!=post.id" class="container-fluid" > <!-- text-->
                                            <showdown [value]="post.text"></showdown>
                                        </div>

                                        <div *ngIf="this.editingId==post.id" class="container-fluid" > <!-- text-->
                                            <md-editor [options]="" [(ngModel)]="this.text" mode="editor" ></md-editor>
                                            <button type="button" (click)="onEditConfirm(post,this.text)">Confirm</button>
                                            <button type="button" (click)="onEdit(post)">Cancel</button>
                                        </div>

                                    </div>
                                        <div class="innerFooter"> <!-- inner foot-->
                                            <hr>
                                            <span> {{post.author.signature}}</span>
                                        </div>
                                    
                          </div>
                                        
                </div>
                

                <div class="postHF" > <!-- post footer-->
                    
                    <div *ngIf="user.mod=='1'" class="btn-group dropleft spanRight"><!-- mod options -->
                        <button type="button" style="margin-top: -1px" class="btn btn-link " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <b>⋮</b>
                        </button>
                        <div *ngIf="moderator==true" class="dropdown-menu">
                            <button class="dropdown-item" type="button" (click)="onDelete(post)">Delete Post</button>
                        </div>
                    </div>
                    <button type="button" (click)="onReply(post.text,post.author)" class="btn-link spanRight"><span class="spanRight">Reply with quote</span></button>
                    <button  *ngIf="post.flag=='0'&&isAuthenticated" type="button" (click)="onReport(post.id)" class="btn-link spanRight"><span class="spanRight">Report</span></button>
                    <button  *ngIf="isUsersPost(post)" type="button" (click)="onDelete(post)" class="btn-link spanRight"><span class="spanRight">Delete</span></button>
                    <button  *ngIf="isUsersPost(post)&&post.author&&post.author.ban==null" type="button" (click)="onEdit(post)" class="btn-link spanRight"><span class="spanRight">Edit</span></button>
                    
                 
                </div>
                
                
            </div>
        <!--post end -->
        
        <paging (click)="scrollToElement(top)"  [pagesArray]="pagesArray"
                [page]="page"
        ></paging>
        
        <div class="container text-center" style="margin-bottom: 30px" >
            <button class="btn-link" (click)="scrollToElement(top)" ><h4>Top</h4></button>
        </div>
    `
})

export class PostListDisplayComponent implements OnInit,OnChanges,AfterViewChecked{

    @Input() threadPosts:Post[];//
    @Input () page:any; //current page
    @Input () pagesArray:any;//array of page numbers for paging
    @Input () thread:Thread;
    @Input () user:User;//logged in user if it exists
    @Output() quote= new EventEmitter<any>();//stored quote for replying to post
    @Output() deletePost =new EventEmitter<Post>();
    @Output() editPost= new EventEmitter<Post>();
    @Output() report = new EventEmitter<any>();
    isAuthenticated;
    editingId:any;
    text;
    moderator=true;

    constructor(private route:ActivatedRoute){
        this.isAuthenticated=!!localStorage.getItem('token');
        this.editingId=null;

    }
    ngOnInit(){}

    scrollToElement(element){
        if(element)
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMyStyles(){

        let colors=['gainsboro'];
        return {
            'border-bottom-color':colors[Math.floor(Math.random() * colors.length)   ]
        };
    }
    reload(){
        location.reload()
    }

    onReport(id){
        this.report.emit(id);
    }

    onEditConfirm(post,value){
        let newPost={
            id:post.id,
            author:post.author,
            text:value,
            threadId:post.threadId,
            date:post.date,
            flag:'0'
    };
        this.editPost.emit(newPost);
        this.text=null;
    }

    ngAfterViewChecked(){
        //scroll to post in url
        this.route.fragment.subscribe((fragment: string) => {
            this.scrollToElement(document.getElementById(fragment) as HTMLElement)
        })
    }

    ngOnChanges(){
        if(this.thread.postNumber%20==0){this.pagesArray.pop();}
        this.editingId=null;//stop editing post

    }

    onReply(content,user){
        content=content.replace(/\n+/g, "\n\n> ");//
        this.quote.emit({quote:'> '+content+'\n\n',user:user});
    }

    isUsersPost(post){
        return  post.author.token==localStorage.getItem('token');
    }

    onEdit(post){
        if(this.editingId==null){
            this.editingId=post.id;
            this.text=post.text;
        }
        else {
            this.editingId=null;
        }

    }

    onDelete(post){
        if (confirm("Are you sure you want to delete this post?")) {
            this.deletePost.emit(post.id);
        }
    }

}
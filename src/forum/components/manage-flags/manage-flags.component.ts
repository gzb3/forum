import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Post} from '../../models/post.model';

@Component({
    selector:'manage-flags',
    styleUrls:['manage-flags.component.scss'],
    template:`
        <!--post -->
        <div *ngFor="let post  of flags let i=index" class="d-flex flex-column  post" id="{{i+1}}" #p> <!-- post container-->
            <div class="postHF" > <!-- post header-->
                <span class="spanLeft">{{post && post.date}}</span>
            </div>

            
            <div class="d-flex flex-row"> <!-- post body-->
                <div  class="postAuthor "> <!-- author info-->
                    <a style="font-size: 21px; text-decoration: none" [routerLink]="['/user',((post || {}).author ||{}).id]">{{post && post.author && post.author.username}}</a>
                    <div class="smallImgDiv"><img class="smallImg" src="{{post && post.author &&post.author.img}} "></div>
                    <div>Joined:  {{ ((post || {}).author ||{}).regDate | slice : 0  : 10 }}</div>
                    <div>Posts:  {{ ((post || {}).author ||{}).numPosts}}</div>
                </div>

                <div class="d-flex flex-column container-fluid"> <!-- post-->

                    <div class="container-fluid" style="min-height: 77%"> <!-- text-->
                        <showdown [value]="post.text"></showdown>
                    </div>

                    <hr>
                    <div class="innerFooter"> <!-- inner foot-->
                        <p> {{post&&post.author &&post.author.signature}}</p>
                    </div>
                </div>
            </div>
            
            <div class="postHF"> <!-- post footer-->
                <span class="spanRight">
                                   <div class="btn-group dropleft">
                                              <button type="button" class="btn btn-link " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <b>⋮</b> 
                                              </button>
                                              <div class="dropdown-menu">
                                                  <button class="dropdown-item" type="button" (click)="delPost(post.id)">Delete Post</button>
                                                  <button class="dropdown-item" type="button" (click)="unflagPost(post.id)">Unflag</button>
                                              </div>
                                    </div>
                </span>
            </div>
        </div>
        <!--post end -->
        
    `
})
export class ManageFlagsComponent implements OnInit,OnChanges{

    @Output() delete =new EventEmitter<string>();
    @Output() unflag=new EventEmitter<string>();
    @Output() deleteAndBan= new EventEmitter<Post>();
    @Input() flags:Post[];
    constructor(){}

    delPost(postId){
        this.delete.emit(postId);
    }
    unflagPost(postId){
        this.unflag.emit(postId);
    }
    ngOnChanges(){
        this.flags=this.flags.filter(p=>p.flag=='1');
    }
    ngOnInit(){
        console.log(this.flags)
    }
}
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {Post} from '../../models/post.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../models/user.model';
import {Thread} from '../../models/thread.model';
@Component({
    selector:'add-post-display',
    changeDetection:ChangeDetectionStrategy.OnPush,
    styleUrls:['add-post-display.component.scss'],
    template:`      
        
        <div class="container">

            <h3>Create Post</h3><hr>
            <h4>Thread: {{thread&&thread.name}}</h4>
            <h4 style="margin: 15px" *ngIf="this.quotedUser">Replying To: {{quotedUser.username}}</h4>

            <showdown *ngIf="this.quote" [value]="quote"></showdown>


            <div *ngIf="this.submitted" class="text-center " style="height: 350px;line-height: 350px;">Please Wait...</div>

            <div *ngIf="!this.submitted" class="form-group">
                <form [formGroup]="form">

                    <md-editor mode="editor" formControlName="text" height="500px"></md-editor>


                    <button class="btn btn-primary" type="button" (click)="createPost(form)" >Post</button>
                </form>

            </div>

        </div>
             `
})
export  class AddPostDisplayComponent implements OnInit,OnChanges{

    @Output() create= new EventEmitter<Post>();
    @Input() thread:Thread;
    @Input() user:User;// logged in user
    @Input() quote:string;
    @Input() quotedUser:User;//if we are replying to somebody we need his info
    submitted=false;
    displayForm:boolean;
    form=this.fb.group({
        text:[''],
    });

    constructor(private fb:FormBuilder){
        this.displayForm=false;
    }
    ngOnInit(){}

    ngOnChanges(){
    }

    createPost(form:FormGroup){
        this.submitted=true;
        const {value}=form;
                                    //construct post text if replying
        if(this.quotedUser!=null) value.text=">"+this.quotedUser.username+" said: \n\n"+this.quote+value.text;
        let post={
            id:'',
            threadId:this.thread.id,
            author:this.user,
            text:value.text,
            flag:'0'

        };
        this.create.emit(post);
        form.setValue({text:''});
        this.displayForm=false;
    }

}
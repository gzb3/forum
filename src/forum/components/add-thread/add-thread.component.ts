import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from '../../models/post.model';
import {User} from '../../models/user.model';
import {Thread} from '../../models/thread.model';

@Component({
    selector:'add-thread',
    changeDetection:ChangeDetectionStrategy.OnPush,
    styleUrls:['add-thread.component.scss'],
    template:`        
        <h2>Create Thread</h2>
        <div  class="form-group" *ngIf="!submitted">            
            <form [formGroup]="form">
                subject:
                <input class="form-control" type="text" formControlName="name">
                <div *ngIf="name.hasError('maxlength')" class="alert alert-danger">
                    <div >Title is too long</div>
                </div>
                content:
                <md-editor formControlName="txt" ></md-editor>
                
                <button [disabled]="name.invalid" class="btn btn-primary" type="button" (click)="createThread(form)" >Post</button>
            </form>
        
        </div>
        
        <div *ngIf="submitted">
            
            Please wait...
            
        </div>
             `
})
export  class AddThreadComponent implements OnInit{
    @Output() create= new EventEmitter<any>();
    @Input() forumId:string;
    @Input() user:User;
    submitted=false;
    form:FormGroup;

    constructor(private fb:FormBuilder){}

    ngOnInit(){

        this.form=this.fb.group({
            name:['',[Validators.required, Validators.maxLength(510)]],
            txt:[''],
        });
    }

    get f() { return this.form.controls; }

    get name(){
        return this.form.get('name');
    }
    get txt(){
        return this.form.get('txt');
    }

    createThread(form:FormGroup){
        const {value}=form;
        if(value.txt.length>0){
            let post:Post={
                id:'',
                text:value.txt,
                author:this.user,
                threadId:'',
                flag:'0'

            };
            let thread:Thread={
                id:'',
                name:value.name,
                forumId:this.forumId,
                author:this.user,
                postNumber:0,
                views:0,
                locked:0,
                date:null
            };
            this.create.emit([thread,post]);
            this.submitted=true;

        }else alert('Content field is empty');

    }

}




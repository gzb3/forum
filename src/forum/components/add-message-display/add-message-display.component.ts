import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Message} from '../../models/message.model';
import {User} from '../../models/user.model';
import {FormBuilder, FormGroup} from '@angular/forms';
@Component({
    selector:'add-message-display',
    styleUrls:['add-message-display.component.scss'],
    template:`
        <div  class="form-group container">
            <form [formGroup]="form">

                <div style="padding-left: 150px" class="d-flex flex-row">
                    <textarea type="text" style="resize:none" formControlName="text" rows="4" cols="100"></textarea>

                    <button style="width: 80px" class="btn btn-primary" type="button" (click)="addMessage(form)" >Send</button>
                </div>
                
            </form>

        </div>
    `
})

export class AddMessageDisplayComponent{

    @Output() create= new EventEmitter<Message>();
    @Input() conversationId:string;
    @Input() user:User;

    form=this.fb.group({
        text:['']
    });
    constructor(private fb:FormBuilder){}

    addMessage(form:FormGroup){

        const {value}=form;
        let message:Message={
            id:'',
            author:this.user,
            conversationId:this.conversationId,
            text:value.text,
            date:''
        };

        this.create.emit(message);
        form.setValue({text:''});
    }
}

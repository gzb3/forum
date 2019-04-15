import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {User} from '../../models/user.model';

@Component({
    selector:'edit-user-display',
    styleUrls:['edit-user-display.component.scss'],
    template:`        
        <div class="container">
            <profile-navigation [user]="user"></profile-navigation>

            <div class="row">
                <div class="col-md-4">
                    <h1>Edit Profile</h1>
                    <hr><br>
                    
                    <form (ngSubmit)="onSubmit(fil)" ngNativeValidate>
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input
                                    [(ngModel)]="u.username"
                                    name="username"
                                    type="text"
                                    required
                                    class="form-control"
                                    id="username"
                                    placeholder="enter new username">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input
                                    [(ngModel)]="u.email"
                                    name="email"
                                    type="email"
                                    
                                    class="form-control"
                                    id="email"
                                    placeholder="enter new email">
                        </div>
                        <div class="form-group">
                            <label for="password">New Password</label>
                            <input
                                    [(ngModel)]="u.password"
                                    name="password"
                                    type="password"
                                    
                                    class="form-control"
                                    id="password"
                                    placeholder="enter new password">
                        </div>
                        <div class="form-group">
                            <label for="signature">Signature</label>
                            <textarea
                                    [(ngModel)]="u.signature"
                                    name="signature"
                                    type="text"
                                    [rows]="5"
                                    
                                    class="form-control"
                                    id="signature"
                                    placeholder="enter signature">
                            </textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="image">Profile Image</label>
                            <input #fil
                                    name="image"
                                    type="file"
                                    class="form-control"
                                    id="image">
                        </div>

                        
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    `
})

export class EditUserDisplayComponent implements OnChanges,OnInit{
    @Input() user:User;
    @Output() edit= new EventEmitter<any>();
    @Output() load=new EventEmitter<any>();
    u:User={};

    constructor() {}
    ngOnInit(){}

    ngOnChanges(){
        for(let k in this.user) {this.u[k]=this.user[k];} //copy this.user properties
    }
    onSubmit(fil){
        let i;// if file wasn't uploaded get old img name else get name from input.files.name
        if(fil.files.length>0) i="assets/"+fil.files[0].name; else i=this.u.img;
        let image=fil.files[0];

        let user:User={
            token:this.u.token,
            username:this.u.username,
            email:this.u.email,
            password:this.u.password,
            img:i,
            signature:this.u.signature,

        };
        const formData=new FormData();
        //append user properties to formData object
        formData.append('edit','1');
        for( let prop in user){
          formData.append(prop,user[prop])
        }
        formData.append('avatar',image);
        this.edit.emit(formData);
    }
}
import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import * as moment from 'moment';
import {User} from '../../models/user.model';

@Component({
    selector:'manage-users',
    styleUrls:['manage-users.component.scss'],
    template:`
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Edit
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <button class="dropdown-item" type="button" (click)="confirmBan(null,null)">Ban User(s)</button>
                <button class="dropdown-item" type="button" (click)="banUsers()" >Ban User(s) Temporarily</button>
                <button class="dropdown-item" type="button" (click)="unbanUsers()">Unban User(s)</button>
                <button class="dropdown-item" type="button" (click)="deleteUsers(true)">Delete User(s) and Content</button>
            </div>
        </div>
        
        <div class="d-inline container">
                <div  class="d-inline-block" *ngFor="let user of users" >
                    <div (click)="select(user.id)"  class="p-2 m-1" id="{{user.id}}">
                                <div class="smallImgDiv ml-4" >
                                    <img class="smallImg" src="{{user.img}}">
                                </div>
                                <div class="d-flex flex-column"  >
                                    <span class="uInf"><b>username: </b>{{user.username}}</span>
                                    <span class="uInf"><b>email: </b> {{user.email}}</span>
                                    <span class="uInf"><b>posts: </b> {{user.numPosts}}</span>
                                    <span class="uInf"><b>joined:  </b> {{user.regDate}}</span>
                                    <span class="uInf"><b>signature:  </b> {{user.signature}}</span>
                                    <span class="uInf"><b>last access:  </b> {{user.lastAccess}}</span>
                                    <span class="uInf" *ngIf="user.ban=='9999-12-31 23:59:59'"> <b>banned until:  </b> indefinitely</span>
                                    <span class="uInf" *ngIf="user.ban &&user.ban!=='9999-12-31 23:59:59'"> <b>banned until:  </b> {{user.ban}}</span>
                                </div>
                    </div>
                </div>
        </div>
        
        <div *ngIf="this.timeprompt" class="modal">
                
            <div class="d-flex flex-column p-3" style="background-color: whitesmoke">
                <label class="control-label">Enter Ban Time</label>
                    <div class="input-group">
                        <input class="form-control" type="text" #time />
                        <div class="input-group-btn">
                            <select #sel class="btn btn-secondary">
                                <option value="min">Minute(s)</option>
                                <option value="hour">Hour(s)</option>
                                <option value="day">Day(s)</option>
                            </select>
                        </div>
                    </div>
                <div class="d-inline">
                    <button type="button" style="width: 50%" class="btn btn-secondary" (click)="confirmBan(time,sel)">Confirm</button>
                    <button type="button" style="width: 50%" class="btn btn-secondary" (click)="this.timeprompt=false">Cancel</button>
                </div>
            </div>
        </div>
    `
})
export class ManageUsersComponent implements OnChanges{

    selected:string[];
    @Input() users:User[];      //userIds   //minutesString
    @Output() ban=new EventEmitter<[string[],string]>();
    @Output() unban = new EventEmitter<string[]>();
    @Output() delete= new EventEmitter<[string[],boolean]>();
    banMinutes:string;
    timeprompt=false;

    constructor(){
        this.selected=[];
        this.banMinutes='0'

    }

    select(userId){
        if(this.selected.find(id=>id==userId)){
            this.selected=this.selected.filter(id=>id!=userId);
            document.getElementById(userId).style.backgroundColor = "white"
        }else{
            this.selected.push(userId);
            document.getElementById(userId).style.backgroundColor = "PaleGreen";
        }
    }

    banUsers(){this.timeprompt=true;} //show ban time modal

    ngOnChanges(){
        this.selected=[];
    }
    confirmBan(timeInput,selectTag) {

        //---------------------------------
        if (this.selected.length != 0) {
            if (!timeInput) {//ban indefinitely
                this.ban.emit([this.selected, '9999-12-31 23:59:59']);
                this.selected=[];
            } else {//get time and emit
                //current date
                let now=new Date();
                //get option value
                let opt = selectTag[selectTag.selectedIndex].value;
                //get input value
                let value= timeInput.value;
                let d;

                switch (opt) {
                    case 'min':{
                        now.setTime(now.getTime()+value*60*1000);
                        d=moment(now).format('YYYY-MM-DD HH:mm:ss');
                      break;
                    }
                    case 'hour':{
                         now.setTime(now.getTime()+value*60*60*1000);
                         d=moment(now).format('YYYY-MM-DD HH:mm:ss');
                        break;
                    }
                    case 'day':{
                        now.setTime(now.getTime()+value*60*60*24*1000);
                        d=moment(now).format('YYYY-MM-DD HH:mm:ss');
                    }
                }
                this.ban.emit([this.selected,d]);
                this.selected=[];
            }
        }
        this.selected=[];
        this.timeprompt = false;//hide modal


    }

    unbanUsers(){
        if(this.selected.length!=0)
        this.unban.emit(this.selected);
    }
    deleteUsers(shouldDelContent?:boolean){
        if(this.selected.length!=0)
        this.delete.emit([this.selected,shouldDelContent]);
    }
}

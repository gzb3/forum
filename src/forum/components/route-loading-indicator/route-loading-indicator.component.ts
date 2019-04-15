import {Component} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Component({
    selector:'route-loading-indicator',
    styleUrls:['route-loading-indicator.component.css'],
    template:`
       <div *ngIf="loading" class="progress position-absolute" >
           <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 100%;position: fixed;height: 3px"></div>
       </div>
    `
})

export class RouteLoadingIndicatorComponent {
    loading=false;
    constructor(private router:Router){
        this.router.events.subscribe((event)=>{
            switch (true){
                case event instanceof NavigationStart:{
                    this.loading=true;
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError:{
                    this.loading=false;
                    break;
                }
                default:{
                    break;
                }
            }
        })
    }
}
import {Component} from '@angular/core';
@Component({
  selector: 'app-root',
    styleUrls: ['./app.component.css'],
    template: `
        <route-loading-indicator></route-loading-indicator>
        <navbar></navbar>
        <breadcrumb></breadcrumb>
        <router-outlet></router-outlet>
  `
})
export class AppComponent{
    constructor(){}
}




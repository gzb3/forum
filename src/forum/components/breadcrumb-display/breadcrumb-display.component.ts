import {Component, Input} from '@angular/core';
import {BreadCrumb} from '../../models/breadcrumb.model';

@Component({
    selector:'breadcrumb-display',
    styleUrls:['breadcrumb-display.component.scss'],
    template:`
        <div style="margin-bottom: 30px">
            <ul>
                <li class="list-inline-item" *ngFor="let breadcrumb of breadcrumbs">
                    <a [routerLink]="[breadcrumb.url]"> >  {{breadcrumb.label}} </a>
                </li>

            </ul>
        </div>
        <hr>


    `
})

export class BreadcrumbDisplayComponent{

    @Input()breadcrumbs:BreadCrumb[];

    constructor(){}
}
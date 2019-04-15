import {Component, Input} from '@angular/core';

@Component({
    selector:'paging',
    styles:[''],
    template:`

        <nav *ngIf="this.pagesArray" aria-label="...">
            <ul class="pagination">
                <li *ngIf="this.page>1" class="page-item ">
                    <a class="page-link"  tabindex="-1" [routerLink]="['./']" [queryParams]="{page:this.page-1}">Previous</a> </li>
                <li *ngFor="let page of pagesArray " class="page-item" [ngClass]="{'active':isActivatedButton(page)}"><a class="page-link" [routerLink]="['./']" [queryParams]="{page:page}">{{page}}</a></li>
                <li *ngIf="this.page<this.pagesArray.length" class="page-item">
                    <a class="page-link" [routerLink]="['./']" [queryParams]="{page:1++this.page}">Next</a></li>
            </ul>
        </nav>
    
    `

})
export class PagingComponent {
    @Input() pagesArray;
    @Input() page;

    constructor(){}
    isActivatedButton(page){
        return page==this.page
    }

}
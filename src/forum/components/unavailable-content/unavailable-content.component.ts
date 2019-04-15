import {Component} from '@angular/core';

@Component({
    selector:'unavailable-content',
    styleUrls:['unavailable-content.component.scss'],
    template:`
        
        <div class="container">
            <h1>Restricted Content!</h1>
        </div>
    `
})

export class UnavailableContentComponent{
    constructor(){}
}
import {Injectable} from '@angular/core';
@Injectable()
export class BackendUrlService {
    url;
    constructor(){
        this.url='http://localhost:63342/forum/src/forum/services'
    }
    getUrl(){
        return this.url;
    }
}
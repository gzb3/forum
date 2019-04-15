import {Post} from './post.model';
import {User} from './user.model';
export interface Thread {
    id:string;
    name:string;
    author: User;
    forumId:any;
    postNumber:number;
    pageNumber?:number;
    views:number;
    date:string;
    lastPost?:Post;
    locked:any;
}
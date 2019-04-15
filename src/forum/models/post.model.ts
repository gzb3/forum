import {User} from './user.model';
export interface Post {
    id:string;
    threadId:string;
    author:User;
    text:string;
    date?:string;
    flag:string;

}
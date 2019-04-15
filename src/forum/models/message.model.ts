import {User} from './user.model';
export interface Message {
    id:string,
    conversationId:string,
    text:string,
    author:User,
    date:string
}
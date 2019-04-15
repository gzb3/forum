import {User} from './user.model';
export interface Conversation {
    id:string,
    title:string,
    author?:User,
    participants?:User[],
    avatars?:String[],
    date:string,
}
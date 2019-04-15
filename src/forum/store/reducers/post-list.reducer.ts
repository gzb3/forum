import * as fromPostList from '../actions/post-list.actions';
import {Post} from '../../models/post.model';
import {Thread} from '../../models/thread.model';
import {User} from '../../models/user.model';

export interface PostListState {
    thread:Thread
    entities:{[id:number]:Post};
    quote?:string;
    quotedUser?:User;
    page?:any;

}
export const initialState:PostListState={
    thread:null,
    entities:{},
    quote:null,
    quotedUser:null,
    page:null
};


export function reducer(state=initialState,action:fromPostList.postListAction):PostListState{

    switch (action.type){
        case fromPostList.LOAD_POSTS_COMPLETED:{
                    const thread=action.payload.thread;
                    const page=action.payload.page;
                    const entities=action.payload.posts.reduce(
                        (entities:{[id:number]:Post},post:Post)=>{
                        return{
                            ...entities,
                            [post.id]:post
                        }
                    },{

                    });
                    return{
                        ...state,
                        thread,
                        page,
                          entities
                    }
        }
        case fromPostList.LOAD_FLAGS_COMPLETED:{
            const entities=action.payload.reduce(
                (entities:{[id:number]:Post},post:Post)=>{
                    return{
                        ...entities,
                        [post.id]:post
                    }
                },{
                });

            return{
                ...state,
                entities
            }
        }
        case fromPostList.STORE_QUOTE:{
            const quote=action.payload.quote;
            const quotedUser=action.payload.user;
            return{
                ...state,
                quote,
                quotedUser
            }
        }
        case fromPostList.CREATE_POST_COMPLETED:{
                    const post=action.payload.post;
                    const entities={
                        ...state.entities,
                        [post.id]:post
                    };
                    const quote=null;
                    const quotedUser=null;

                    return{
                        ...state,
                        entities,
                        quotedUser,
                        quote
                    }
        }
        case fromPostList.REMOVE_POST_COMPLETED:{
                    const post=action.payload;
                    const {[post.id]: removed, ...entities } = state.entities;
                    return{
                        ...state,
                        entities
                    };
        }
        case fromPostList.EDIT_POST_COMPLETED:{
            const post=action.payload;
            const entities={
                ...state.entities,
                [post.id]:post
            };
            return{
                ...state,
                entities,
            }
        }
    }
    return state
}
export const getPostListEntities=(state:PostListState)=>state.entities;
export const getThread=(state:PostListState)=>state.thread;
export const getQuote=(state:PostListState)=>state.quote;
export const getQuotedUser=(state:PostListState)=>state.quotedUser;
export const getPage=(state:PostListState)=>state.page;




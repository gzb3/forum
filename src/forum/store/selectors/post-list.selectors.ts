import * as fromPostList from '../reducers/post-list.reducer';
import * as fromFeature from '../reducers/index';
import {createSelector} from '@ngrx/store';

export const getPostListState=createSelector(fromFeature.getForumAppState,
    (state:fromFeature.ForumAppState)=>state.posts);

export const getPostListEntities=createSelector(getPostListState,fromPostList.getPostListEntities);

export const getPosts=createSelector(getPostListEntities, entities=>{
    return Object.keys(entities).map(id=>entities[parseInt(id,10)]);
});

export const getThread=createSelector(getPostListState,fromPostList.getThread);
export const getQuote=createSelector(getPostListState,fromPostList.getQuote);
export const getQuotedUser= createSelector(getPostListState,fromPostList.getQuotedUser);
export const getPage=createSelector(getPostListState,fromPostList.getPage);
export const getPostsAndPage=createSelector(getPosts,getPage,(posts,page)=>{
    return {posts:posts,page:page};
});
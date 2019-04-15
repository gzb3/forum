import * as fromMessageList from '../reducers/message-list.reducer';
import * as fromFeature from '../reducers/index';
import {createSelector} from '@ngrx/store';

export const getMessageListState=createSelector(fromFeature.getForumAppState,(state:fromFeature.ForumAppState)=>state.messages);
export const getMessageListEntities=createSelector(getMessageListState, fromMessageList.getMessageListEntities);
export const getConversation= createSelector(getMessageListState,fromMessageList.getConversation);
export const getMessages=createSelector(getMessageListEntities,entities=>{
    return Object.keys(entities).map(id=>entities[parseInt(id,10)])});

export const getNewMessageEntities=createSelector(getMessageListState,fromMessageList.getNewMessagesEntities);
export const getNewMessages=createSelector(getNewMessageEntities,entities=>{
    return Object.keys(entities).map(id=>entities[parseInt(id,10)])});

export const newMessagesLoaded=createSelector(getMessageListState,fromMessageList.newMessagesLoaded);

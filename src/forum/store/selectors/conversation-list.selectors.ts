import * as fromConversationList from '../reducers/conversation-list.reducer';
import * as fromFeature from '../reducers/index';
import {createSelector} from '@ngrx/store';

export const getConversationListState=createSelector(fromFeature.getForumAppState,(state:fromFeature.ForumAppState)=>state.conversations);
export const getConversationListEntities=createSelector(getConversationListState, fromConversationList.getConversationListEntities);
export const getConversations=createSelector(getConversationListEntities,entities=>{
    return Object.keys(entities).map(id=>entities[parseInt(id,10)])});


import * as fromThreadList from './thread-list.reducer';
import * as fromPostList from './post-list.reducer';
import * as fromAuth from './auth.reducer';
import * as fromUser from './user.reducer';
import * as fromConversationList from './conversation-list.reducer';
import * as fromMessageList from './message-list.reducer';
import * as fromStats from './stats.reducer';

import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';

export interface ForumAppState {
    posts:fromPostList.PostListState;
    threads: fromThreadList.ThreadListState;
    auth:fromAuth.AuthState;
    user:fromUser.UserState;
    conversations:fromConversationList.ConversationListState;
    messages:fromMessageList.MessageListState;
    stats:fromStats.StatsState;
}
export  const reducers:ActionReducerMap<ForumAppState>={
    posts:fromPostList.reducer,
    threads:fromThreadList.reducer,
    auth:fromAuth.reducer,
    user:fromUser.reducer,
    conversations:fromConversationList.reducer,
    messages:fromMessageList.reducer,
    stats:fromStats.reducer
};

export const getForumAppState=createFeatureSelector<ForumAppState>('forum');
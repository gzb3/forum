import * as fromFeature from '../reducers/index';
import * as fromAuth from '../reducers/auth.reducer';
import {createSelector} from '@ngrx/store';

export const getAuthState=createSelector(fromFeature.getForumAppState,
    (state:fromFeature.ForumAppState)=>state.auth
    );

export const getUser=createSelector(getAuthState,fromAuth.getUser);
export const isAuthenticated=createSelector(getAuthState,fromAuth.getIsAuthenticated);
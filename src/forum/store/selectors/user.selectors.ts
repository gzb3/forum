import * as fromUser from '../reducers/user.reducer';
import * as fromFeature from '../reducers/index';
import {createSelector} from '@ngrx/store';

export const getUserState=createSelector(fromFeature.getForumAppState, (state:fromFeature.ForumAppState)=>state.user);
export const getUsers=createSelector(getUserState,fromUser.getUsers);
export const getProfile=createSelector(fromFeature.getForumAppState,(state:fromFeature.ForumAppState)=>state.user.user);
export const getActivateConversation= createSelector(fromFeature.getForumAppState,(state:fromFeature.ForumAppState)=>state.user.activateConversation);
export const getUserLoading=createSelector(getUserState,fromUser.getUserLoading);
export const getUserLoaded=createSelector(getUserState,fromUser.getUserLoaded);
export const getUserData=createSelector(getUserLoading,getUserLoaded,getProfile,(loading,loaded,user)=>{
    return {loading:loading,loaded:loaded, user:user}
});
import * as fromThreadList from '../reducers/thread-list.reducer';
import * as fromFeature from '../reducers/index';
import {createSelector} from '@ngrx/store';

export const getThreadListState=createSelector(fromFeature.getForumAppState, (state:fromFeature.ForumAppState)=>state.threads);
export const getThreadListEntities=createSelector(getThreadListState,fromThreadList.getThreadListEntities);
export const getThreads=createSelector(getThreadListEntities, entities=>{
    return Object.keys(entities).map(id=>entities[parseInt(id,10)]);
});
export const getForum=createSelector(getThreadListState,fromThreadList.getForum);
export const getThreadListPage=createSelector(getThreadListState,fromThreadList.getThreadListPage);
export const getThreadsAndPage=createSelector(getThreads,getThreadListPage,(threads,page)=>{
    return {threads:threads,page:page};
});
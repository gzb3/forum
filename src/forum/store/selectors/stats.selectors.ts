import * as fromStats from '../reducers/stats.reducer';
import * as fromFeature from '../reducers/index';
import {createSelector} from '@ngrx/store';

export const getStatsState=createSelector(fromFeature.getForumAppState,(state:fromFeature.ForumAppState)=>state.stats);

export const getStats=createSelector(getStatsState,fromStats.getStats);

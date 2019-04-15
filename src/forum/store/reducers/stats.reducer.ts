import * as fromStats from '../actions/stats.actions';

export interface StatsState {
    stats:{
        threads:any,
        posts:any,
        users:any,
        newestUser:any
    }
    forumStats: {threads:any,posts:any}[]
}

export const initialState: StatsState={
    stats:{
            threads:null,
            posts:null,
            users:null,
            newestUser:null
    },
    forumStats:null
};

export function reducer (state=initialState,action:fromStats.statsAction) {
    switch (action.type){
        case fromStats.LOAD_STATS_SUCCESS:{
            const stats=action.payload.stats;
            const forumStats=action.payload.forumStats;
            return {
                ...state,
                stats,
                forumStats
            }
        }
    }
    return state;
}
export const getStats=(state:StatsState)=>state;
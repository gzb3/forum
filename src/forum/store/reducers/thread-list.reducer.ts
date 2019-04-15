import * as fromThreadList from '../actions/thread-list.actions';
import {Thread} from '../../models/thread.model';
import {Forum} from '../../models/forum.model';

export interface ThreadListState {

    forum?:Forum
    entities:{[id:number]:Thread};
    page?:any;
    loading?:boolean
    loaded?:boolean,
}
export const initialState:ThreadListState={
    forum:null,
    entities:{},
    page:null,
    loading:false,
    loaded:false
};

export function reducer(state=initialState,action:fromThreadList.threadListAction):ThreadListState {

    switch (action.type){

        case fromThreadList.LOAD_THREADS_COMPLETED:{
            const forum=action.payload.forum;
            const page=action.payload.page;
            const entities=action.payload.threads.reduce(
                (entities:{[id:number]:Thread},thread:Thread)=>{
                return{
                    ...entities,
                    [thread.id]:thread
                }
            },{

            });
              return{
                ...state,
                 forum,
                 page,
                 loading:false,
                 loaded:true,
                 entities
            }
        }
        case fromThreadList.LOAD_THREADS:{
            return {
                ...state,
                loading:true,
                loaded:false
            };
        }
        case fromThreadList.DELETE_THREAD_SUCCESS:{
            const thread=action.payload;
            const {[thread.id]: removed, ...entities } = state.entities;
            return{
                ...state,
                entities
            };
        }
        case fromThreadList.CREATE_THREAD_COMPLETED:{
            const thread=action.payload;
            const entities={
                ...state.entities,
                [thread.id]:thread
            };
            return{
                ...state,
                entities,
            }
        }
        case fromThreadList.LOCK_UNLOCK_THREAD_SUCCESS:{
            const thread=action.payload;
            const entities={
                ...state.entities,
                [thread.id]:thread
            };
            return{
                ...state,
                entities,
            }
        }
    }
    return state
}
export const getThreadListLoading=(state:ThreadListState)=>state.loading;
export const getThreadListLoaded=(state:ThreadListState)=>state.loaded;
export const getThreadListEntities=(state:ThreadListState)=>state.entities;
export const getForum=(state:ThreadListState)=>state.forum;
export const getThreadListPage=(state:ThreadListState)=>state.page;
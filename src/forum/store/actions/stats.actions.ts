import {Action} from '@ngrx/store';
export const LOAD_STATS='[Forum] Load Stats';
export const LOAD_STATS_SUCCESS='[Forum] Load Stats Success';

export class LoadStats implements Action{
    readonly type=LOAD_STATS;
    constructor(){}
}

export class LoadStatsSuccess implements Action{
    readonly type=LOAD_STATS_SUCCESS;
    constructor(public payload:any){}
}

export type statsAction= LoadStats|LoadStatsSuccess;
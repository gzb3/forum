import * as statsActions from '../actions/stats.actions';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {BackendUrlService} from '../../services/backendUrl.service';
@Injectable()
export class StatsEffects{
    servicesUrl;
    constructor(private actions$:Actions,private httpClient:HttpClient,private burl:BackendUrlService){
        this.servicesUrl=burl.getUrl();
    }
    @Effect()
    loadStats=this.actions$.pipe(
        ofType(statsActions.LOAD_STATS),
        switchMap(()=>{
            let url=this.servicesUrl+'/forum.service.php?loadStats=1';
            return this.httpClient.get(url).pipe(
                map((res)=>{
                    return new statsActions.LoadStatsSuccess(res)
                })
            )
        })
    )

}
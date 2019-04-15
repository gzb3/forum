import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Routes, RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {StoreRouterConnectingModule,RouterStateSerializer} from "@ngrx/router-store";
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {reducers,CustomSerializer,effects} from './store';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import {AppComponent} from './containers/аpp/app.component';
import {ForumModule} from '../forum/forum.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'angular2-cookie/services/cookies.service';

const environment = {
    development: true,
    production: false,
};

export const metaReducers: MetaReducer<any>[] = !environment.production
    ? [storeFreeze]
    : [];

// routes
export const ROUTES: Routes = [
    {
        path:'',
        loadChildren: '../forum/forum.module#ForumModule',
    }

];

@NgModule({
    imports: [

        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(ROUTES, {}),
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot(effects),
        StoreRouterConnectingModule,
        ForumModule,

        environment.development ? StoreDevtoolsModule.instrument() : [],
    ],
    providers:[
         CookieService,
        {provide:RouterStateSerializer,useClass:CustomSerializer},

    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}







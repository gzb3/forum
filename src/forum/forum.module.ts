import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";

import {reducers,effects} from "./store";
// components
import * as fromComponents from './components';

// containers
import * as fromContainers from './containers';
import {
    ConversationListComponent, EditUserComponent,
    HomeComponent,
    LogInComponent, ManageComponent,
    SignUpComponent,
    ThreadListComponent,
    UserProfileComponent
} from './containers';

//guards
import * as fromGuards from './guards'

 //services
import * as fromServices from './services';
import {LMarkdownEditorModule} from 'ngx-markdown-editor';
import {ShowdownModule} from 'ngx-showdown';
import {UnavailableContentComponent} from './components';

// routes
export const ROUTES: Routes = [
    {
        path:'log-in',
        component:LogInComponent,
        data:{
            breadcrumb:'Log In'
        }
    },
    {
        path:'sign-up',component:SignUpComponent,
        data:{
            breadcrumb:'Sign Up'
        }
    },
    {
        path:'unavailable',component:UnavailableContentComponent,
        data:{
            breadcrumb:''
        }
    },
    //
    {
        path:'user/:id',
        data:{
            breadcrumb:'User'
        },
        canActivate:[fromGuards.ProfileGuard],

        children:[
            {
                path:'',component:UserProfileComponent,
            },
            {
                path:'edit',component:EditUserComponent,
                canActivate:[fromGuards.AuthGuard],
                data:{
                    breadcrumb:'Edit'
                },
            },
            {
                path:'conversations',component:ConversationListComponent,
                canActivate:[fromGuards.AuthGuard],
                data:{
                    breadcrumb:'Conversations'
                },
            },
            {
                path:'conversation/create',
                component:fromContainers.AddConversationComponent,
                data:{
                    breadcrumb:'Create Conversation'
                }
            },

            {
                path:'conversation/:id',
                component:fromContainers.MessageListComponent,
                canActivate:[fromGuards.ConversationGuard],
                data:{
                    breadcrumb:'Conversation'
                }
            },


        ]
    },
    //
    {
        path:'forum/:forumId',
        data:{
            breadcrumb:'Forum'
        },
        runGuardsAndResolvers:'paramsOrQueryParamsChange',
        canActivate:[fromGuards.ThreadListGuard],
        children:[
            {
                path:'',
                component:ThreadListComponent,
                children:[

                ]
            },
            {
                path:'thread/create',
                component:fromContainers.CreateThreadComponent,
                canActivate:[fromGuards.AuthGuard,fromGuards.BannedGuard],
                data:{
                    breadcrumb:'Create Thread'
                }
            },

            {
                path:'thread/:id',
                data:{
                    breadcrumb:'Thread'
                },
                runGuardsAndResolvers: 'always',
                canActivate:[fromGuards.PostListGuard],
                children:[
                    {
                        path:'',
                        component:fromContainers.PostListComponent
                    },
                    {
                        path:'new-post',
                        component:fromContainers.AddPostComponent,
                        canActivate:[fromGuards.AuthGuard,fromGuards.BannedGuard,fromGuards.LockGuard],
                        data:{
                            breadcrumb:'New Post'
                        }
                    },

                ]
            },
        ],
    },
    {
      path: 'manage',component:ManageComponent,
        canActivate:[fromGuards.ModGuard],
      data:{
          breadcrumb:'Manage'
      }
    },

    {
        path:'',component:HomeComponent,
        data:{
            breadcrumb:'Home'
        },
        canActivate:[fromGuards.HomeGuard]
    },
];

@NgModule({
    imports: [
        ShowdownModule,
        LMarkdownEditorModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forChild(ROUTES),
        StoreModule.forFeature('forum',reducers),
        EffectsModule.forFeature(effects),
    ],
    providers: [...fromServices.services,...fromGuards.guards],
    declarations: [...fromContainers.containers, ...fromComponents.components],
    exports: [...fromContainers.containers, ...fromComponents.components],

})
export class ForumModule{}
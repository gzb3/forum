import {ConversationGuard} from './conversation.guard';
import {AuthGuard} from './auth.guard';
import {ModGuard} from './mod.guard';
import {BannedGuard} from './banned.guard';
import {LockGuard} from './lock.guard';
import {ProfileGuard} from './profile.guard';
import {PostListGuard} from './post-list.guard';
import {HomeGuard} from './home.guard';
import {ThreadListGuard} from './thread-list.guard';

export * from './auth.guard';
export * from './conversation.guard';
export * from './mod.guard';
export * from './banned.guard';
export * from './lock.guard';
export * from './profile.guard';
export * from './home.guard';
export * from  './post-list.guard';
export * from  './thread-list.guard';
export const guards:any[] = [ ThreadListGuard,HomeGuard,PostListGuard,ProfileGuard,AuthGuard,ConversationGuard,ModGuard,BannedGuard,LockGuard];
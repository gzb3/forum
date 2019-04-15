import {PostListEffects} from './post-list.effects';
import {ThreadListEffects} from './thread-list.effects';
import {AuthEffects} from './auth.effects';
import {UserEffects} from './user.effects';
import {ConversationListEffects} from './conversation-list.effects';
import {MessageListEffects} from './message-list.effects';
import {StatsEffects} from './stats.effects';

export * from './post-list.effects';
export * from './thread-list.effects';
export * from './auth.effects';
export * from './user.effects';
export * from './conversation-list.effects';
export * from './message-list.effects';
export * from './stats.effects'
export const effects:any[]=[PostListEffects,ThreadListEffects,AuthEffects,UserEffects,ConversationListEffects,MessageListEffects,StatsEffects];

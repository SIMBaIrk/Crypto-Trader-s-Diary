import { check } from 'meteor/check';
import { UserExchangeSettingsCollection } from './userExchangeSettings';
import { UserSettingsCollection } from './userSettings';

Meteor.methods({'exchange.insert'(exchange, apiKey, apiPhrase){
    check(apiKey, String);
    check(apiPhrase, String);

    // const userFilter = user ? { userId: user._id } : {};
     }})
import { check } from 'meteor/check';
import { UserSettingsCollection } from './userSettings';

Meteor.methods({
    'settings.insert'(text) {
        //check(text, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        UserSettingsCollection.insert({
            apiKey: "",
            apiSecret: "",
            mainTF: "",
            exchangeSettings: [],
            createdAt: new Date,
            userId: this.userId,
            isActive: true
        })
    }})
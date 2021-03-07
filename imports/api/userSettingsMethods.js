import { check } from 'meteor/check';
import { UserSettingsCollection } from './userSettings';

Meteor.methods({
    'settings.insert'(tf) {
        check(tf, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        let us = UserSettingsCollection.find({userId: this.userId, isActive: true}).fetch();

        if (us.length == 0){
            UserSettingsCollection.insert({
                mainTF: tf,
                createdAt: new Date,
                userId: this.userId,
                isActive: true
        })
        }
    },
    'settings.update_tf'(tf){
        check(tf, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        UserSettingsCollection.update({userId: this.userId, isActive: true}, {$set: {mainTF: tf}});
    }
})
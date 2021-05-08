import { check } from 'meteor/check';
import { UserActivityCollection } from '../db/userActivity';

export function userActivitySetSymbol(symbol, userId){
    let userActivity = UserActivityCollection.findOne({userId: userId});

    if (userActivity == undefined){
        userActivity = {loadSymbol: symbol, hasLoad: false, userId: userId};

        UserActivityCollection.insert(userActivity);
    } else {

        UserActivityCollection.update({userId: userId}, {$set: {loadSymbol: symbol}});
    }
}

export function userActivitySetLoad(hasLoad, userId){
    let userActivity = UserActivityCollection.findOne({userId: userId});

    if (userActivity == undefined){
        userActivity = {loadSymbol: "", hasLoad: hasLoad, userId: userId};

        UserActivityCollection.insert(userActivity);
    } else {

        UserActivityCollection.update({userId: userId}, {$set: {hasLoad: hasLoad}});
    }
}

export function userActivitySetStopLoad(stopLoad, userId){
    let userActivity = UserActivityCollection.findOne({userId: userId});

    if (userActivity == undefined){
        userActivity = {loadSymbol: "", hasLoad: false, userId: userId, stopLoad: stopLoad};

        UserActivityCollection.insert(userActivity);
    } else {

        UserActivityCollection.update({userId: userId}, {$set: {stopLoad: stopLoad}});
    }
}

Meteor.methods({
    'userActivity.setSymbol'(symbol){

        check (symbol, String);
        if (!this.userId){
            throw new Meteor.Error('Not authorized.');
        };

        userActivitySetSymbol(symbol, this.userId);
    },
    'userActivity.setLoad'(hasLoad){
        check(hasLoad, Boolean);

        if (!this.userId){
            throw new Meteor.Error('Not authorized.');
        };

        userActivitySetLoad(hasLoad, this.userId);
    },
    'userActivity.setStopLoad'(stopLoad){
        check(stopLoad, Boolean);
        if (!this.userId){
            throw new Meteor.Error('Not authorized.');
        };

        userActivitySetStopLoad(stopLoad, this.userId);
    }
});

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { UserActivityCollection } from '../db/userActivity';

const NotAuthorisedExceptionString = 'Not authorized.';

export function userActivitySetSymbol(symbol, userId) {
  let userActivity = UserActivityCollection.findOne({ userId });

  if (userActivity === undefined) {
    userActivity = { loadSymbol: symbol, hasLoad: false, userId };

    UserActivityCollection.insert(userActivity);
  } else {
    UserActivityCollection.update({ userId }, { $set: { loadSymbol: symbol } });
  }
}

export function userActivitySetLoad(hasLoad, userId) {
  let userActivity = UserActivityCollection.findOne({ userId });

  if (userActivity === undefined) {
    userActivity = { loadSymbol: '', hasLoad, userId };

    UserActivityCollection.insert(userActivity);
  } else {
    UserActivityCollection.update({ userId }, { $set: { hasLoad } });
  }
}

export function userActivitySetStopLoad(stopLoad, userId) {
  let userActivity = UserActivityCollection.findOne({ userId });

  if (userActivity === undefined) {
    userActivity = {
      loadSymbol: '', hasLoad: false, userId, stopLoad,
    };

    UserActivityCollection.insert(userActivity);
  } else {
    UserActivityCollection.update({ userId }, { $set: { stopLoad } });
  }
}

Meteor.methods({
  'userActivity.setSymbol': function setSymbol(symbol) {
    check(symbol, String);
    if (!this.userId) {
      throw new Meteor.Error(NotAuthorisedExceptionString);
    }

    userActivitySetSymbol(symbol, this.userId);
  },
  'userActivity.setLoad': function setLoad(hasLoad) {
    check(hasLoad, Boolean);

    if (!this.userId) {
      throw new Meteor.Error(NotAuthorisedExceptionString);
    }

    userActivitySetLoad(hasLoad, this.userId);
  },
  'userActivity.setStopLoad': function setStopLoad(stopLoad) {
    check(stopLoad, Boolean);
    if (!this.userId) {
      throw new Meteor.Error(NotAuthorisedExceptionString);
    }

    userActivitySetStopLoad(stopLoad, this.userId);
  },
});

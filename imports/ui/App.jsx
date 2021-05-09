/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Switch, Route } from 'react-router-dom';
import { NavBar } from './NavBar';
import { TradeBody } from './Trades';
import { Settings } from './Settings';
import { UserSettingsCollection } from '../db/userSettings';
// import Meteor from 'meteor/meteor'; // Meteor в глобальном смысле это не то же самое что
// meteor/meteor не знаю почему так...
//

export const App = () => {
  const user = useTracker(() => Meteor.user());

  if (user) {
    // я не могу обратиться к meteor.userId поэтому оставил так
    const us = UserSettingsCollection.find({ userId: user._id, isActive: true }).fetch();
    if (us.length === 0) {
      Meteor.call('settings.insert', '1h');
    }
  }

  // в зависимости от логин пользователя выводится либо общая информация, либо описание сайта
  return (
    <div className="container">

      <NavBar user={user} />
      <Switch>
        <Route path="/settings">
          <Settings user={user} />
        </Route>
        <Route exact path="/">
          <TradeBody user={user} />
        </Route>
      </Switch>
    </div>
  );
};

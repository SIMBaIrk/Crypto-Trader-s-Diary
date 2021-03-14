import React, { useState } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { NavBar } from "./NavBar";
import { TradeBody } from './Trades';
import { Settings } from './Settings';
import { UserSettingsCollection } from '../db/userSettings'
import { Switch, Route } from 'react-router-dom'

export const App = () => {
    const user = useTracker(() => Meteor.user());

    if (user){
        let us = UserSettingsCollection.find({userId: user._id, isActive: true}).fetch();
        if (us.length == 0){
            Meteor.call('settings.insert','1h');
        }
    }

    // в зависимости от логин пользователя выводится либо общая информация, либо описание сайта
    return (<div className="container">

        <NavBar user={user} />
        <Switch>
          <Route path="/settings">
            <Settings user={user}/>
          </Route>
          <Route exact path="/">
            <TradeBody user={user}/>
          </Route>
        </Switch>
    </div>);
};

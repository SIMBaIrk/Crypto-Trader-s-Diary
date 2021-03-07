import React, { useState } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { NavBar } from "./NavBar";
import { TradeBody } from './Trades';
import { Settings } from './Settings';
import { UserSettingsCollection } from '../api/userSettings'

export const App = () => {
    const user = useTracker(() => Meteor.user());
    const [itemMenu, setItemMenu] = useState(0);

    let Body = <TradeBody user={user} />
    if (itemMenu == 1){
        Body = <Settings user={user} />;
    }

    if (user){
        let us = UserSettingsCollection.find({userId: user._id, isActive: true}).fetch();
        if (us.length == 0){
            Meteor.call('settings.insert','1h');
        }
    }

    // в зависимости от логин пользователя выводится либо общая информация, либо описание сайта
    return (<div className="container">

        <NavBar user={user} itemMenu={itemMenu} setItemMenu={setItemMenu}/>
        {Body}
        
    </div>);
};

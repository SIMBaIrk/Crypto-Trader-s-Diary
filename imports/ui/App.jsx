import React, {Fragment} from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { NavBar } from "./NavBar";
import { TradeBody } from './Trades';

export const App = () => {
    const user = useTracker(() => Meteor.user());
    // в зависимости от логин пользователя выводится либо общая информация, либо описание сайта
    return (<div className="container">

        <NavBar user={user} />
        <TradeBody user={user} />
    </div>);
};

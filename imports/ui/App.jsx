import React, { useState } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { NavBar } from "./NavBar";
import { TradeBody } from './Trades';
import { Settings } from './Settings';

export const App = () => {
    const user = useTracker(() => Meteor.user());
    const [itemMenu, setItemMenu] = useState(0);

    let Body = <TradeBody user={user} />
    if (itemMenu == 1){
        Body = <Settings user={user} />;
    }
    // в зависимости от логин пользователя выводится либо общая информация, либо описание сайта
    return (<div className="container">

        <NavBar user={user} itemMenu={itemMenu} setItemMenu={setItemMenu}/>
        {Body}
        
    </div>);
};

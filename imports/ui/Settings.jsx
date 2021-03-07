import React from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { UserSettingsCollection } from '../db/userSettings';
import { exchanges } from 'ccxt';

const SelectTF = (props) => {

    return <form><select className="form-control" onChange={props.onChange} value={props.selected}>
        {props.allTF.map((timef) => <option key={timef.id} value={timef.id}>{timef.title}</option>)}
    </select></form>
}

function getSettings(user){
    const userFilter = user ? { userId: user._id, isActive: true } : {};
    const userSettings = useTracker(() => {
        if (!user) {
          return [];
        }
    
        return UserSettingsCollection.find(
          userFilter
        ).fetch();
    });

    return userSettings[0]; // при создании сразу есть
}

export const Settings = (props) => {
    curSettings = getSettings(props.user);
    
    const curTF = curSettings.mainTF
    const allTF = [{id: '1m', title:'1 минута'},
    {id: '3m', title:'3 минуты'},
    {id: '5m', title: '5 минут'},
    {id: '15m', title: '15 минут'},
    {id: '30m', title: '30 минут'},
    {id: '1h', title: '1 час'},
    {id: '2h', title: '2 часа'},
    {id: '4h', title: '4 часа'},
    {id: '6h', title: '6 часов'},
    {id: '8h', title: '8 часов'},
    {id: '12h', title: '12 часов'},
    {id: '1d', title: '1 день'},
    {id: '3d', title: '3 дня'},
    {id: '1w', title: '1 неделя'},
    {id: '1M', title: '1 месяц'}]

    function onChangeTF(e){
        //console.log(e.target.value);
        Meteor.call('settings.update_tf',e.target.value);
        //curSettings.mainTF = e.Target.key;
    }

    return <div className="container">
        <div className="page-header">
            <h1>Настройки</h1>
        </div>
        
        <SelectTF allTF={allTF} selected={curTF} onChange={onChangeTF}/>

        <form>
            <div className="form-group">
                <label htmlFor="inputAPIname">Биржа</label>
                <input type="text" className="form-control" id="inputAPIname" placeholder="binance" />
            </div>
            <div className="form-group">
                <label htmlFor="inputAPI">API</label>
                <input type="text" className="form-control" id="inputAPI" placeholder="api" />
            </div>
            <div className="form-group">
                <label htmlFor="inputAPIKey">API-key</label>
                <input type="password" className="form-control" id="inputAPI" placeholder="key" />
            </div>
            <button type="submit" className="btn btn-default">Сохранить</button>
        </form>
  </div>
}

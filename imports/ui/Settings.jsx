import React, { createContext, useState, useEffect } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { UserSettingsCollection } from '../db/userSettings';
import ccxt, { exchanges } from 'ccxt';
import { UserExchangeSettingsCollection } from '../db/userExchangeSettings';
//const ccxt = require ('ccxt');

// собственно компонент отображения формы редактирования
// вся магия тут
const ExchangeEdit = (props) => {

    const [exchangeUserName, setExchangeUserName] = useState(props.exchange.exchangeName || '');
    const [exchangeName, setExchangeName] = useState(props.exchange.exchange || '');
    const [exchangeKEY, setExchangeKey] = useState(props.exchange.apiKey || '');
    const [exchangeSecret, setExchangeAPI] = useState(props.exchange.secret || '');

    function onReset(e){
        props.changeEdit(false);
    }
    function onSubmit(e){
        if (props.exchangeID == 0)
            Meteor.call('exchange.insert',exchangeUserName, exchangeName, exchangeKEY, exchangeSecret);
        else
            Meteor.call('exchange.update',props.exchange._id, exchangeUserName, exchangeName, exchangeKEY, exchangeSecret)
        
        props.changeEdit(false);
    }
    function onRemove(e){
        if(props.exchangeID != 0)
            Meteor.call('exchange.remove',props.exchange._id);

        props.changeEdit(false);
    }

    return <li key={props.exchangeID} className="list-group-item">
        <form>
            <div className="panel panel-default">
                <div className="panel-heading" style={{marginBottom: 15 + "px"}}>
                    <h4 className="panel-title">{exchangeUserName}&nbsp;
                        <button type="button" className="btn btn-default" aria-label="Left Align" onClick={onSubmit}>
                            <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
                        </button>
                        <span className="pull-right">
                            <button type="button" className="btn btn-default" aria-label="Left Align" onClick={onReset}>
                                <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span>
                            </button>
                            <button type="button" className="btn btn-default" aria-label="Left Align" onClick={onRemove}>
                                <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            </button>
                        </span>
                    </h4>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon3">Название</span>
                        <input type="text" className="form-control" id="inputExchangeUserName" placeholder="Удобное название биржи" onChange={(e)=>setExchangeUserName(e.target.value)} defaultValue={exchangeUserName}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon3">Биржа</span>
                        <select className="form-control selectpicker" onChange={(e)=>setExchangeName(e.target.value)} value={props.exchange.exchange}>
                                {props.allExchanges.map((exName) => <option key={exName}>{exName}</option>)}
                                </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon3">Ключ API</span>
                        <input type="text" className="form-control" id="inputAPI" placeholder="Ключ api" onChange={(e)=>setExchangeKey(e.target.value)} defaultValue={exchangeKEY} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon3">Секретный ключ</span>
                        <input type="password" className="form-control" id="inputAPI" placeholder="Секретная часть ключа" onChange={(e)=>setExchangeAPI(e.target.value)} defaultValue={exchangeSecret}/>
                    </div>
                </div>
                </div>
            </form>
    </li>
}

// переключение в режим редактирования
const ExchangeInfo = (props) => {
    const [hasEdited, changeEdit] = useState(false);
    const [hasConnected, changeConStatus] = useState(undefined);

    function onClickChange(e){
        changeEdit(true);
    }

    useEffect(() => {
        if (props.exchange._id != 0){
            Meteor.call('ccxt.fetchBalance',props.exchange.exchange, props.exchange.apiKey, props.exchange.secret,(error, result)=>{
                if (result.error != undefined){
                    changeConStatus('label label-danger');
                }else{
                    changeConStatus('label label-success');
                }
                //console.log(result);
                //console.log(error);
            })
        }
    });

    glyphonClass = "align-right glyphicon glyphicon-plus";
    checkStatus = "";
    if (props.exchange._id != 0){
        glyphonClass = "align-right glyphicon glyphicon-edit";
        
        checkStatus = <span className={"pull-right "  + (hasConnected != undefined ? hasConnected : "label label-default")} ><span className="glyphicon glyphicon-bitcoin" /></span>
    }
    //console.log(props.exchange._id);
    return hasEdited ? <ExchangeEdit exchangeID={props.exchange._id} changeEdit={changeEdit} {...props} />: 
        <li className="list-group-item">
            {props.exchange.exchangeName}&nbsp;
            <button type="button" onClick={onClickChange}>
            <span className={glyphonClass} aria-hidden="true"></span></button>
            {checkStatus}
        </li>
}

// список апи
const ListExchanges = (props) => {
    
    return <div className="panel panel-default">
    <div className="panel-heading">Подключения</div>
        <ul className="list-group">
            {props.exchanges.map((curExchange) => <ExchangeInfo key={curExchange._id} exchange={curExchange} allExchanges={props.allExchanges}/>)}
        </ul>
    </div>
}

// выбор ТФ
const SelectTF = (props) => {

    return <div className="panel panel-default">
        <div className="panel-heading" style={{marginBottom: 15 + "px"}}>Основные</div>
            <form>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon3">Основной ТФ для сделок</span>
                        <select className="form-control" onChange={props.onChange} value={props.selected}>
                        {props.allTF.map((timef) => <option key={timef.id} value={timef.id}>{timef.title}</option>)}
                        </select>
                </div>
            </form>
        </div>
}

// получение настроек пользователя, не стал в пользователя заталкивать, чтобы не зависеть от модуля accounting
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

// получить список настроек подключения
function getExchages(user){
    const userFilter = user ? { userId: user._id } : {};
    const userExchanges = useTracker(() => {
        if (!user){
            return [];
        }

        return UserExchangeSettingsCollection.find(userFilter).fetch();
    });

    return userExchanges;
}

// модуль страницы настроек
export const Settings = (props) => {

    if (props.user == undefined){
        return <div className="alert alert-danger">Вы должны авторизироваться, чтобы иметь доступ к этому разделу сайта</div>
    };

    const allExchanges = exchanges;
    const curSettings = getSettings(props.user);
    const curExchanges = getExchages(props.user);
    
    curExchanges.push({_id:0, exchangeName:"NEW"});

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
        Meteor.call('settings.update_tf',e.target.value);
    }

    return <div className="container">
        <div className="page-header">
            <h1>Настройки</h1>
        </div>
        
        <SelectTF allTF={allTF} selected={curTF} onChange={onChangeTF}/>
        <ListExchanges exchanges={curExchanges} allExchanges={allExchanges}/>
  </div>
}

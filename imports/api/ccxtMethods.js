import { check } from 'meteor/check';
import ccxt from 'ccxt';
import { UserExchangeSettingsCollection } from '../db/userExchangeSettings';
import { UserTradesCollection } from '../db/userTrades';
import { userActivitySetLoad, userActivitySetStopLoad, userActivitySetSymbol } from './userActivityMethods';

let stackLoad = [];

function getExchange(exchangeID, api, secret){
    const exchangeClass = ccxt[exchangeID];

    const exchange = new exchangeClass ({
        'apiKey': api,
        'secret': secret,
        'timeout': 30000,
        'enableRateLimit': true
//        'rateLimit': 500
    });

    return exchange;
}

async function fetchBalance(exchangeID, api, secret){
    const exchange = getExchange(exchangeID, api, secret);

    let balance = {balance:undefined, error: undefined};
    try{
        balance.balance = await exchange.fetchBalance();
    }catch(e){
        balance.error = e;
    }
    
    return balance;
}

async function fetchAsyncMyTrades(_exch, userId){
    // 
    console.log(0);
    await _exch.loadMarkets();

    let myTrades = [];
    const allSymbols = _exch.symbols
    let taskTrades = [];
    for(let i = 0; i < allSymbols.length; i++){
        
        if (taskTrades.length % 100 == 0){
            myTrades = myTrades.concat(await Promise.all(taskTrades));
            taskTrades = [];
        }

        const symbol = allSymbols[i];
        const lastUserTrades = UserTradesCollection.findOne({userId: userId, symbol: symbol},{sort: {timestamp: -1}});
        taskTrades.push(_exch.fetchMyTrades(symbol, lastUserTrades, 25));
    }

    if (taskTrades.length != 0){
        myTrades.concat(await Promise.all(taskTrades));
    }

    console.log(myTrades.length);
}

Meteor.methods({
    'ccxt.fetchBalance'(exchangeID, api, secret){
        // получаем баланс по бирже
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        check(api, String);
        check(secret, String);
        check(exchangeID, String);

        return fetchBalance(exchangeID, api, secret);
    },

    'ccxt.fetchMyTrades'(){
        // подгружаем торговлю
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const thisUserID = this.userId;
        
        // сбрасываем загрузку
        userActivitySetStopLoad(false, thisUserID);
        userActivitySetLoad(true, thisUserID);
        userActivitySetSymbol("", thisUserID);

        // для каждого настроенного exchange получаем последние данные
        let exchanges = UserExchangeSettingsCollection.find({userId: thisUserID}).fetch();
        
        // способа получить за один раз только последние трейды нет,
        // поэтому придется обойти все пары :( по очереди запрашивая каждую
        exchanges.forEach(element => {
            const _exch = getExchange(element.exchange, element.apiKey, element.secret);
            fetchAsyncMyTrades(_exch, thisUserID);
        });
    }
});
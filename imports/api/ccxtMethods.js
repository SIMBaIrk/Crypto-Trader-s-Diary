import { check } from 'meteor/check';
import ccxt from 'ccxt';
import { UserExchangeSettingsCollection } from '../db/userExchangeSettings';

function getExchange(exchangeID, api, secret){
    const exchangeClass = ccxt[exchangeID];

    const exchange = new exchangeClass ({
        'apiKey': api,
        'secret': secret,
        'timeout': 30000,
        'enableRateLimit': true,
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

async function fetchMyTrades(_exch){
    let myTrades = _exch.fetchMyTrades("XLM/BTC", undefined, 25, {});
    return await myTrades;
}

Meteor.methods({
    'ccxt.fetchBalance'(exchangeID, api, secret){
        check(api, String);
        check(secret, String);
        check(exchangeID, String);

        return fetchBalance(exchangeID, api, secret);
        //return exchange.fetchBalance();
    },

    'ccxt.fetchMyTrades'(){
        // console.log("run fetchMyTrades");
        // для каждого настроенного exchange получаем последние данные
        let exchanges = UserExchangeSettingsCollection.find({userId: this._id}).fetch();
        let trades = [];

        exchanges.forEach(element => {
            const _exch = getExchange(element.exchange, element.apiKey, element.secret);
            trades.push(fetchMyTrades(_exch));
        });

        return Promise.all(trades);
    }
});
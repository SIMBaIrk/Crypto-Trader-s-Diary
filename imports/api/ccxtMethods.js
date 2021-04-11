import { check } from 'meteor/check';
import ccxt from 'ccxt';
import { UserExchangeSettingsCollection } from '../db/userExchangeSettings';
import { UserTradesCollection } from '../db/userTrades';

function getExchange(exchangeID, api, secret){
    const exchangeClass = ccxt[exchangeID];

    const exchange = new exchangeClass ({
        'apiKey': api,
        'secret': secret,
        //'timeout': 30000,
        'enableRateLimit': true,
        'rateLimit': 500
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

/* async function fetchMyTrades(_exch, symbol, since){
    let myTrades = _exch.fetchMyTrades(symbol, since, 25, {});
    return myTrades;
} */

async function fetchAsyncMyTrades(_exch, userId){
    await _exch.loadMarkets();

    let myTrades = [];
    const allSymbols = _exch.symbols

    for(let i = 0; i < allSymbols.length; i++){
        const symbol = allSymbols[i];
        
        const lastUserTrades = UserTradesCollection.findOne({userId: userId, symbol: symbol},{sort: {timestamp: -1}});
        const myTradeOfSymbol = await _exch.fetch_my_trades(symbol, lastUserTrades, 25);
        if (myTradeOfSymbol.length != 0){
            myTrades.push(myTradeOfSymbol);
        }
    }

    console.log(myTrades.length);
}

Meteor.methods({
    'ccxt.fetchBalance'(exchangeID, api, secret){
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        check(api, String);
        check(secret, String);
        check(exchangeID, String);

        return fetchBalance(exchangeID, api, secret);
        //return exchange.fetchBalance();
    },

    'ccxt.fetchMyTrades'(){

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        // console.log("run fetchMyTrades");
        // для каждого настроенного exchange получаем последние данные
        let exchanges = UserExchangeSettingsCollection.find({userId: this.userId}).fetch();
        //let trades = [];
        const thisUserID = this.userId;
        // способа получить за один раз только последние трейды нет,
        // поэтому придется обойти все пары :( по очереди запрашивая каждую
        exchanges.forEach(element => {
            const _exch = getExchange(element.exchange, element.apiKey, element.secret);
            fetchAsyncMyTrades(_exch, thisUserID);
            //getSymbols(_exch).then(function(symbols){
/*                 symbols.forEach(symbol => {
                    let lastUserTrades = undefined;
                    lastUserTrades = UserTradesCollection.findOne({userId: thisUserID, symbol: symbol},{sort: {timestamp: -1}});
                    fetchMyTrades(_exch, symbol, lastUserTrades).then(function(result){
                        console.log(symbol + ": " + result);
                    });
                    //trades = trades.concat(fetchMyTrades(_exch, symbol, lastUserTrades)); // по сути тут нужно ложить в trades
                }) */
//            });
        });
        //console.log("res " + trades.length);
        
        //return trades;
    }
});
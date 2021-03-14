import { check } from 'meteor/check';
import ccxt from 'ccxt';

async function fetchBalance(exchangeID, api, secret){
    const exchangeClass = ccxt[exchangeID];
    const exchange = new exchangeClass ({
        'apiKey': api,
        'secret': secret,
        'timeout': 30000,
        'enableRateLimit': true,
    });

    let balance = {balance:undefined, error: undefined};
    try{
        balance.balance = await exchange.fetchBalance();
    }catch(e){
        balance.error = e;
    }
    
    return balance;
}

Meteor.methods({
    'ccxt.fetchBalance'(exchangeID, api, secret){
        check(api, String);
        check(secret, String);
        check(exchangeID, String);

        return fetchBalance(exchangeID, api, secret);
        //return exchange.fetchBalance();
    }
});
import { check } from 'meteor/check';
import ccxt from 'ccxt';
import { UserExchangeSettingsCollection } from '../db/userExchangeSettings';
import { UserTradesCollection } from '../db/userTrades';
import { userActivitySetLoad, userActivitySetStopLoad, userActivitySetSymbol } from './userActivityMethods';

function getExchange(exchangeID, api, secret) {
  const ExchangeClass = ccxt[exchangeID];

  return new ExchangeClass({
    apiKey: api,
    secret,
    timeout: 30000,
    enableRateLimit: true,
    //        'rateLimit': 500
  });
}

async function fetchBalance(exchangeID, api, secret) {
  const exchange = getExchange(exchangeID, api, secret);

  const balance = { balance: undefined, error: undefined };
  try {
    balance.balance = await exchange.fetchBalance();
  } catch (e) {
    balance.error = e;
  }

  return balance;
}

function jobFetchMyTrades(symbol, allSymbols, userId, exch) {
  const lastUserTrades = UserTradesCollection.findOne({ userId, symbol },
    { sort: { timestamp: -1 } });

  return new Promise(exch.fetchMyTrades(symbol, lastUserTrades, 25));
}

// tiny-async-pool
// https://github.com/rxaviers/async-pool/blob/master/lib/es7.js
async function asyncPool(poolLimit, array, iteratorFn, ...theArgs) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array, theArgs));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.allSettled(ret);
}

async function fetchAsyncMyTrades(_exch, userId) {
  //
  console.log(0);
  await _exch.loadMarkets();

  const allSymbols = _exch.symbols;

  const result = asyncPool(1000, allSymbols, jobFetchMyTrades, userId, _exch);

  console.log(result.length);
}

Meteor.methods({
  'ccxt.fetchBalance': function ccxtFetchBalance(exchangeID, api, secret) {
    // получаем баланс по бирже
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    check(api, String);
    check(secret, String);
    check(exchangeID, String);

    return fetchBalance(exchangeID, api, secret);
  },

  'ccxt.fetchMyTrades': function ccxtFetchMyTrades() {
    // подгружаем торговлю
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const thisUserID = this.userId;

    // сбрасываем загрузку
    userActivitySetStopLoad(false, thisUserID);
    userActivitySetLoad(true, thisUserID);
    userActivitySetSymbol('', thisUserID);

    // для каждого настроенного exchange получаем последние данные
    const exchanges = UserExchangeSettingsCollection.find({ userId: thisUserID }).fetch();

    // способа получить за один раз только последние трейды нет,
    // поэтому придется обойти все пары :( по очереди запрашивая каждую
    exchanges.forEach((element) => {
      const exch = getExchange(element.exchange, element.apiKey, element.secret);
      fetchAsyncMyTrades(exch, thisUserID);
    });
  },
});

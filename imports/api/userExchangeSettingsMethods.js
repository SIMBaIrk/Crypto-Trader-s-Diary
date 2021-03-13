import { check } from 'meteor/check';
import { UserExchangeSettingsCollection } from '../db/userExchangeSettings';

Meteor.methods({'exchange.insert'(exchangeName, exchange, apiKey, secret){
    check(apiKey, String);
    check(secret, String);
    check(exchangeName, String);
    check(exchange, String);

    if (!this.userId) {
        throw new Meteor.Error('Not authorized.');
    }
    // const userFilter = user ? { userId: user._id } : {};

    UserExchangeSettingsCollection.insert(
        {  
            userId: this.userId,
            exchangeName:exchangeName,
            exchange:exchange,
            apiKey: apiKey,
            secret: secret
        }
    )
    },
    'exchange.update'(_id, exchangeName, exchange, apiKey, secret){
        check(apiKey, String);
        check(secret, String);
        check(exchangeName, String);
        check(exchange, String);
    
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        UserExchangeSettingsCollection.update({userId: this.userId, _id: _id}, {$set: 
            {exchangeName:exchangeName,
            exchange:exchange,
            apiKey: apiKey,
            secret: secret}
        });
    },
    'exchange.remove'(_id){
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        UserExchangeSettingsCollection.remove({userId: this.userId, _id: _id});
    }

})
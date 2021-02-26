// https://react-tutorial.meteor.com/simple-todos/08-methods.html
// https://apexcharts.com/react-chart-demos/candlestick-charts/category-x-axis/

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
    const SEED_USERNAME = 'manager';
    const SEED_PASSWORD = 'password';

    Meteor.startup(() => {
        if (!Accounts.findUserByUsername(SEED_USERNAME)) {
            Accounts.createUser({
                username: SEED_USERNAME,
                password: SEED_PASSWORD,
            });
        }
    });
});

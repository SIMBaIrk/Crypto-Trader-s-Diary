// https://react-tutorial.meteor.com/simple-todos/08-methods.html
// https://apexcharts.com/react-chart-demos/candlestick-charts/category-x-axis/

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import '../imports/api/userSettingsMethods';
import '../imports/api/userExchangeSettingsMethods';
import '../imports/api/ccxtMethods';

var connectHandler = WebApp.connectHandlers;

WebApp.rawConnectHandlers.use(function(req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   next();
 });


Meteor.startup(() => {
    // WebApp.rawConnectHandlers.use(function(req, res, next) {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     next();
    //   });
    //Meteor.startup(() => {
        //connectHandler.use(function (req, res, next) {
            //WebApp.rawConnectHandlers.use(function(req, res, next) {
            //    if (req._parsedUrl.pathname.match(/\.(ttf|ttc|otf|eot|woff|woff2|font\.css|css)$/)) {
            //      res.setHeader('Access-Control-Allow-Origin', /* your hostname, or just '*' */);
            //    }
            //    next();
            //  });
        //    res.setHeader('Access-Control-Allow-Origin', '*');
            //res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubDomains'); // 2592000s / 30 days
        //    return next();
        //  })
    //});
});

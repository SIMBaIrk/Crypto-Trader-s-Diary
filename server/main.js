// https://react-tutorial.meteor.com/simple-todos/08-methods.html
// https://apexcharts.com/react-chart-demos/candlestick-charts/category-x-axis/

import { Meteor } from 'meteor/meteor';
import '../imports/api/userSettingsMethods';
import '../imports/api/userExchangeSettingsMethods';
import '../imports/api/ccxtMethods';
import '../imports/api/userActivityMethods';

/* var connectHandler = WebApp.connectHandlers;

WebApp.rawConnectHandlers.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
next();
 });
*/

Meteor.startup(() => {
});

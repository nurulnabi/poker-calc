/*
* @Author: noor
* @Date:   2017-05-24 10:00:31
* @Last Modified by:   noor
* @Last Modified time: 2017-05-31 18:15:13
*/

var holdemWinner = require('./lib/holdemWinner');
var omahaWinner  = require('./lib/omahawinner');

module.exports = { getHoldemWinner:holdemWinner, getOmahaWinner:omahaWinner };
/*
* @Author: noor
* @Date:   2017-05-24 10:00:31
* @Last Modified by:   noor
* @Last Modified time: 2017-06-01 15:02:59
*/

var holdemWinner 		= require('./lib/holdemWinner');
var omahaWinner  		= require('./lib/omahawinner');
var typeForFiveCards	= require('./utils/fiveCardsType');

module.exports = { getHoldemWinner:holdemWinner, getOmahaWinner:omahaWinner, getType:typeForFiveCards };
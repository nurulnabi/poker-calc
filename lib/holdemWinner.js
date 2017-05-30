/*
* @Author: noor
* @Date:   2017-05-24 10:00:31
* @Last Modified by:   noor
* @Last Modified time: 2017-05-30 15:36:23
*/

var _					= require('underscore');
var handGenerator		= require('./findType');
var nameAndPriority		= require('./nameAndPriority');
var utilsLib			= require('../utils/lib');
var helper 				= require('../utils/helper');	

var prepareHighHandForEachPlayer = function(params){
	params.handsArray = [];
	for(var pCards of params.playerCards){
		var tmpParams 	   = { set: []};
		tmpParams.set 	   = params.boardCards.concat(pCards.cards);
		tmpParams.playerId = pCards.playerId;
		handGenerator.prepareHighHand(tmpParams);
		params.handsArray.push(tmpParams);
	}
}

var decideWinner = function(params, flags){
	if(params.boardCards.length < 5 || params.playerCards.length < 1){
		return [];
	}
	prepareHighHandForEachPlayer(params);
	helper.groupCardsWithEqualRank(params);
	helper.getHighestCards(params);
	helper.findHighestHand(params, params.highestCards, 0);
	if(flags.compactCards){
		return utilsLib.compactCards(params.winner);
	}
	return params.winner;
}

module.exports = decideWinner
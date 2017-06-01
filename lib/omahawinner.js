/*
* @Author: noor
* @Date:   2017-05-30 15:38:21
* @Last Modified by:   noor
* @Last Modified time: 2017-06-01 13:11:57
*/

var pc 					= require('../utils/permutation');
var handGenerator		= require('./findType');
var _ 					= require('underscore');
var helper 				= require('../utils/helper');
var prepareType			= require('../utils/fiveCardsType');
var utilsLib 			= require('../utils/lib');

var combineFiveCards = function(boardCards, playerCards){
	var tmpCardsCombination = [];
	playerCards.forEach(function(tCards){
		pc.ncr(boardCards, 3, true).forEach(function(ttCards){
			tmpCardsCombination.push(tCards.concat(ttCards))
		})
	})
	return tmpCardsCombination;
}

var combineSevenCards = function(boardCards, playerCards){
	var tmpCardsCombination = [];
	playerCards.forEach(function(tCards){
		tmpCardsCombination.push(boardCards.concat(tCards));
	});
	return tmpCardsCombination;
}

var createCombination = function(params){
	for(var pCard of params.playerCards){
		var playerTwoCardsComb = pc.ncr(pCard.cards, 2, true).reduce(function(memo, cards){
			cards.forEach(function(card){
				card.id = "playerCards";
			});
			memo.push(cards);
			return memo;
		},[]);

		pCard.sevenCardsArr = combineSevenCards(params.boardCards, playerTwoCardsComb);
		pCard.fiveCardsArr = combineFiveCards(params.boardCards, playerTwoCardsComb);
	}
}

var prepareHighHandInSeveCards = function(playerCards, playerId){
	var handsArray = [];
	for(var cards of playerCards){
		var tmpParams = { set: cards };
		handGenerator.prepareHighHand(tmpParams);
		handsArray.push(tmpParams.hand);
	}

	var tmpCards = [];
	for(var hand of handsArray){
		var originalPlayerCards = _.where(hand.cards, { id:"playerCards" });
		if(originalPlayerCards.length == 2){
			tmpCards.push({ hand:hand, playerId:playerId });
		}
	}

	return tmpCards;
}

var prepareHighHandInFiveCards = function(fiveCardsArr, playerId){
	var params = { handsArray:[] };
	for(var cards of fiveCardsArr){
		var hand 	= { handInfo: prepareType(cards), cards: cards };
		hand.cards  = utilsLib.arrangeCards(hand);
		params.handsArray.push({ hand:hand, playerId:playerId });
	}

	helper.groupCardsWithEqualRank(params);
	// console.log(JSON.stringify(params.groupedCards['9']));
	helper.getHighestCards(params);
	helper.findHighestHand(params, params.highestCards, 0);
	return params.winner;
}

var prepareHighHandOmaha = function(params){
	var highInSevenCards;
	var highInFiveCards = [];
	createCombination(params);
	// for(var pCard of params.playerCards){
	// 	highInSevenCards = prepareHighHandInSeveCards(pCard.sevenCardsArr, pCard.playerId);
	// }
	// if(highInSevenCards.length >= 1){
	// 	helper.findHighestHand(params, highInSevenCards, 0);
	// 	return params.winner;
	// }else{
	// 	for(var pCard of params.playerCards){
	// 		highInFiveCards = highInFiveCards.concat(prepareHighHandInFiveCards(pCard.fiveCardsArr, pCard.playerId));
	// 	}
	// 	helper.findHighestHand(params, highInFiveCards, 0);
	// 	return params.winner;
	// }
	for(var pCard of params.playerCards){
		delete pCard['sevenCardsArr'];
		highInFiveCards = highInFiveCards.concat(prepareHighHandInFiveCards(pCard.fiveCardsArr, pCard.playerId));
		delete pCard.fiveCardsArr;
	}
	// console.log(JSON.stringify(highInFiveCards));
	params.handsArray = highInFiveCards;
	helper.groupCardsWithEqualRank(params);
	helper.getHighestCards(params);
	helper.findHighestHand(params, params.highestCards, 0);
	return params.winner;
}

// console.log(prepareHighHandOmaha(params)[0].hand);

module.exports = prepareHighHandOmaha;
/*
* @Author: noor
* @Date:   2017-05-22 15:59:22
* @Last Modified by:   noor
* @Last Modified time: 2017-05-30 11:57:42
*/

var handObject 			= require('./handGenerator.js');
var nameAndPriority		= require('./nameAndPriority');
var helper 	   			= require('../utils/helper');
var handType   			= require('./numToType');
var _ 	 				= require('underscore');
var utilsLib 			= require('../utils/lib');

function getCards(params){
	params.hand = {};
	params.hand.handInfo = handType(params.isSameSuit, params.isRoyalFlushInSS, params.isInSeqInSS, params.isInSeq, params.nameString);
	params.hand.cards    = handObject.cardsFromHandType[params.hand.handInfo.type.toLowerCase()](params.resultObj, params.nameString, params.sameSuitCards);
}

function checkSameSuit(params){
	var suit = params.suit;
	params.isSameSuit = false;
	params.sameSuitCards = [];
	for(var type in suit){
		if(helper.uniqObj(suit[type]).length >= 5){
			params.isSameSuit = true;
			params.sameSuitCards = suit[type];
			break;
		}
	}
}

function checkRFInSameSuit(params){
	var cards = params.sameSuitCards;
	params.isRoyalFlushInSS = helper.checkRF(cards);
	params.isInSeqInSS 		= cards.length >= 5 ? helper.isCardsInSeq(cards) : false;
	params.isInSeqInSS 		= params.isRoyalFlushInSS || params.isInSeqInSS;
}

function checkDiffCardsInSeq(params, next){
	params.isInSeq = params.isInSeq || helper.isCardsInSeq(params.set) ? true : false;
}

function assignNameAndPriority(params){
	if(typeof params.set[0] == "object"){
		for(var card of params.set){
			card.name 	  = nameAndPriority.getName(card.rank);
			card.priority = nameAndPriority.getPriority(card.rank);
		}
	}else{
		params.set = utilsLib.createCards(params.set);
	}
}

var buildTypeString = function(params){
	var suit = {};
	var result = { };
	var RF = { "A":true, "K":true, "Q":true, "J":true, "10":true };		//checks for royal flush cards
	var rf = 0;	//count for royal flush cards
	// console.log(suit);
	params.nameStr    = '';
	for(var card of params.set){
		if(result[card.name] == undefined){
			result[card.name] = {count:1, cards:[card]}
		}else{
			result[card.name].count++;
			result[card.name].cards.push(card);
		}

		//checks suit
		if(suit[card.type]){
			suit[card.type].push(card);
		}else{
			suit[card.type] = [ card ];
		}
		//checks royal flush cards
		if(RF[card.name]){
			delete RF[card.name];
			rf++;
		}
		params.nameStr = params.nameStr+card.name;
	}

	params.suit = suit;
	params.resultObj = result;
	//prepare nameString
	params.nameString = '';
	for(var name in result){
		params.nameString = params.nameString+result[name].count;
	}
	//if royal flush cards present then cards are in sequence
	if(rf == 5 ){
		params.isInSeq = true;
	}
}

var prepareHighHand = function(params){
	params.set = _.sortBy(params.set, "rank");
	assignNameAndPriority(params);
	buildTypeString(params);
	checkSameSuit(params);
	checkRFInSameSuit(params);
	checkDiffCardsInSeq(params);
	getCards(params);
	delete params.set;
	delete params.isSameSuit;
	delete params.isInSeqInSS;
	delete params.sameSuitCards;
	delete params.isInSeq;
	delete params.nameString;
	delete params.resultObj;
	delete params.suit;
	delete params.nameStr;
	delete params.isRoyalFlushInSS;
}

module.exports = { prepareHighHand:prepareHighHand };
/*
* @Author: noor
* @Date:   2017-05-30 11:25:07
* @Last Modified by:   noor
* @Last Modified time: 2017-06-01 13:47:21
*/

var nameAndPriority = require('../lib/nameAndPriority');
var helper 			= require('./helper');

var cardType = {
	"S":"Spade",	"H":"Heart",	"D":"Diamond",	"C":"Club"
};

var compactCards = function(hands){
	for(var phand of hands){
		var arr = [];
		for(var card of phand.hand.cards){
			arr.push(card.name+card.type.charAt(0).toUpperCase());
		}
		phand.hand.cards = arr;
	}
	return hands;
}

var createCards = function(cardsStringArr){
	var cards = [];
	for(var cardStr of cardsStringArr){
		var card 		= {};
		if(cardStr.length == 2){
			card.type 		= cardType[cardStr.charAt(1).toUpperCase()];
			card.rank 		= parseInt(nameAndPriority.getRank(cardStr.charAt(0).toUpperCase()))
			card.name 		= nameAndPriority.getName(card.rank);
			card.priority 	= nameAndPriority.getPriority(card.rank);
			cards.push(card);
		}else{
			card.type 		= cardType[cardStr.charAt(2).toUpperCase()];
			var tmpRank 	= parseInt(cardStr.replace(cardStr.charAt(2),''));
			card.rank 		= nameAndPriority.getRank(tmpRank);
			card.name 		= nameAndPriority.getName(card.rank);
			card.priority 	= nameAndPriority.getPriority(card.rank);
			cards.push(card);
		}
	}
	return cards;
}

var typeToCardsArrangement = {
	"high card":function(cards){
		return helper.getNHighest(cards, 5, "priority");
	},
	"one pair":function(cards){
		var groupedCards 	= helper.groupCardsByName(cards);
		var cardsWithCount  = helper.getCardsWithEqualCount(groupedCards);
		return cardsWithCount['2'].concat(helper.getNHighest(cardsWithCount['1'], 4, "priority"));
	},
	"two pair":function(cards){
		var groupedCards 	= helper.groupCardsByName(cards);
		var cardsWithCount  = helper.getCardsWithEqualCount(groupedCards);
		return helper.getNHighest(cardsWithCount['2'], 4, "priority").concat(cardsWithCount['1']);
	},
	"three of a kind":function(cards){
		var groupedCards 	= helper.groupCardsByName(cards);
		var cardsWithCount  = helper.getCardsWithEqualCount(groupedCards);
		return cardsWithCount['3'].concat(helper.getNHighest(cardsWithCount['1'], 2, "priority"));
	},
	"straight":function(cards){
		return	helper.checkRF(cards) ? helper.getNHighest(cards, 5, "priority") : helper.getNHighest(cards, 5, "rank");
	},
	"flush":function(cards){
		return helper.getNHighest(cards, 5, "priority");
	},
	"royal flush":function(cards){
		return helper.getNHighest(cards, 5, "priority");
	},
	"straight flush":function(cards){
		return helper.getNHighest(cards, 5, "rank");
	},
	"full house":function(cards){
		var groupedCards 	= helper.groupCardsByName(cards);
		var cardsWithCount  = helper.getCardsWithEqualCount(groupedCards);
		return cardsWithCount['3'].concat(cardsWithCount['2']);
	},
	"four of a kind":function(cards){
		var groupedCards 	= helper.groupCardsByName(cards);
		var cardsWithCount  = helper.getCardsWithEqualCount(groupedCards);
		return cardsWithCount['4'].concat(cardsWithCount['1']);
	}
}

var arrangeCards = function(playerHand){
	// console.log(playerHand.handInfo.type.toLowerCase());
	return typeToCardsArrangement[playerHand.handInfo.type.toLowerCase()](playerHand.cards);
}

module.exports = {
	createCards		:createCards,
	compactCards	:compactCards,
	arrangeCards	:arrangeCards
}
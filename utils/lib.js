/*
* @Author: noor
* @Date:   2017-05-30 11:25:07
* @Last Modified by:   noor
* @Last Modified time: 2017-05-30 12:41:41
*/

var nameAndPriority = require('../lib/nameAndPriority');

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

module.exports = {
	createCards		:createCards,
	compactCards	:compactCards
}
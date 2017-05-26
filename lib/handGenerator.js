/*
* @Author: noor
* @Date:   2017-05-22 11:02:51
* @Last Modified by:   noor
* @Last Modified time: 2017-05-26 19:43:27
*/

var _ 		  = require('underscore');
var helper 	  = require('../utils/helper');

var cardsFromHandType = {
	"high card":function(resultObj,nameString){
		var cardArr = helper.putCardsInSet(resultObj);
		return helper.getNHighest(cardArr, 5, "priority");
	},
	"one pair": function(resultObj, nameString){
		var set = [];
		var cards = helper.getCardsWithEqualCount(resultObj);
		set = set.concat(cards['2']);
		return set.concat(helper.getNHighest(cards['1'], 3, "priority"));
	},
	"two pair":function(resultObj, nameString){
		var set = [];
		var freq = helper.getFrequency(nameString);
		var cards = helper.getCardsWithEqualCount(resultObj);

		if(freq['2'] == 2 && freq['1'] == 3){
			set = set.concat(helper.getNHighest(cards['2'], 4, "priority"));
			set = set.concat(_.max(cards['1'], function(o){ return o.priority }));
			return set;
		}
		if(freq['2'] == 3 && freq['1'] == 1){
			var tcards = helper.getNHighest(cards['2'], 4, "priority");
			set = set.concat(tcards);
			var tmpMin = cards['1'].concat(_.min(cards['2'], function(o){ return o.priority }));
			set = set.concat(_.max(tmpMin, function(o){ return o.priority }));
			return set;
		}
	},
	"three of a kind":function(resultObj, nameString){
		var set = [];
		var cards = helper.getCardsWithEqualCount(resultObj);

		set = set.concat(cards['3']);
		return set.concat(helper.getNHighest(cards['1'], 2, "priority"));
	},
	"full house":function(resultObj, nameString){
		var freq = helper.getFrequency(nameString);
		var cards = helper.getCardsWithEqualCount(resultObj);

		var set = [];
		if(freq['3'] == 1 && freq['2'] == 1){
			set = set.concat(cards['3']);
			set = set.concat(cards['2'])
			return set;
		}
		if(freq['3'] == 1 && freq['2'] == 2){
			set = set.concat(cards['3']);
			set = set.concat(helper.getNHighest(cards['2'], 2, "priority"));
			return set;
		}
		if(freq['3'] == 2 && freq['1'] == 1){
			set 		= helper.getNHighest(cards['3'], 3, "priority");
			var minCard = _.min(cards['3'], function(o){ return o.priority });
			var count 	= 0;
			for(var obj of cards['3']){
				if(obj.priority == minCard.priority && count < 2){
					set.push(obj);
					count++;
				}
			}
			return set;
		}
	},
	"four of a kind":function(resultObj, nameString){
		var cards = helper.getCardsWithEqualCount(resultObj);

		var set   = [];
		set = set.concat(cards['4']);
		var tmpCards = [];
		for(var key in cards){
			if(key != '4')
				tmpCards = tmpCards.concat(cards[key]);
		}
		set = set.concat(_.max(tmpCards, function(o){ return o.priority }));
		return set;
	},
	"straight flush":function(resultObj, nameString, sameSuitCards){
		var uniqCards = helper.uniqObj(sameSuitCards);
		return helper.getNHighestCardsInSeq(5, uniqCards, "rank").reverse();
	},
	"straight":function(resultObj, nameString){
		var tmpSet = [];
		for(var key in resultObj){
			tmpSet = tmpSet.concat(resultObj[key].cards)
		}

		var uniqCards = helper.uniqObj(tmpSet);
		return helper.checkRF(uniqCards) ? helper.getNHighestCardsInSeq(5, uniqCards, "priority").reverse() : helper.getNHighestCardsInSeq(5, uniqCards, "rank").reverse();
	},
	"flush":function(resultObj, nameString, sameSuitCards){
		return helper.getNHighest(sameSuitCards, 5, "priority");
	},
	"royal flush":function(resultObj, nameString, sameSuitCards){
		var uniqCards = helper.uniqObj(sameSuitCards);
		return helper.getNHighestCardsInSeq(5, uniqCards, "priority").reverse();
	}
}

module.exports  = { cardsFromHandType:cardsFromHandType };
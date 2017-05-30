/*
* @Author: noor
* @Date:   2017-05-30 15:41:07
* @Last Modified by:   noor
* @Last Modified time: 2017-05-30 16:25:54
*/

var _ 				= require('underscore');
var nameAndPriority = require('../lib/nameAndPriority');
var utilsLib 		= require('./lib');

function assignNameAndPriority(set){
	if(typeof set[0] == "object"){
		for(var card of set){
			card.name 	  = nameAndPriority.getName(card.rank);
			card.priority = nameAndPriority.getPriority(card.rank);
		}
	}else{
		set = utilsLib.createCards(set);
	}
	return set;
}

var getTypeInfo = function(val, isInSeq, isSameSuit){
	switch(val){
		case 11111:
			if(isInSeq && isSameSuit){
			  return { type: "Straight Flush", strength: 5};
			} if(/*!isInSeq &&*/ isSameSuit){
			  return { type: "Flush", strength:6 };
			} if(isInSeq /*&& !isSameSuit*/){
			  return { type: "Straight", strength: 9 };
			} /*if(!isInSeq && !isSameSuit)*/{
			  return { type:"High Card", strength: 1};
			}
			break;
		case 41:
		case 14:
			return { type:"Four of a Kind", strength: 8};
			break;
		case 32:
		case 23:
			return { type:"Full House", strength: 7};
			break;
		case 113:
		case 131:
		case 311:
			return { type:"Three of a Kind", strength: 4 };
			break;
		case 221:
		case 212:
		case 122:
			return { type:"Two Pair", strength: 3};
			break;
		case 2111:
		case 1211:
		case 1121:
		case 1112:
			return { type: "One Pair", strength: 2};
			break;
	}
}

var assignType = function(set){
	var result = {};
	var isInSeq = true;
	var isSameSuit   = true;
	var RF = { "A":true, "K":true, "Q":true, "J":true, "10":true };		//checks for royal flush
	var rf = 0;	//count for royal flush cards
	var seq = set[0].rank+1;	//check for sequence
	var suit  		 = set[0].type;	//checks for suit
	// console.log(suit);
	for(var name of set){
		if(result[name.name] == undefined){
			result[name.name] = 1;
		}else{
			result[name.name]++;
		}

		if(name.type != suit){
			isSameSuit = false;
		}

		if(RF[name.name]){
			delete RF[name.name];
			rf++;
		}

		if(seq == (name.rank+1)){
			seq++;
		}else{
			isInSeq = false;
		}
	}
	var nameString = '';
	for(var name in result){
		nameString = nameString+result[name];
	}

	// console.log(nameString);
	console.log(nameString, rf, isInSeq, isSameSuit);
	if(rf == 5 && isSameSuit){
		return { type: "Royal Flush", strength: 10 };
	}else{
		if(rf == 5){
			isInSeq = true;
		}
		return getTypeInfo(parseInt(nameString, 10),isInSeq, isSameSuit);
	}

}

var prepareType = function(set){
	if(set.length < 5){
		return [];
	}
	set = assignNameAndPriority(set);
	set = _.sortBy(set, "rank");
	return assignType(set);
}

module.exports = prepareType;
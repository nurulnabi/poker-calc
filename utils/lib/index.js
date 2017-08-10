
// * @Author: noor
// * @Date:   2017-08-03 15:04:17
// * @Last Modified by:   noor
// * @Last Modified time: 2017-08-10 15:44:55


'use strict';
var handNames = require('../name.json');
var utils_lib = require('../lib.js');
var _ 		  = require('underscore');
var helper    = require('../helper');

var hand = {
	ss:{
		seq:["10","9"],
		diff:["6"]
	},
	ds:{
		seq:["5"],
		diff:["1","2","3","4","7","8"]
	}
}

var handRules = ["11111","2111","221","311","11111","11111","32","41","11111","11111"];
var getMatching = function getMatching(arr, iterator){
	var tmpArr = [];
	for(var idx in arr)
		iterator(arr[idx], idx) && tmpArr.push(arr[idx]);
	return tmpArr;
};

var getHandStrength = function getHandStrength(arr, iterator){
	var tmpArr = [];
	for(var idx in arr){
		iterator(arr[idx], idx) && tmpArr.push(idx);
	}
	return tmpArr;
};



var handRules = {
	"1":"11111",
	"2":"2111",
	"3":"221",
	"4":"311",
	"5":"11111",
	"6":"11111",
	"7":"32",
	"8":"41",
	"9":"11111",
	"10":"11111"
};

var playerNextHighest = {
	"1":["2", "5"],
	"2":["3", "4"],
	"3":["7"],
	"4":["7", "8"],
	"5":[],
	"6":["9", "10"],
	"7":["8"],
	"8":[],
	"9":["10"],
	"10":[]
};

var numToTypeStr = {
	"2": ["2111", "21111", "211111"],
	"3":["221", "2211", "22111"],
	"4":["311", "3111", "31111"],
	"7":["32", "321", "33", "331", "3211"],
	"8":["41", "42", "43", "421", "4111", "411"],
	"1":["11111", "111111", "111111"]
};

var totalRemainingCards = {
	"flop": 2,
	"turn": 1,
	"river": 0
};

var communityCards = {
	"111": ["1","2","3", "4", "5", "6", "9", "10"],
	"21":["2", "3", "4", "7"],
	"3":["4", "7", "8"]
}

var getNumFromTypeStr = function(str){
	for(var key in numToTypeStr){
		if( numToTypeStr[key].includes(str) ){
			return key;
		}
	}
}


var buildTypeString = function(cardsArr){
	var cardsObj = {};
	for(var card of cardsArr){
		if( cardsObj[card.name] ){
			cardsObj[card.name].push(card);
		}else{
			cardsObj[card.name] = [];
			cardsObj[card.name].push(card);
		}
	}
	
	var typeStr = [];
	for(var key in cardsObj){
		typeStr.push(parseInt(cardsObj[key].length));
	}

	return typeStr.sort().reverse().join("");
};

var checkSuitOfCards = function checkSuitOfCards(cards, suits){
	var suits = suits || {};
	for(var card of cards){
		if(suits[card.type]){
			suits[card.type].push(card);
		}else{
			suits[card.type] = [];
			suits[card.type].push(card);
		}
	}
	
	var isInSS = false;
	for(var key in suits){
		if( suits[key].length >= 5 ){
			isInSS = true;
			break;
		}
	}

	return { suits, isInSS };
}

var checkPossibleStraight = function checkPossibleStraight(cards, roundName){
	var cardsWithR = cards.map((card)=> parseInt(card.rank, 10));
	var cardsWithP = cards.map((card)=> parseInt(card.priority, 10));
	
	var rangeWithR = _.range(_.min(cardsWithR), _.max(cardsWithR), 1);
	var rangeWithP = _.range(_.min(cardsWithP), _.max(cardsWithP), 1);
	
}

// it iterates over the arr and returns part of arr of length 5
var customIterator = {};
customIterator[Symbol.iterator] = function* (){
	var arr = this.arr;
	var len = arr.length;
	for(var i=0; i<len; i++){
		if( len-i < 5)
			return [];
		else
			yield arr.slice(i, i+5, 1);
	}
}

var getStraight = function getStraight(arr, stBy, nextTotalCards){
	var originalVal = arr.map((card)=> parseInt(card[stBy],10));
	var min   = _.min(originalVal);
	var	max   = _.max(originalVal);
	var	range = _.range(min, max+1, 1);
	var	start = 1;
	var end   = 15;
	var	result = [];

	//for lower limit
	if( min-nextTotalCards > 0){
		start = (min-nextTotalCards);
	}
	range = _.range( start, min, 1).concat(range);

	if( )
	range = range.reduce( (memo, val)=>{ if(memo.indexOf(val) == -1) memo.push(val); return memo; }, [] );//returns uniq elements

	customIterator.arr = range;
	for(var partArr of customIterator){
		var diff = _.difference(partArr, originalVal);
		console.log(partArr, originalVal, diff);
		if( diff.length <= nextTotalCards ){
			result = result.concat(diff)
			// result.push(diff);
			// result.push(diff.toString()+",");
		}
	}
	return result;
}

var params2 = {
    "boardCards": [                         // ["14H", "2H", "JH", "10H", "KH"]
        // "AH", "2H", "4H",
        "9S", "10H", "JC"
        // "10s", "7s", "8d"
        // "4h", "9c", "qs"
    ],
    "playerCards": [{ "playerId": "1", "cards": ["jS", "8C" /*"4c", "5d" "7s", "ad"*/] },
        { "playerId": "2", "cards": ["6H", "5C"] }
    ]
}
var pRes = getStraight(utils_lib.createCards(params2.boardCards.concat(params2.playerCards[0].cards)), "rank", 2 );
console.log(pRes);
console.log("============================================");
var cRes = getStraight(utils_lib.createCards(params2.boardCards), "rank", 2 );
console.log(cRes);
console.log();		
console.log(_.difference(pRes, cRes));

var removeOpenEndedCases = function(playerResult, communityResult){
	for(var commRes of communityResult){
		for(var playerRes of playerResult){
			// if()
		}
	}
}
// var allDifferent = ["11111", "111111", "1111111", "21111","211111","22111", "31111"];

// var getPossibleHighestHand = function(params) {
//     params.typeStr = buildTypeString(params.cardsArr);
//     params.suits = Object.assign({}, checkSuitOfCards(params.cardsArr));

// 	console.log(params.typeStr);
// 	if (allDifferent.includes(params.typeStr)) {
// 		params.suits.isCardsInSeq = helper.isCardsInSeq(params.cardsArr);
// 	    if( params.suits.isCardsInSeq ){
// 	    	params.suits.isCardsInSeq && (params.suits.isRF = helper.checkRF(params.cardsArr));
// 	    	if( params.suits.isInSS ){
// 	    		if( params.suits.isRF )
// 	    			return "10";
// 	    		else
// 	    			return "9";
// 	    	}else{
// 	    		return "5";
// 	    	}
// 	    }else{
// 	    	if( params.suits.isInSS ){
// 	    		return "6";
// 	    	}else{
// 	    		return getNumFromTypeStr(params.typeStr);
// 	    	}
// 	    }
// 	}else{
// 		return getNumFromTypeStr(params.typeStr);
// 	}
// };

// var createRange = function(start, end, incr){
// 	var arr = [];
// 	for( ; start<=end; start+=incr)
// 		arr.push(start.toString());
// 	return arr;
// };

// var cCards = params2.boardCards;
// var pCards = params2.playerCards[0].cards;
// var params = Object.create({ cardsArr: utils_lib.createCards(cCards.concat(pCards)) });
// var hNum = getPossibleHighestHand(params);
// var checkStraight = ["1", "6"];
// if( checkStraight.includes(hNum) ){
// 	var cardsValWithR = _.pluck(params.cardsArr, "rank");
// 	var cardsValWithP = _.pluck(params.cardsArr, "priority");
// 	console.log(cardsValWithP);
// }

// console.log(handNames[hNum], playerNextHighest[hNum]);



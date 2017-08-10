
// * @Author: noor
// * @Date:   2017-08-03 15:04:17
// * @Last Modified by:   noor
// * @Last Modified time: 2017-08-10 18:19:44


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

var getRange = function( {arr, isCommunityCards, rightEnded, nextTotalCards} ){
	var min   = _.min(arr);
	var	max   = _.max(arr);
	var	range = _.range(min, max+1, 1);
	var	start = 1;
	var end   = 15;

	if( !rightEnded ){ 
		//for lower limit
		if( min-nextTotalCards > 0){
			start = (min-nextTotalCards);
		}
		range = _.range( start, min, 1).concat(range);

		//for upper limit
		if( (max+nextTotalCards) < 14 ){
			end   = max+nextTotalCards+1;
		}
		range = range.concat(_.range( max, end, 1));
	}else if( isCommunityCards ){
		//for upper limit
		if( (max+nextTotalCards) < 14 ){
			end   = max+nextTotalCards+1;
		}
		range = range.concat(_.range( max, end, 1));
	}
	return range;
}

var getStraight = function getStraight(arr, stBy, nextTotalCards, isCommunityCards, rightEnded){
	var result = [];
	var tArr  = arr.map( (card) => parseInt(card[stBy], 10));
	var range = getRange({ arr:tArr, nextTotalCards, isCommunityCards, rightEnded });

	range = range.reduce( (memo, val)=>{ if(memo.indexOf(val) == -1) memo.push(val); return memo; }, [] );//returns uniq elements

	customIterator.arr = range;
	for(var partArr of customIterator){
		var diff = _.difference(partArr, tArr);
		// console.log(partArr, tArr, diff);
		if( diff.length <= nextTotalCards && diff.length >= 1){
			if( !isCommunityCards )
				result.push({ requiredCard:diff[0], sequence: partArr })
			else
				result = _.union(result, diff)
		}
	}
	return result;
}

var params2 = {
    "boardCards": [                         // ["14H", "2H", "JH", "10H", "KH"]
        // "AH", "2H", "4H",
        // "9S", "10H", "JC"
        // "10s", "7s", "8d"
        // "4h", "9c", "qs"
        // "2s", "4d", "6c"
        // "2s", "4d", "5c"
        "As", "3d", "4c"
    ],
    "playerCards": [{ "playerId": "1", "cards": ["jS", "8C" /*"4c", "5d"  "6s", "8d"*/] },
        { "playerId": "2", "cards": ["9H", "7C"] }
    ]
}

var findAllPossibleHighestHand = function({ boardCards, playerCards, nextTotalCards, stBy }){
	var pRes = getStraight(utils_lib.createCards(boardCards.concat(playerCards)), stBy, nextTotalCards );
	var handToDel = [];
	for(var idx in pRes){
		var pSeq = pRes[idx];
		var c = getStraight(utils_lib.createCards(boardCards.concat(pSeq.requiredCard+"s")), stBy, nextTotalCards, true, true )[0];
		if( _.max(pSeq.sequence) < c ){	//if, possibly, someone is holding 'c' you will lose this hand hence excludes the currnet hand
			handToDel = _.union(handToDel, [idx]);
		}
	}
	if( handToDel.length !== pRes.length ){ //this is the risky position to be in, you may loose on this hand
		for(var idx of handToDel){
			pRes.splice(idx, 1);
		}
	}
	
	//get the highest among all, as we are interested in a single card at a time
	var res = _.max(pRes, (pr)=> pr.requiredCard);
	return res == -Infinity ? undefined : res;
}

// console.log();		
console.log(findAllPossibleHighestHand({ playerCards: params2.playerCards[1].cards, boardCards: params2.boardCards, stBy:"rank", nextTotalCards:1}));
console.log(findAllPossibleHighestHand({ playerCards: params2.playerCards[1].cards, boardCards: params2.boardCards, stBy:"priority", nextTotalCards:1}));
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



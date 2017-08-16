
// * @Author: noor
// * @Date:   2017-08-03 15:04:17
// * @Last Modified by:   noor
// * @Last Modified time: 2017-08-16 10:37:35


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

var buildStateObject = function(cardsArr, cardsState){
	var cardsState = cardsState || { suits:{}, all:{} };
	for(var card of cardsArr){
		if( cardsState.all[card.name] ){
			cardsState.all[card.name].push(card);
		}else{
			cardsState.all[card.name] = [];
			cardsState.all[card.name].push(card);
		}

		if( cardsState.suits[card.type] ){
			cardsState.suits[card.type].push(card);
		}else{
			cardsState.suits[card.type] = [];
			cardsState.suits[card.type].push(card);
		}
	}
	return cardsState;
}

var buildTypeString = function(cardsState){
	var typeStr = [];
	for(var key in cardsState.all){
		typeStr.push(parseInt(cardsState.all[key].length));
	}

	return typeStr.sort().reverse().join("");
};

var checkForSS = function checkForSS(cardsState){
	var isInSS = false;
	var suits = cardsState.suits;
	for(var key in suits){
		if( suits[key].length >= 5 ){
			isInSS = true;
			break;
		}
	}

	return isInSS;
}

var checkForFlush = function checkForFlush( cardsState, nextTotalCards ){
	for( var key in cardsState.suits ){
		if( (5 - cardsState.suits[key].length) <= nextTotalCards )
			return cardsState.suits[key];
	}
	return undefined;
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

	if( !rightEnded && nextTotalCards > 0){ 
		//for lower limit
		if( min-nextTotalCards > 0){
			start = (min-nextTotalCards);
		}
		range = _.range( start, min, 1).concat(range);

		//for upper limit
		if( (max+nextTotalCards) < 14 ){
			end   = max+nextTotalCards+1;
		}
		range = range.concat(_.range( max+1, end, 1));
	}else if( isCommunityCards && nextTotalCards > 0 ){
		//for upper limit
		if( (max+nextTotalCards) < 14 ){
			end   = max+nextTotalCards+1;
		}
		range = range.concat(_.range( max+1, end, 1));
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


var findAllPossibleHighestHand = function({ boardCards, playerCards, nextTotalCards, stBy }){
	var pRes = getStraight(boardCards.concat(playerCards), stBy, nextTotalCards );
	var handToDel = [];
	for(var idx in pRes){
		var pSeq = pRes[idx];
		var c = getStraight(boardCards.concat(utils_lib.createCards([pSeq.requiredCard+"s"])), stBy, nextTotalCards, true, true )[0];
		if( _.max(pSeq.sequence) < c ){	//if, possibly, someone is holding 'c' you will lose this hand hence excludes the currnet hand
			handToDel = _.union(handToDel, [idx]);
		}
	}
	if( handToDel.length !== pRes.length ){ //this is the risky position to be in, you may loose on this hand
		for(var idx of handToDel){
			pRes.splice(idx, 1);
		}
	}
	
	console.log(pRes,"==========");
	var finalRes = [];
	if( pRes.length >= 1 ){
		var tempRes = _.where(pRes, { requiredCard: _.max(pRes, (pr)=> pr.requiredCard).requiredCard }); //if more than two combination happens for same card then choose the greatest one
		var res = _.max(tempRes, (pr)=> pr.sequence[4]);
		finalRes = _.difference(pRes, tempRes).concat(res);
	}

	return finalRes;
}

var cardsNeededForFlush = function(cardsArr){ 
	var cardVal = _.pluck( cardsArr, "priority" );
	if(cardVal.includes(14)){
		var range   = _.range(2,15,1);
	}else{
		var range   = _.range(1,14,1);
	}
	return _.difference(range, cardVal);
}

var mergeCards = function mergeCards(cards1, cards2){
	var arr = [];
	for(var card of cards1){
		if( !cards2.find( (val)=>{ return card.requiredCard == val.requiredCard }) )
			arr.push( card );
	}
	arr = arr.concat(cards2);
	return arr;
}

// console.log();		
// console.log(findAllPossibleHighestHand({ playerCards: params2.playerCards[1].cards, boardCards: params2.boardCards, stBy:"priority", nextTotalCards:1}));
var allDifferent = ["11111", "111111", "1111111", "21111","211111","22111", "31111"];

var getPossibleHighestHand = function(params) {
	params.outs 	  = 0;
	params.outsHandType   = [];
	params.cardsState = buildStateObject(params.cardsArr);
    params.typeStr    = buildTypeString(params.cardsState);
	params.sameSuit   = checkForFlush(params.cardsState, 1);
	params.seqWR	  = findAllPossibleHighestHand({ boardCards: params.boardCards, playerCards: params.playerCards, stBy:"rank", nextTotalCards:1 });
	params.seqWP	  = findAllPossibleHighestHand({ boardCards: params.boardCards, playerCards: params.playerCards, stBy:"priority", nextTotalCards:1 });
	params.seq 		  = mergeCards(params.seqWR, params.seqWP);
	params.seqVal 	  = _.pluck(params.seq, "requiredCard");

	if( params.sameSuit ){
		params.outsHandType.push("Flush");
		params.cardsNeededForFlush = cardsNeededForFlush(params.sameSuit);
		params.outs += params.cardsNeededForFlush.length;
	}

	if( params.seq.length > 0 ){
		params.outsHandType.push("Straight");
		//this is the case when the user has a,k and able to make straight but the other As and Ks will support it
		var overCardAK = params.playerCards.filter( (card)=> { return card.name == "A" || card.name == "K"; } );
		if( overCardAK.length == 2 && !params.sameSuit)
			params.outs += 6;

		if( params.cardsNeededForFlush ){
			params.seqVal.forEach( (val)=>{
				if( params.cardsNeededForFlush.includes(val) ){
					params.outs += 3;
				}else{
					params.outs += 4;
				}
			})
		}else{
			params.outs += params.seqVal.length*4;
		}
		return params.outs
	}else if( !params.sameSuit ){
		switch( params.typeStr ){
			case "11111":
			case "111111":
				var overCardA = params.playerCards.filter( (card)=> { return card.name == "A"; } )
				var overCardK = params.playerCards.filter( (card)=> { return card.name == "K"; } )
				params.outsHandType.push("One Pair");
				if( overCardA.length == 1 && overCardK.length == 0)	//if A present then there is only on true out which is A itself
					params.outs += 3;
				else
					params.outs += 6;
				return params.outs;
				break;
			case "2111":
			case "21111":
				params.outsHandType.push("Two Pair");
				params.outsHandType.push("Three of a Kind");
				// params.tok_takCards = getPairAndSet(params.cardsArr);
				params.outs += 5;
				return params.outs;
			case "221":
			case "2211":
				params.outsHandType.push("Full House");
				params.outs += 4;
				//get cards
				return params.outs;
			case "311":
			case "3111":
				params.outsHandType.push("Full House");
				params.outsHandType.push("Four of a Kind");
				params.outs += 7;
				return params.outs;
			case "32":
			case "321":
				params.outsHandType.push("Four of a Kind");
				params.outs += 1;
				return params.outs;
			case "41":
			case "411":
				params.outsHandType.push("Four of a Kind");
				params.outs += 0;
				return params.outs;
			default:
				return -1;
		}
	}else{
		return params.outs;
	}

};

// var createRange = function(start, end, incr){
// 	var arr = [];
// 	for( ; start<=end; start+=incr)
// 		arr.push(start.toString());
// 	return arr;
// };

var params2 = {
    "boardCards": [                         // ["14H", "2H", "JH", "10H", "KH"]
        // "AH", "2H", "4H",
        // "9S", "10H", "JC"
        // "10s", "7s", "8d"
        // "4h", "9c", "qs"
        // "2s", "4d", "6c"
        // "2s", "4d", "5c"
        // "As", "qs", "10s"
        // "as", "9s", "5s"
        // "3d", "2h", "8h"
        // "5s", "as", "jd"
        // "qs", "jc", "6d"
        // "9s", "10h", "jc"
       	// "7h", "10d", "5s"
       	"3c", "8d", "jh"
    ],
    "playerCards": [{ "playerId": "1", "cards": ["9h", "10c" /*"4c", "5d"  "6s", "8d"*/] },
        { "playerId": "2", "cards": ["9H", "7C"] }
    ]
}
var cCards = params2.boardCards;
var pCards = params2.playerCards[0].cards;
var params = Object.create({ cardsArr: utils_lib.createCards(cCards.concat(pCards)) });
params.playerCards = utils_lib.createCards(pCards).map( (card)=>{ card.isPlayerCard = true;  return card; } );
params.boardCards = utils_lib.createCards(cCards);
getPossibleHighestHand(params);

console.log(params.outsHandType);
console.log(params.outs);
console.log(params.outs/47);

// var hNum = getPossibleHighestHand(params);
// var checkStraight = ["1", "6"];
// if( checkStraight.includes(hNum) ){
// 	var cardsValWithR = _.pluck(params.cardsArr, "rank");
// 	var cardsValWithP = _.pluck(params.cardsArr, "priority");
// 	console.log(cardsValWithP);
// }

// console.log(handNames[hNum], playerNextHighest[hNum]);


// console.log(findAllPossibleHighestHand({ playerCards: utils_lib.createCards(params2.playerCards[0].cards), boardCards: utils_lib.createCards(params2.boardCards), stBy:"rank", nextTotalCards:1}));

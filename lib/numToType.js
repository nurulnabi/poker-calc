/*
* @Author: noor
* @Date:   2017-05-22 10:29:26
* @Last Modified by:   noor
* @Last Modified time: 2017-05-26 19:37:32
*/

var pc 		  = require('./utils/permutation');

var numToType = {
	"211111":{ type: "One Pair", strength: 2},
	"22111":{ type:"Two Pair", strength: 3},
	"2221":{ type:"Two Pair", strength: 3},
	"31111":{ type:"Three of a Kind", strength: 4 },
	"3211":{ type:"Full House", strength: 7},
	"322":{ type:"Full House", strength: 7},
	"331":{ type:"Full House", strength: 7},
	"4111":{ type:"Four of a Kind", strength: 8},
	"421":{ type:"Four of a Kind", strength: 8},
	"43":{ type:"Four of a kind", strength: 8},
	"1111111":{ type:"High Card", strength: 1}
}

var typeObj = {};

var addHands = function(arr,string){
	for(var num of arr){
		typeObj[num] = string;
	}
};

var createTypeOb = function(){
	for(var num in numToType){
		addHands(pc.listCombName(num, false), numToType[num]);
	}
}

createTypeOb();

var typeGenerator = function(isSameSuit, isRoyalFlushInSS, isInSeqInSS, isInSeq, nameString){
	if(isSameSuit && isInSeqInSS){
		if(isRoyalFlushInSS){
			return { type: "Royal Flush", strength: 10 };
		}else{
			return { type: "Straight Flush", strength: 9 };
		}
	}else if(isSameSuit){
		return { type: "Flush", strength:6 };
	}else if(isInSeq){
		return { type: "Straight", strength: 5};
	}else{
		return typeObj[nameString];
	}
}

module.exports = typeGenerator;
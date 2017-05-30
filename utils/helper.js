/*
* @Author: noor
* @Date:   2017-05-26 09:36:07
* @Last Modified by:   noor
* @Last Modified time: 2017-05-30 15:37:30
*/

var _ = require('underscore');
var helper = {};

helper.getNHighest = function(cards, n, sortBy){	//sorts in decreasing order
	var key, j, status;
	sortBy = sortBy || "priority";
	for (var i = 1; i < cards.length; i++){
	   key = cards[i];
	   j = i-1;
	   while (j >= 0 && cards[j][sortBy] < key[sortBy]){
	       cards[j+1] = cards[j];
	       j = j-1;
	   }
	   cards[j+1] = key;
	}
	return cards.slice(0, n);
}

helper.putCardsInSet = function(cards){
	var set = [];
	for(var num in cards){
		set = set.concat(cards[num].cards);
	}
	return set;
};

helper.getFrequency = function(string) {
    var freq = {};
    for (var i=0; i<string.length;i++) {
        var character = string.charAt(i);
        if (freq[character]) {
           freq[character]++;
        } else {
           freq[character] = 1;
        }
    }

    return freq;
};

helper.uniqObj = function(cards){
	var setObj = {
		names:[],
		cards:[]
	};
	for(var card of cards){
		if(setObj.names.indexOf(card.name) < 0){
			setObj.cards.push(card);
			setObj.names.push(card.name);
		}
	}
	return setObj.cards;
}

helper.checkRF = function(cards){
	var RF = { "A":true, "K":true, "Q":true, "J":true, "10":true };		//checks for royal flush
	var rf = 0;
	for(var card of cards){
		if(RF[card.name]){
			delete RF[card.name];
			rf++;
		}
	}
	return rf == 5 ? true : false;
}

helper.getNHighestCardsInSeq = function(n, cards, sortBy){
	var tester = 0;
	var set    = [];
	var cards  = _.sortBy(cards,sortBy);
	tester     = cards[0][sortBy];
	set.push(cards[0]);

	for(var card of cards){
		if(card[sortBy] == tester+1){
		  tester = card[sortBy];
		  set.push(card);
		}else{
		  if(set.length < n && card[sortBy] != tester){
		    set = [];
		    set.push(card);
		    tester = card[sortBy];
		  }
		}
	};
	var idx    = set.length - n;
	return set.length < n ? [] : set.slice(idx, cards.length) ;
}

helper.getCardsWithEqualCount = function(cards){
	var result = {};
	for(var key in cards){
		if( !!result[cards[key].count])
			result[cards[key].count] = result[cards[key].count].concat(cards[key].cards)
		else
			result[cards[key].count] = cards[key].cards;
	}
	return result;
}

helper.isCardsInSeq = function(cards){
	var seq = 1;
	var tester = cards[0].rank;
	for(var card of cards){
		//checks sequence
		if(card.rank == tester+1){
			seq++;
			tester = card.rank;
		}else{
			if(seq < 5 && card.rank != tester){
				seq = 1;
				tester = card.rank
			}
		}
	}

	return seq >= 5 ? true : false;
}

helper.groupCardsWithEqualRank = function(params){
	groupedCards = {};
	for(var playerHand of params.handsArray){
		if(groupedCards[playerHand.hand.handInfo.strength]){
			groupedCards[playerHand.hand.handInfo.strength].push(playerHand);
		}else{
			groupedCards[playerHand.hand.handInfo.strength] = [ playerHand ];
		}
	}
	params.groupedCards = groupedCards;
};

helper.getHighestCards = function(params){
	var groupedCards   = params.groupedCards;
	var keys 		   = [];
	for(var k in groupedCards){
		keys.push(parseInt(k));
	}
	var key 		   = _.max(keys);
	params.highestCards = groupedCards[key]
	params.maxStrength  = key; 
};

helper.findHighestHand = function(params, arr, idx){
  var tester = -Infinity;
  var status = false;
  var tmpArr = [];
  for(var i = 0; i<arr.length; i++){
  	var checker = arr[i].hand.cards[idx].priority;
    if( checker > tester){
        tmpArr = [];
        tester = arr[i].hand.cards[idx].priority;
        tmpArr.push(arr[i]);

      }else if(checker == tester)
        tmpArr.push(arr[i]);
  }
  idx = idx+1;
  if(idx == 5 || tmpArr.length == 1){
    params.winner = tmpArr;
    return;
  }else
  	this.findHighestHand(params, tmpArr, idx);
}

module.exports = helper;
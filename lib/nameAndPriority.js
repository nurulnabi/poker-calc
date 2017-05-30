/*
* @Author: noor
* @Date:   2017-05-25 13:28:43
* @Last Modified by:   noor
* @Last Modified time: 2017-05-30 12:37:18
*/

module.exports = {
	getName:function(rank){
		switch(rank){
			case 1: return "A";
			case 13: return "K";
			case 12: return "Q";
			case 11: return "J";
			default:
				return rank.toString();
		}
	},
	getPriority:function(rank){
		switch(rank){
			case 1: return 14;
			default:
				return rank;
		}
	},
	getRank:function(name){
		switch(name){
			case "A": return 1;
			case "K": return 13;
			case "Q": return 12;
			case "J": return 11;
			case "14": return 1;
			case 14: return 1;
			default:
				return parseInt(name);
		}
	}
}
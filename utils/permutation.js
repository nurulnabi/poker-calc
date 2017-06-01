/*
* @Author: Sushil Jain
* @Date:   2017-02-27 18:38:23
* @Last Modified by:   noor
* @Last Modified time: 2017-05-31 15:09:36
*/

module.exports.findRankByString = function (input) {
	var mexp = this;
	input = input.toLowerCase();
	if (input.length<=1) {
		return 1;
	};

	var charsName = [];
	charsName = Array.from(input);
	
	var sortedChars = [];

	sortedChars = Array.from(input).sort();

	var output = findPartialByCharsSorted(charsName, sortedChars);
	return output+1;

	function findPartialByCharsSorted (chars, sortedChars, combSumInit) {
		var tChar = chars[0];
		var combSum = combSumInit || 0;
		var len = sortedChars.length;
		if (len<=0) {return combSum};

		for (var j = 0; j < len; j++) {
			var doneChars = [];
			for (var i = 0; i < sortedChars.length; i++) {
				if(tChar == sortedChars[i]) {
					chars.splice(0, 1);
					sortedChars.splice(i, 1);
					// console.log(chars, sortedChars, combSum, doneChars)
					return findPartialByCharsSorted(chars, sortedChars, combSum);
					// break;
				} else if ( doneChars.indexOf(sortedChars[i])<0 ){
					var temp = copyArray(sortedChars);
					temp.splice(i,1);
					combSum += mexp.permuteOver(temp);
					doneChars.push(sortedChars[i]);
				}
			};
		};
	}

}
module.exports.permuteOver = function (chars) {
	var n = chars.length;
	var freq = {};
	var deno = 1;
	if(n<=1) {return 1};
	for (var i = 0; i < chars.length; i++) {
		if (freq[chars[i]]) {
			freq[chars[i]]++;
		} else{
			freq[chars[i]] = 1;
		}
	};
	for(var key in freq) { //reduce, map
		if(freq[key]>1){
			deno *= factorial(freq[key]);
		}
	};
	return factorial(n)/deno;
}
module.exports.comb = function (len, states, rules){
	if(!len || len<1){return []}
	if(len>16){
		return "out of limit, put force if you know better";
	}
	var states = states || ["0","1"];
	var pos = [];
	var powers = [];
	pos = Array(len).fill(0);

	var rule = rules && rules[0];
	var ruleVal = 0;
	for (var i = 0; i < states.length; i++) {
		powers.push(Math.pow(len, i));
		if (!!rule) {
			ruleVal += rule[i]*powers[i];
		} else {
			ruleVal = rule;
		}
	};

	var shouldBreak, str;
	var output = [];
	do{
		shouldBreak = true;
		str = "";var s=0;
		for (var i = 0; i < len; i++) {
			str+= states[pos[i]];
			s+= powers[pos[i]];
		};
		// console.log('output', str);
		(!ruleVal || s==ruleVal) && output.push(str);
		for (var i = len-1; i >= 0; i--) {
			if(pos[i]<states.length-1){
				pos[i]++; break;
			}
			if(pos[i]<states.length){
				if (i==0) {
					shouldBreak = false; break;
				};
				pos[i]=0;
			}
		};
	}while(shouldBreak);
	return output;
}

module.exports.listCombName = function (s, repeatFlag) {
	var mexp = this;
	if (!s||s.length<1) {return mexp.comb(0);};
	s = s.toLowerCase();
	var sortedChars = [];
	sortedChars[0] = s[0];

	var rules = [];
	var freq = rules[0] = [];

	sortedChars = Array.from(s).sort().filter(onlyUnique);

	for (var i = 0; i < sortedChars.length; i++) {
		freq[i] = freqInString(sortedChars[i], s);
	};
	if(repeatFlag){
		return mexp.comb(s.length, sortedChars);
	}
	function freqInString (c, s) {
		var r = 0;
		for (var i = 0; i < s.length; i++) {
			s[i] == c && r++;
		};
		return r;
	}
	// console.log(sortedChars, rules);
	return mexp.comb(s.length, sortedChars, rules);
}

function copyArray (arr) {
	var t = [];
	for (var i = 0; i < arr.length; i++) {
		t.push(arr[i]);
	};
	return t;
}

function factorial(x) {
	if(x==0) {
		return 1;
	}
		return x * factorial(x-1);
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

module.exports.ncr = function (states, len, arrOrStr){
    if(!len || len<1 || len>states.length){console.log('rejected input');return []}
    if(len>16){
        return "out of limit, put force if you know better";
    }
    // var states = states || ["0","1"];
    var pos = [];
    for (var i = 0; i < len; i++) {
        pos[i] = i + states.length - len;
    }

    var shouldBreak, str;
    var output = [];
    do{
        shouldBreak = false;
        str = arrOrStr ? [] : '';
        for (var i = 0; i < len; i++) {
            // console.log('112',pos)
            // if(str.indexOf(states[pos[i]])<0){
                if(arrOrStr){
                	str.push(states[pos[i]]);
                }else{
                	str += (states[pos[i]]);
                }
            // }
            // pos[i]++;
        };
        output.push(str);
        for (var i = 0; i < len; i++) {
            // console.log('113',pos)
            if(pos[i]>i){
                pos[i]--;
                break;
            } else {
                if(i >= len-1){
                    // console.log('114',pos)
                    shouldBreak = true;
                    break;
                }
                var t = pos[i+1];
                if(t>i+1){
                    for (var j = i+1; j >= 0; j--) {
                        // console.log('115',pos)
                        pos[j] = --t;
                    }
                    break;
                }
            }
        }
    }while(!shouldBreak)
    return output;
}
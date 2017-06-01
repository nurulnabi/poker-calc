/*
 * @Author: noor
 * @Date:   2017-05-26 19:42:07
 * @Last Modified by:   noor
 * @Last Modified time: 2017-06-01 15:27:49
 */

var winner = require('./index');
var params = {
    "boardCards": [
        { "type": "heart", "rank": 1 },
        { "type": "heart", "rank": 2 },
        { "type": "heart", "rank": 11 },
        { "type": "heart", "rank": 10 },
        { "type": "heart", "rank": 13 }
    ],
    "playerCards": [{ "playerId": "1", "cards": [{ "type": "spade", "rank": 11 }, { "type": "club", "rank": 3 }] },
        { "playerId": "2", "cards": [{ "type": "heart", "rank": 6 }, { "type": "club", "rank": 5 }] }
    ]
}

var params2 = {
    "boardCards": [                         // ["14H", "2H", "JH", "10H", "KH"]
        "AH", "2H", "JH", "10H", "KH"
    ],
    "playerCards": [{ "playerId": "1", "cards": ["JS", "3C"] },
        { "playerId": "2", "cards": ["6H", "5C"] }
    ]
}

console.log("Input:");
console.log(JSON.stringify(params));
console.log("Output:"); 
console.log(JSON.stringify(winner.getHoldemWinner(params, { compactCards:true })));
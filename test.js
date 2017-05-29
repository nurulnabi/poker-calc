/*
 * @Author: noor
 * @Date:   2017-05-26 19:42:07
 * @Last Modified by:   noor
 * @Last Modified time: 2017-05-29 13:51:13
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

console.log("Input:");
console.log(JSON.stringify(params));
console.log("Output:");
console.log(JSON.stringify(winner.getHoldemWinner(params)));

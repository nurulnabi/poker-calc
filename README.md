# poker-calc
Fastest way to calculate poker hand types, best hand, Texas Hold'em winner. More coming soon.

## Installation

```
npm install poker-calc --save
```
## Testing (after installing)

```
npm test
```
```javascript

## Usage


var pokerCalc = require('poker-calc');

var winner = pokerCal.getHoldemWinner(param);	//winner is an array which contains the winners
```
## Notes

param to be passed as argument of getHoldemWinner is an object which must be in the following format.

```javascript
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
```
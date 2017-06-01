# poker-calc
Fastest way to calculate poker hand types, best hand, Texas Hold'em winner, Omaha winner, get type of five cards hand. More coming soon.

## Installation

```
npm install poker-calc --save
```
## Testing (after installing)

```
npm test
```


## Usage

```javascript
var pokerCalc = require('poker-calc');

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
    "boardCards": [                 // ["14H", "2H", "JH", "10H", "KH"]
        "AH", "2H", "JH", "10H", "KH"
    ],
    "playerCards": [{ "playerId": "1", "cards": ["JS", "3C"] },
        { "playerId": "2", "cards": ["6H", "5C"] }
    ]
}

var winner = pokerCalc.getHoldemWinner(params,{ compactCards: false});   //winner is an array which contains the winners
//output
[
  {
    "playerId": "2",
    "hand": {
      "handInfo": {
        "type": "Flush",
        "strength": 6
      },
      "cards": [
        {
          "type": "Heart",
          "rank": 1,
          "name": "A",
          "priority": 14
        },
        {
          "type": "Heart",
          "rank": 13,
          "name": "K",
          "priority": 13
        },
        {
          "type": "Heart",
          "rank": 11,
          "name": "J",
          "priority": 11
        },
        {
          "type": "Heart",
          "rank": 10,
          "name": "10",
          "priority": 10
        },
        {
          "type": "Heart",
          "rank": 6,
          "name": "6",
          "priority": 6
        }
      ]
    }
  }
]



var winner = pokerCalc.getHoldemWinner(params2,{ compactCards: true});  //winner is an array which contains the winners
//output
[
  {
    "playerId": "2",
    "hand": {
      "handInfo": {
        "type": "Flush",
        "strength": 6
      },
      "cards": [
        "AH",
        "KH",
        "JH",
        "10H",
        "6H"
      ]
    }
  }
]
```

## Notes
* `compactCards` flag can be used in both card formats.
* Ranks of different cards are as below
* Card - Rank
    * A  - 1
    * 2  - 2
    * 3  - 3
    * 4  - 4
    * 5  - 5
    * 6  - 6
    * 7  - 7
    * 8  - 8
    * 9  - 9
    * 10 - 10
    * J  - 11
    * Q  - 12
    * k  - 13
# poker-calc

[![npm version](https://badge.fury.io/js/poker-calc.svg)](https://badge.fury.io/js/poker-calc)
![Downloads](https://img.shields.io/npm/dm/poker-calc.svg?style=flat)
![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)
[![Build Status](https://travis-ci.org/nurulnabi/poker-calc.svg?branch=master)](https://travis-ci.org/nurulnabi/poker-calc)
-----------
![NPM](https://nodei.co/npm/poker-calc.png?downloads=true&downloadRank=true&stars=true)
![NPM](https://nodei.co/npm-dl/poker-calc.png?height=2)

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

//for omaha winners
var winners = pokerCalc.getOmahaWinner(params)  //here the playerCards for each player should be four

//to get type of five cards hand
var typeObject =  pokerCalc.getType(cards)          //array of five cards
//output  { type:"flush", strength:6 }
```

## Notes
* `compactCards` flag can be used in both card formats.
* Cards in compact format as in `params2` is not supported in `pokerCalc.getOmahaWinner`.
* Cards in any format as illustrated above are supported for `pokerCalc.getType`
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
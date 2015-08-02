/*
    Misc functions used throughout app. NOTE: some of these should potentially 
    be merged back into the componenet that uses them provided it is the only
    one
*/

//Dependencies
var React = require('react'),
    //This will eventually be dependant on button clicked
    Data = require('../sets/ORI.json'),
    _ = require('lodash'),
    $ = require('jquery-browserify'),
    //Note: this has been modified/monkeypatched to work with browserify
    modal = require('../../vendor/bootstrap/modal.js');
    require('browsernizr/test/storage/localstorage');
    var Modernizr = require('browsernizr');

var helpers = {
    //Converts a json of all card data into a list of card names
    jsonToDecklist: function(data){
        var decklist = '';
        for (var i = 0; i < data.length; i ++){
            decklist += (data[i].name + '\n');
        }
        return decklist;
    },
    //Monsterous function to generate the pack contents and push them to a pool array
    generatePool: function(){
        //NOTE: this code is ugly and should probably be refactored
        var pool = [],
            pack = Data.booster,//booster recipe provided in set json
            packAmt = React.findDOMNode(this.refs.packNumber).value;//input in controls component

        //For each pack
        for (var j = 0; j < packAmt; j++){

            //Create an array of rares from set json
            var rares = _.filter(Data.cards, function(card){
                if (card.names) {
                    //second condition excludes flip side of 2faced cards
                    return card.rarity == 'Rare' && card.names[0] == card.name;                    
                } else {
                    return card.rarity == 'Rare';
                } 
            });

            //Create an array of commons from set json
            var commons = _.filter(Data.cards, function(card){
                if (card.names) {
                    return card.rarity == 'Common' && card.names[0] == card.name;
                } else {
                    return card.rarity == 'Common';
                } 
            });

            //Create an array of uncommons from set json
            var uncommons = _.filter(Data.cards, function(card){
                if (card.names) {
                    return card.rarity == 'Uncommon' && card.names[0] == card.name;
                } else {
                    return card.rarity == 'Uncommon';
                }
            });

            //Create an array of mythics from set json
            var mythics = _.filter(Data.cards, function(card){
                if (card.names) {
                    return card.rarity == 'Mythic Rare' && card.names[0] == card.name;
                } else {
                    return card.rarity == 'Mythic Rare';
                }
            });

            //For each card in the pack
            for (var i = 0; i < pack.length; i++){
                //If the card type is an array of rarities (ex mythic vs rare)
                if (typeof pack[i] == 'object'){
                    //1/8 packs has a mythic
                    var mythicSpinner = Math.floor(Math.random() * 8);
                    if (mythicSpinner === 1){
                        //Get a random mythic and add it to the pool
                        var randomIndex = Math.floor(Math.random() * mythics.length);
                        pool.push(mythics[randomIndex]);
                    } else {
                        //Get a random rare and add it to the pull
                        var randomIndex = Math.floor(Math.random() * rares.length);
                        pool.push(rares[randomIndex]);
                    }
                }
                //If the card is an uncommon, add a random uncommon and remove it as an option
                if (pack[i] == 'uncommon'){
                    var randomIndex = Math.floor(Math.random() * uncommons.length);
                    pool.push(uncommons[randomIndex]);
                    uncommons.splice(randomIndex, 1);
                }
                //If the card is a common, add a random uncommon and remove it as an option
                if (pack[i] == 'common'){
                    var randomIndex = Math.floor(Math.random() * commons.length);
                    pool.push(commons[randomIndex]);
                    commons.splice(randomIndex, 1);
                }
            }
            //1/7 packs has a foil
            var foilSpinner = Math.floor(Math.random() * 7);
            if (foilSpinner === 1){
                //Remove the last card in the pool (it will be a common)
                pool.pop();
                //Get a random card and create a new card object with foil property
                var randomIndex = Math.floor(Math.random() * Data.cards.length),
                    foilCard = _.assign({}, Data.cards[randomIndex], {foil : true});

                //Used for debug
                console.log('you got a foil and it is', foilCard);

                pool.push(foilCard);
            }
        }
        this.setState({
            visiblePool: _.sortBy(pool, 'name'),//Prevents the same cards from scattering
            storedPool: [],//Empty the stored pool
            deck: []//And the deck
        });
    },
    //Add the clicked card to the deck and remove from the pool (merge with below)
    addToPool: function(card){
        var visiblePool = this.state.visiblePool,
            visibleDeck = this.state.deck,
            visibleIndex = visibleDeck.indexOf(card);

        visibleDeck.splice(visibleIndex, 1);
        visiblePool.push(card);

        this.setState({
            visiblePool: visiblePool,
            deck: visibleDeck
        });
    },
    //Add the clicked card to the pool and remove from the deck (merge with above)
    addToDeck: function(card){
        var visiblePool = this.state.visiblePool,
            visibleDeck = this.state.deck,
            visibleIndex = visiblePool.indexOf(card);

        visiblePool.splice(visibleIndex, 1);
        visibleDeck.push(card);

        this.setState({
            visiblePool: visiblePool,
            deck: visibleDeck
        });
    },
    sortPool: function(prop){
        //merge with below
        var sortedPool = _.sortBy(this.state.visiblePool, prop);
        this.setState({
            visiblePool: sortedPool
        });
    },
    sortDeck: function(prop){
        //merge with above
        var sortedDeck = _.sortBy(this.state.deck, prop);
        this.setState({
            deck: sortedDeck
        });
    },
    showModal: function(element){
        $(element).modal();
    },
    //Create a new filtered array and store the array of all cards as a recoverable state
    filterColor: function(prop){
        var poolToSort,
            poolToStore;

        if (this.state.storedPool.length == 0){
            //modify visible and store full pool
            poolToSort = 'visiblePool';
            poolToStore = this.state.visiblePool;
        } else {
            //modify stored and re-render
            poolToSort = 'storedPool';
            poolToStore = this.state.storedPool;
        }
        var filteredPool = _.filter(this.state[poolToSort], function(card){
            //If we don't want to filter out colorless cards
            if (prop != 'colorless'){
                //If the card has colors
                if (card.colors){
                    //Loop through all the colors (yay multicolored cards)
                    for (var i = 0; i < card.colors.length; i ++){
                        //If one of the colors is matched then return the card
                        if (card.colors[i] == prop){
                            return true;
                        }
                    }
                }
            } else {
                return card.types[0] == 'Artifact' || card.types[0] == 'Land'
            }
        });
        this.setState({
            visiblePool: filteredPool,
            storedPool: poolToStore
        });
    },
    //Returns the stored pool to the pool component
    resetFilter: function(){
        this.setState({
            visiblePool: this.state.storedPool,
            storedPool: []
        });
    },
    //Toggle the display mode of the card and store if user has localstorage
    toggleDisplay: function(){
        if (this.state.displayMode == 'text'){
            this.setState({
                displayMode: 'images'
            });
            if (Modernizr.localstorage) {
                localStorage.setItem('displayMode', 'images')
            }
        } else if (this.state.displayMode == 'images'){
            this.setState({
                displayMode: 'text'
            });
            if (Modernizr.localstorage) {
                localStorage.setItem('displayMode', 'text')
            }
        }
    },
    //Return all cards in the deck to the pool componenet 
    resetDeck: function(){
        var visiblePool = this.state.visiblePool;
        var visibleDeck = this.state.deck;
        visiblePool.concat(visibleDeck);
        this.setState({
            visiblePool: visiblePool,
            deck: []
        })
    },
    //Take the manacost string and replace icons with respective react componenets
    manaCostToIcon: function(manaCost){
        var manaArray = manaCost.split(/({.})/g).filter(Boolean);
        for (var i = 0; i < manaArray.length; i ++){
            var manaClass = 'ms ms-' + manaArray[i].toLowerCase().replace(/}/g, '').replace(/{/g, '') + ' ms-cost';
            manaArray[i] = <i key={i} className={manaClass}></i>;
        }
        return manaArray;
    },
    //Take the rules string and replace icons with respective react componenets
    rulesTextToIcon: function(rulesText){
        if (rulesText.indexOf('{') != -1){
            var rulesArray = rulesText.split(/({.})/g).filter(Boolean);
            for (var i = 0; i < rulesArray.length; i ++){
                if (rulesArray[i].length == 3){
                    var manaClass = 'ms ms-' + rulesArray[i].toLowerCase().replace(/}/g, '').replace(/{/g, '') + ' ms-cost';
                    rulesArray[i] = <i key={i} className={manaClass}></i>;
                }
            }
            return rulesArray;
        } else {
            return rulesText;
        }
    }
}

module.exports = helpers;
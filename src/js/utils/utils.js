/*
    Misc functions used throughout app. NOTE: some of these should potentially 
    be merged back into the componenet that uses them provided that is the only
    place that they are used.
*/

//Dependencies
var React = require('react'),
    _ = require('lodash'),
    $ = require('jquery-browserify'),
    modal = require('../../vendor/bootstrap/modal.js'),// monkeypatched
    axios = require('axios'),
    localstorageTest = require('browsernizr/test/storage/localstorage'),
    Modernizr = require('browsernizr');

var helpers = {
    jsonToDecklist: function(data){
        /*
            Converts a json of all card data into a list of card names.
            Used for the decklist/pool list modal windows.
        */
        var stringifiedDecklist = '';

        var cardWithQuantity = _.transform(data, function(result, card){
            if (result[card.name]){
                result[card.name]++;
            } else {
                result[card.name] = 1;
            }
        }, []);

        _.forIn(cardWithQuantity, function(quantity, cardName){
            stringifiedDecklist += (quantity + ' ' + cardName + '\n');
        });

        return stringifiedDecklist;
    },
    generatePool: function(){
        /*
            Core of the application, creates a card array or "pool" based 
            on user-selected sets, pack quantity, and source mtgJSON data.
        */
        var chosenSet = React.findDOMNode(this.refs.set).value,
            packAmt = React.findDOMNode(this.refs.packNumber).value,
            pool = [],
            self = this;

        var filterRarity = function(set, rarity){
            return _.filter(set, function(card){
                if (card.names) {
                    //exclude backside of two faced cards
                    return card.rarity == rarity && card.names[0] == card.name;  
                } else {
                    return card.rarity == rarity;
                } 
            });
        }

        var getRandomOfRarity = function(rarity, outcomes){
            var indexSpinner = Math.floor(Math.random() * outcomes[rarity].length),
                card = outcomes[rarity][indexSpinner];

            outcomes[rarity].splice(indexSpinner, 1);

            return _.assign({}, card, {set: chosenSet});
        }

        //return the set data w/ promise
        axios.get('/sets/' + chosenSet + '.json').then(function(setdata){

            var pack = setdata.data.booster;// pack recipe provided in set json

            var filteredSet = {
                rare: filterRarity(setdata.data.cards, 'Rare'),
                common: filterRarity(setdata.data.cards, 'Common'),
                uncommon: filterRarity(setdata.data.cards, 'Uncommon'),
                mythic: filterRarity(setdata.data.cards, 'Mythic Rare')
            }

            for (var packIndex = 0; packIndex < packAmt; packIndex++){

                // Create new pool of cards so we can't have duplicates
                var potentialCards = _.cloneDeep(filteredSet);

                for (var cardIndex = 0; cardIndex < pack.length; cardIndex++){
                    // Rare/mythic slot first. Assuming 1/8 are mythics
                    if (typeof pack[cardIndex] == 'object' && cardIndex === 0){
                        if (Math.floor(Math.random() * 8) === 1){
                            pool.push(getRandomOfRarity('mythic', potentialCards));
                        } else {
                            pool.push(getRandomOfRarity('rare', potentialCards));
                        }
                    }
                    // Only rares/mythics + commons + uncommons, not promos/other
                    if (pack[cardIndex] == 'uncommon' || pack[cardIndex] == 'common'){
                        pool.push(getRandomOfRarity(pack[cardIndex], potentialCards));
                    }
                }
                // 1/7 packs has a foil unless premium/reprint set
                // NOTE: This assumes a lot of things about foil distribution
                if (setdata.data.type == 'reprint' || Math.floor(Math.random() * 7) === 1){
                    pool.pop();
                    var indexSpinner = Math.floor(Math.random() * setdata.data.cards.length),
                        foilCard = _.assign({}, setdata.data.cards[indexSpinner], {foil : true, set : chosenSet});
                    pool.push(foilCard);
                }
            }
            // Note: also empties the stored pool and deck
            self.setState({
                visiblePool: _.sortBy(pool, 'name'), //Prevent scattering
                storedPool: [],
                deck: []
            });
        });
    },
    addToPool: function(card){
        //Add the clicked card to the deck and remove from the pool (merge with below)

        var visiblePool = this.state.visiblePool,
            visibleDeck = this.state.deck,
            storedPool = this.state.storedPool,
            visibleIndex = visibleDeck.indexOf(card),
            storedIndex;

        visibleDeck.splice(visibleIndex, 1);
        visiblePool.push(card);

        if (storedPool.length > 0){
            storedPool.push(card);
        }

        this.setState({
            visiblePool: visiblePool,
            storedPool: storedPool,
            deck: visibleDeck
        });
    },
    addToDeck: function(card){
        //Add the clicked card to the pool and remove from the deck (merge with above)

        var visiblePool = this.state.visiblePool,
            visibleDeck = this.state.deck,
            storedPool = this.state.storedPool,
            visibleIndex = visiblePool.indexOf(card),
            storedIndex;

        if (storedPool.length > 0){
            storedIndex = storedPool.indexOf(card);
            storedPool.splice(storedIndex, 1);
        }

        visiblePool.splice(visibleIndex, 1);
        visibleDeck.push(card);

        this.setState({
            visiblePool: visiblePool,
            storedPool: storedPool,
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
    filterColor: function(prop){
        //Create a new filtered array and store the array of all cards as a recoverable state

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
                //If the card has colors
            if (card.colors){
                //Loop through all the colors (yay multicolored cards)
                for (var i = 0; i < card.colors.length; i ++){
                    //If one of the colors is matched then return the card
                    if (card.colors[i] == prop){
                        return true;
                    }
                }
            } else if (prop == 'colorless') {
                return true;
            }
        });
        this.setState({
            visiblePool: filteredPool,
            storedPool: poolToStore
        });
    },
    resetFilter: function(){
        //Returns the stored pool to the pool component

        //don't reset it to nothing!
        if (this.state.storedPool.length > 0) {
            this.setState({
                visiblePool: this.state.storedPool,
                storedPool: []
            });
        }
    },
    toggleDisplay: function(){
        //Toggle the display mode of the card and store if user has localstorage

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
    resetDeck: function(){
        //Return all cards in the deck to the pool componenet 

        var visiblePool = this.state.visiblePool;
        var visibleDeck = this.state.deck;
        visiblePool.concat(visibleDeck);
        this.setState({
            visiblePool: visiblePool,
            deck: []
        })
    },
    manaCostToIcon: function(manaCost){
        //Take the manacost string and replace icons with respective react componenets

        var manaArray = manaCost.split(/({.+?})/g).filter(Boolean);
        for (var i = 0; i < manaArray.length; i ++){
            var isSplit = manaArray[i].indexOf('/') != -1 && manaArray[i].indexOf('/P') == -1 ? ' ms-split' : '';
            var manaClass = 'ms ms-' + manaArray[i].toLowerCase().replace(/\//g, '').replace(/}/g, '').replace(/{/g, '') + ' ms-cost' + isSplit;
            manaArray[i] = <i key={i} className={manaClass}></i>;
        }
        return manaArray;
    },
    rulesTextToIcon: function(rulesText){
        //Take the rules string and replace icons with respective react componenets

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
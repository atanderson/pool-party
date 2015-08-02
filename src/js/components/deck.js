/*
    All cards selected for the deck sorted into columns of mana cost
*/

var React = require('react');

//Child componenets
var Card = require('./card');

//Dependencies
var _ = require('lodash');

var Deck = React.createClass({
    render: function(){
        var self = this;

        var groupByIndex = function (obj, fn) {
            return _.transform(obj, function(result, n, key) {
                  var index = fn(n, key);
                  result[index] = result[index] || [];
                  result[index].push(n)
            }, []);
        };

        //Return the cmc for the card
        var getCMC = function (card) {
            //If the card has a cmc, return it, else set it to zero
            if (card._store.props.data.cmc){
                return card._store.props.data.cmc;
            } else {
                return card._store.props.data.cmc = 0;
            }
        };

        //Array of all cards passed into the componenet
        var deck = this.props.data.map(function(card, i){
            return (
                <Card className="card col-sm-15" displayMode={self.props.displayMode} data={card} key={i} onClick={self.props.addToPool}/>
            )
        });

        //Take the deck array and return array of arrays of cards with a certain cmc
        var deckColumns = _.map( groupByIndex(deck, getCMC) , function(column, i){
            return (
                <div className="column" key={i}>
                    <div className="legend col-sm-15">{i}</div>
                    {column}
                </div>
            )
        });

        return (
            <div className="row">
                <h2 className="col-sm-15">
                    Deck 
                    {/* Returns all cards in deck to the pool */}
                    <button className="btn btn-default pull-right" onClick={this.props.resetDeck}>reset deck</button>
                </h2>
                <div className="col-sm-15 deck bin">
                    {deckColumns}
                </div>
            </div>
        )
    }
});

module.exports = Deck;
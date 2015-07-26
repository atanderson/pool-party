var React = require('react');
var Card = require('./card');
var _ = require('lodash');

var Deck = React.createClass({
    render: function(){
        var self = this;
        var deck = this.props.data.map(function(card, i){
            return <Card data={card} key={i} onClick={self.props.addToPool}/>
        });

        var groupByIndex = function (obj, fn) {
            return _.transform(obj, function(result, n, key) {
                  const index = fn(n, key);
                  result[index] = result[index] || [];
                  result[index].push(n)
            }, []);
        }

        var getCMC = function (card) {
            return card._store.props.data.cmc;
        }

        var deckColumns = _.map( groupByIndex(deck, getCMC) , function(column){
            return (
                <div>
                    {column}
                </div>
            )
        });

        return (
            <div>
                <div className="col-sm-12 sorting deck">
                    <h2>Deck</h2>
                    {deckColumns}
                </div>
                <div className="col-sm-12 deck">
                   
                </div>
            </div>
        )
    }
});

module.exports = Deck;
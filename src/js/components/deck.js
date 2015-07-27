var React = require('react');
var Card = require('./card');
var _ = require('lodash');

var Deck = React.createClass({
    render: function(){
        var self = this;
        var deck = this.props.data.map(function(card, i){
            return (
                <Card className="card col-sm-12" displayMode={self.props.displayMode} data={card} key={i} onClick={self.props.addToPool}/>
            )
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

        var deckColumns = _.map( groupByIndex(deck, getCMC) , function(column, i){
            return (
                <div className="column">
                    <div className="legend col-sm-12">{i}</div>
                    {column}
                </div>
            )
        });

        return (
            <div className="row">
                <h2 className="col-sm-12">Deck</h2>
                <div className="col-sm-12 deck bin">
                    {deckColumns}
                </div>
            </div>
        )
    }
});

module.exports = Deck;
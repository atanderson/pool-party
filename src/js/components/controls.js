var React = require('react');
var Card = require('./card');
var Data = require('../stores/ORI.json');
var Deck = require('./deck')
var _ = require('lodash');

var Controls = React.createClass({
    getInitialState: function(){
        return {
            visiblePool: [],
            storedPool: [],
            deck: []
        }
    },
    generatePool: function(){
        var pool = [];
        var pack = Data.booster;
        var self = this;

        var howMany = React.findDOMNode(self.refs.packNumber).value;
        console.log(howMany);
        for (var j = 0; j < howMany; j++){

            var rares = _.filter(Data.cards, function(card){
                return card.rarity == 'Rare'
            });

            var commons = _.filter(Data.cards, function(card){
                return card.rarity == 'Common'
            });

            var uncommons = _.filter(Data.cards, function(card){
                return card.rarity == 'Uncommon'
            });

            var mythics = _.filter(Data.cards, function(card){
                return card.rarity == 'Mythic Rare'
            });

            for (var i = 0; i < pack.length; i++){
                if (typeof pack[i] == 'object'){
                    var mythicSpinner = Math.floor(Math.random() * 8);
                    if (mythicSpinner === 1){
                        var randomIndex = Math.floor(Math.random() * mythics.length);
                        pool.push(mythics[randomIndex]);
                    } else {
                        var randomIndex = Math.floor(Math.random() * rares.length);
                        pool.push(rares[randomIndex]);
                    }
                }
                if (pack[i] == 'uncommon'){
                    var randomIndex = Math.floor(Math.random() * uncommons.length);
                    pool.push(uncommons[randomIndex]);
                    uncommons.splice(randomIndex, 1);
                }
                if (pack[i] == 'common'){
                    var randomIndex = Math.floor(Math.random() * commons.length);
                    pool.push(commons[randomIndex]);
                    commons.splice(randomIndex, 1);
                }
            }
        }
        self.setState({
            visiblePool: pool
        });
    },
    sortPool: function(prop){
        var sortedPool = _.sortBy(this.state.visiblePool, prop);
        this.setState({
            visiblePool: sortedPool
        });
    },
    sortDeck: function(prop){
        var sortedDeck = _.sortBy(this.state.deck, prop);
        this.setState({
            deck: sortedDeck
        });
    },
    filterColor: function(prop){
        var self = this;
        if (self.state.storedPool.length == 0){
            var filteredPool = _.filter(self.state.visiblePool, function(card){
                if (prop != 'colorless'){
                    if (card.colors){
                        for (var i = 0; i <= card.colors.length; i ++){
                            return card.colors[i] == prop
                        }
                    }
                } else {
                    return card.types[0] == 'Artifact' || card.types[0] == 'Land'
                }
            });
            self.setState({
                visiblePool: filteredPool,
                storedPool: self.state.visiblePool
            });
        } else {
            var filteredPool = _.filter(self.state.storedPool, function(card){
                if (prop != 'colorless'){
                    if (card.colors){
                        for (var i = 0; i <= card.colors.length; i ++){
                            return card.colors[i] == prop
                        }
                    }
                } else {
                    return card.types[0] == 'Artifact' || card.types[0] == 'Land'
                }
            });
            self.setState({
                visiblePool: filteredPool
            });
        }
    },
    resetFilter: function(){
        var self = this;
        self.setState({
            visiblePool: self.state.storedPool,
            storedPool: []
        });
    },
    addToDeck: function(card){
        var self = this;
        //store so state is not modified directly
        var visiblePool = self.state.visiblePool;
        var visibleDeck = self.state.deck;
        var visibleIndex = visiblePool.indexOf(card);
        visiblePool.splice(visibleIndex, 1);
        visibleDeck.push(card);

        self.setState({
            visiblePool: visiblePool,
            deck: visibleDeck
        });

    },
    addToPool: function(card){
        var self = this;
        //store so state is not modified directly
        var visiblePool = self.state.visiblePool;
        var visibleDeck = self.state.deck;
        var visibleIndex = visibleDeck.indexOf(card);
        visibleDeck.splice(visibleIndex, 1);
        visiblePool.push(card);

        self.setState({
            visiblePool: visiblePool,
            deck: visibleDeck
        });
    },
    render: function(){
        var self = this;
        var pool = this.state.visiblePool.map(function(card, i){
            return <Card data={card} key={i} onClick={self.addToDeck}/>
        });
        return (
            <div className="deck row row-collapse">
                <div className="col-sm-3">
                    <label htmlFor="packs">Number of packs</label>
                    <div className="input-group">
                        <input id="packs" min="1" defaultValue="6" className="form-control" type="number" ref="packNumber" />
                        <span className="input-group-btn">
                            <button className="btn btn-danger" onClick={this.generatePool}>generate</button>
                        </span>
                    </div>
                </div>
                <Deck data={this.state.deck} sortDeck={this.sortDeck} addToPool={this.addToPool}/>
                <div className="col-sm-12 sorting pool">
                    <h2>Pool</h2>
                    <button className="btn btn-info" onClick={this.sortPool.bind(null, 'cmc')}>sort by CMC</button>
                    <button className="btn btn-info" onClick={this.sortPool.bind(null, 'rarity')}>sort by rarity</button>
                    <button className="btn btn-info" onClick={this.sortPool.bind(null, 'colors')}>sort by color</button>
                    <button className="btn btn-info" onClick={this.sortPool.bind(null, 'type')}>sort by type</button>
                    <button className="btn btn-info" onClick={this.sortPool.bind(null, 'name')}>sort by name</button>
                </div>
                <div className="col-sm-12 filtering pool">
                    <button className="btn btn-info" onClick={this.filterColor.bind(null, 'Red')}>red cards</button>
                    <button className="btn btn-info" onClick={this.filterColor.bind(null, 'Blue')}>blue cards</button>
                    <button className="btn btn-info" onClick={this.filterColor.bind(null, 'Black')}>black cards</button>
                    <button className="btn btn-info" onClick={this.filterColor.bind(null, 'Green')}>green cards</button>
                    <button className="btn btn-info" onClick={this.filterColor.bind(null, 'White')}>white cards</button>
                    <button className="btn btn-info" onClick={this.filterColor.bind(null, 'colorless')}>colorless cards</button>
                    <button className="btn btn-info" onClick={this.resetFilter}>reset filter</button>
                </div>
                <div className="col-sm-12 pool active">
                    {pool}
                </div>
            </div>
        )
    }
});

module.exports = Controls;
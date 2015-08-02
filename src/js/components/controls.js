/*
    Primary route/display that allows for pool generation and deckbuilding
*/

var React = require('react');

//Child Componenents
var Card = require('./card'),
    Deck = require('./deck'),
    Pool = require('./pool'),
    ListModal = require('./list-modal');

//Helpers (most of which used by this component) and dependencies
require('browsernizr/test/storage/localstorage');
var Modernizr = require('browsernizr'),
    helpers = require('../utils/utils');

var Controls = React.createClass({
    getInitialState: function(){
        return {
            visiblePool: [],
            storedPool: [],
            deck: [],
            displayMode: 'text'
        }
    },
    render: function(){
        return (
            <div className="col-sm-15">
                <div className="row">
                    <div className="col-sm-5">
                        <label htmlFor="display-mode">Card Display Mode</label>
                        <div className="input-group">
                            {/* toggle and show the card display mode */}
                            <button className="btn btn-danger" onClick={helpers.toggleDisplay.bind(this)}>{this.state.displayMode}</button>
                        </div>
                    </div>
                    <div className="col-sm-5">
                        <label htmlFor="packs">Number of Packs</label>
                        <div className="input-group">
                            {/* determine the pool recipe and generate it */}
                            <input id="packs" min="1" defaultValue="6" className="form-control" type="number" ref="packNumber" />
                            <span className="input-group-btn">
                                <button className="btn btn-danger" onClick={helpers.generatePool.bind(this)}>generate</button>
                            </span>
                        </div>
                    </div>
                    <div className="col-sm-5">
                        <label htmlFor="reveals">Show Lists</label>
                        <div id="reveals" className="btn-group input-group">
                            {/* provide the decklist and pool list inside of modals */}
                            <button className="btn btn-default pool-toggle" onClick={helpers.showModal.bind(null, '#pool-list')}>Pool list</button>
                            <button className="btn btn-default deck-toggle" onClick={helpers.showModal.bind(null, '#deck-list')}>Deck list</button>
                        </div>
                        <ListModal title="Sealed Pool" jsonToDecklist={helpers.jsonToDecklist} id={"pool-list"} data={this.state.visiblePool.concat(this.state.storedPool)} />
                        <ListModal title="Decklist" jsonToDecklist={helpers.jsonToDecklist} id={"deck-list"} data={this.state.deck} />
                    </div>
                </div>
                {/* conditionally render the two main child componenets, the deck and the pool */}
                {this.state.deck.length > 0 ? <Deck resetDeck={helpers.resetDeck.bind(this)} displayMode={this.state.displayMode} data={this.state.deck} sortDeck={helpers.sortDeck.bind(this)} addToPool={helpers.addToPool.bind(this)}/> : null}
                {this.state.visiblePool.length > 0 ? <Pool filterColor={helpers.filterColor.bind(this)} displayMode={this.state.displayMode} data={this.state.visiblePool} resetFilter={helpers.resetFilter.bind(this)} sortPool={helpers.sortPool.bind(this)} addToDeck={helpers.addToDeck.bind(this)} />: null}
            </div>
        )
    },
    componentDidMount: function(){
        {/* if the user browser has localstorage, and displaymode has been stored, retrieve and set it */}
        if (Modernizr.localstorage && localStorage.getItem('displayMode')) {
            var savedMode = localStorage.getItem('displayMode');
            this.setState({
                displayMode: savedMode
            })
        }
    }
});

module.exports = Controls;
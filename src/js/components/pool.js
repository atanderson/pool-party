/*
    List of all cards generated along with filtering/sorting options
*/

var React = require('react');

//Child components
var Card = require('./card');

var Pool = React.createClass({
    render: function(){
        var self = this,
        pool = this.props.data.map(function(card, i){
            return <Card displayMode={self.props.displayMode} className="card col-sm-3" data={card} key={i} onClick={self.props.addToDeck}/>
        });
        return (
            <div className="row">
                <div className="col-sm-15 sorting pool">
                    <div className="row">
                        <h2 className="col-sm-15">Pool</h2>
                        <div className="col-sm-7">
                            <h5>Sort Pool</h5>
                            <div className="btn-group">
                                {/* for each of these, bind the property that will be used to sort */}
                                <button className="btn btn-default" onClick={this.props.sortPool.bind(null, 'cmc')}>CMC</button>
                                <button className="btn btn-default" onClick={this.props.sortPool.bind(null, 'rarity')}>Rarity</button>
                                <button className="btn btn-default" onClick={this.props.sortPool.bind(null, 'colors')}>Color</button>
                                <button className="btn btn-default" onClick={this.props.sortPool.bind(null, 'type')}>Type</button>
                                <button className="btn btn-default" onClick={this.props.sortPool.bind(null, 'name')}>Name</button>
                            </div>
                        </div>
                        <div className="col-sm-7 col-sm-offset-1 text-right">
                            <h5>Filter Pool</h5>
                            <div className="btn-group">
                                {/* for each of these, bind the color that will be filtered */}
                                <button className="btn btn-default" onClick={this.props.filterColor.bind(null, 'Red')}>Red</button>
                                <button className="btn btn-default" onClick={this.props.filterColor.bind(null, 'Blue')}>Blue</button>
                                <button className="btn btn-default" onClick={this.props.filterColor.bind(null, 'Black')}>Black</button>
                                <button className="btn btn-default" onClick={this.props.filterColor.bind(null, 'Green')}>Green</button>
                                <button className="btn btn-default" onClick={this.props.filterColor.bind(null, 'White')}>White</button>
                                <button className="btn btn-default" onClick={this.props.filterColor.bind(null, 'colorless')}>Colorless</button>
                                <button className="btn btn-primary" onClick={this.props.resetFilter}>Reset</button>
                            </div>
                        </div>
                    </div>
                    <div className="row pool-cards">
                        {pool}
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = Pool;
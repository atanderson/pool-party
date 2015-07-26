var React = require('react');
var Controls = require('./controls');

var App = React.createClass({
    render: function(){
        return (
            <div className="container">
                <h1>Sealed Deck Generator</h1>
                <Controls />
            </div>
        )
    }
});

module.exports = App;
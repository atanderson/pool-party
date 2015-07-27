var React = require('react');
var Controls = require('./controls');

var App = React.createClass({
    render: function(){
        return (
            <div className="container">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                Sealed Deck Generator
                            </a>
                        </div>
                    </div>
                </nav>
                <div className="row">
                    <Controls/>
                </div>
            </div>
        )
    }
});

module.exports = App;
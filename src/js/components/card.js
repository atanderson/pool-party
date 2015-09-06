/*
    Represents a single card
    Cards have two display modes that are controlled via top-level state
*/

var React = require('react'),
    helpers = require('../utils/utils'); //manaCostToIcon, rulesTextToIcon

var Card = React.createClass({
    getInitialState: function(){
        return {
            expanded: false
        }
    },
    expand: function(){
        //state toggle to expand/zoom in on card information
        if (this.state.expanded){
            this.setState({
                expanded: false
            })
        } else {
            this.setState({
                expanded: true
            })
        }
    },
    render: function(){
        //name separated out so set switching can be implemented in the future
        var setName = this.props.data.set,
            display;//holds the actual card markup

        //Textual card display
        if (this.props.displayMode == 'text'){
            //string needed for the set/rarity icon
            var iconSlug = 'ss ss-grad ss-' + setName + ' ss-' + this.props.data.rarity.toLowerCase();

            display = (
                <div className="inner">
                    {/* clicking on this heading adds/removes card from pool/deck */}
                    <div onClick={this.props.onClick.bind(null, this.props.data)}  className="heading">
                        {this.props.data.name} 
                        <span className="pull-right">+</span>
                    </div>
                    {/* clicking on the text area expands/collapses the card */}
                    <div className="info" onClick={this.expand}>
                        <span className="card-prop">
                            <span className="pull-left">
                                <i className={iconSlug}></i>
                                {/* foil indicator */}
                                {this.props.data.foil ? <i className="ss ss-pmei"></i> 
                                                      : null}
                            </span>
                            <span className="pull-right">
                                {/* If the card has a manacost, turn the mana symbols into icons */}
                                {this.props.data.manaCost ? helpers.manaCostToIcon(this.props.data.manaCost) : null}
                            </span>
                            <span className="card-prop type">{this.props.data.type}</span>
                        </span>
                        {/* If the card is expanded, show all the rules text with mana/tap icons */}
                        {this.state.expanded ? <span className="card-prop">{this.props.data.text ? helpers.rulesTextToIcon(this.props.data.text) : null}</span> 
                                             : null}

                        {this.props.data.power ? <span className="card-prop pandt">{this.props.data.power}/{this.props.data.toughness}</span> 
                                               : null }
                    </div>
                </div>
            )
        //Card image with minimal wrapper
        } else if (this.props.displayMode == 'images'){
            //Convert the card name into a viable filename string
            var imgSlug = 'img/' + setName + '/' + this.props.data.imageName.replace(/ /g, '-').replace(/(,|'|:|;|!)/g, '').replace(/æ/g, 'ae') + '.png',

            display = (
                <div className="card-img-wrapper" data-foil={this.props.data.foil ? this.props.data.foil : false}>
                    {!this.state.expanded ?
                        <div className="expand above-overlay" onClick={this.expand}>
                            <i className="glyphicon glyphicon-zoom-in"></i>
                        </div>
                    : null}
                    <img onClick={this.state.expanded ? this.expand : this.props.onClick.bind(null, this.props.data)} src={imgSlug} />
                </div>
            )
        }

        //Put the mode-specific display markup in a consistant wrapper
        return (
            <div className={this.props.displayMode == 'text' ? this.props.className : 'card card-image'}
                data-expanded={this.state.expanded}
                data-display-mode={this.props.displayMode}
                data-type={this.props.data.type ? this.props.data.types[0] : null}
                data-color={this.props.data.colors ? this.props.data.colors.join(' ') : 'colorless'}>
                
                {display}
            </div>
        )
    }
});

module.exports = Card;
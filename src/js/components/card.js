var React = require('react');

var Card = React.createClass({
    render: function(){
        var imgSlug = 'img/ORI/' + this.props.data.name.toLowerCase().replace(/ /g, '-').replace(/,/g, '').replace(/'/g, '').replace(/æ/g, 'ae') + '.png';
        var display;
        if (this.props.displayMode == 'text'){
            display = (
                <div className="inner">
                    <div>{this.props.data.name}</div>
                    <div>{this.props.data.manaCost} - {this.props.data.rarity[0]}</div>
                </div>
            )
        } else if (this.props.displayMode == 'images'){
            display = (
                <img src={imgSlug} />
            )
        }
        return (
            <div className={this.props.className}
                data-display-mode={this.props.displayMode}
                data-type={this.props.data.type ? this.props.data.types.join(' ') : null}
                data-color={this.props.data.colors ? this.props.data.colors.join(' ') : null}
                onClick={this.props.onClick.bind(null, this.props.data)}
            >
                {display}
            </div>
        )
    }
});

module.exports = Card;
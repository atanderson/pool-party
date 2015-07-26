var React = require('react');

var Card = React.createClass({
    render: function(){
        var imgSlug = 'img/ORI/' + this.props.data.name.toLowerCase().replace(/ /g, '-').replace(/,/g, '').replace(/'/g, '').replace(/æ/g, 'ae') + '.png';
        return (
            <div className="card col-sm-2" 
                data-type={this.props.data.type ? this.props.data.types.join(' ') : null}
                data-color={this.props.data.colors ? this.props.data.colors.join(' ') : null}
                onClick={this.props.onClick.bind(null, this.props.data)}
            >
                <span>{this.props.data.name}</span>
                <img src={imgSlug} />
            </div>
        )
    }
});

module.exports = Card;
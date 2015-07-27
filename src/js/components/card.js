var React = require('react');

var Card = React.createClass({
    render: function(){
        var imgSlug = 'img/ORI/' + this.props.data.name.toLowerCase().replace(/ /g, '-').replace(/,/g, '').replace(/'/g, '').replace(/æ/g, 'ae') + '.png';
        return (
            <div className={this.props.className}
                data-type={this.props.data.type ? this.props.data.types.join(' ') : null}
                data-color={this.props.data.colors ? this.props.data.colors.join(' ') : null}
                onClick={this.props.onClick.bind(null, this.props.data)}
            >
                <span className="col-sm-12">{this.props.data.name}</span>
                <img className="col-sm-12" src={imgSlug} />
            </div>
        )
    }
});

module.exports = Card;
/*
    Modal of generated deck/pool list w/in a textarea
*/

var React = require('react');

var ListModal = React.createClass({
    render: function(){
        return (
            // id passed in as to link modal with its toggle button
            <div className="modal fade" key={this.props.id} id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.data != '' ? <textarea readOnly value={this.props.jsonToDecklist(this.props.data)} /> : <em>no cards selected</em>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ListModal;
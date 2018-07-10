try {
	var _commPingbo = React.createClass({
		getInitialState: function() {
			var me = this;
			if (!_commPingbo.unicode || _commPingbo.unicode > 99999) {
				_commPingbo.unicode = 1;
			} else {
				_commPingbo.unicode++;
			}	
			return {};
		},		
		render: function() {
			let me = this;
			return (<span>_commPingbo --> {me.props.parent.state.socket_id} </span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

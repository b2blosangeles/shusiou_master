try {
	var _commEng = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},	
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span>test</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

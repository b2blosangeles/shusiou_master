try {
	var _pluginObj = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function() {
			var me = this;
			me.setState({url : _master_svr() + '/api/video/pipe_stream.api?tm=' + new Date().getTime()});
		},
		render: function() {
			var me = this;
			return  (<span>{me.state.url}</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

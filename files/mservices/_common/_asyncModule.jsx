try {
	var _asyncModule = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidUpdate:function(prevState, prevProps) {
			var me = this;
			console.log('me.props.url === prevProps.url');
			if (me.props.url === prevProps.url) return true;
				console.log(me.props.url);
			else {
				console.log('==no==' + me.props.url);
				return true;
			}	
			var url = _master_svr() + '/api/JSXhub.api?url=' + encodeURIComponent(me.props.url) + 
			    	'&tm=' + new Date().getTime();
			$.get(url, function(data, status){
				if (data.success)  {
					eval(decodeURIComponent(data.code));
					me.setState({success: true, update : new Date().getTime()});
				} else {
					me.setState({success: false, update : new Date().getTime()});
				}
				
			});
		},
		render: function() {
			var me = this;
			if (me.state.success === false) {
				return  (<span>Loading Failure!</span>)
			} else if (me._asyncModule) {
				var v = new me._asyncModule();
				return  (<span>{v.render()}</span>)
			} else {
				return  (<span>Loading ...</span>)
			}
		}
	});	
} catch (err) {
	console.log(err.message);
}

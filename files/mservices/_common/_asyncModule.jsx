try {
	var _asyncModule = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function(prevState, prevProps) {
			var me = this;
			console.log('====componentDidMount====');
			me.loadCode();
		},		
		componentDidUpdate:function(prevState, prevProps) {
			var me = this;
			if (me.props.url !== prevProps.url) { 
				console.log('==PP==componentDidUpdate====');
				// me.loadCode();
			}	
		},
		loadCode : function() {
			var me = this;
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
				var v = new me._asyncModule({parent: me.props.parent});
				return  (<span>{v.render()}</span>)
			} else {
				return  (<span>Loading ...</span>)
			}
		}
	});	
} catch (err) {
	console.log(err.message);
}

try {
	var _asyncModule = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function(prevState, prevProps) {
			var me = this;
			me.loadCode();
		},		
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;
			if (me.props.url !== prevProps.url) { 
				me.loadCode();
			}	
		},
		loadCode : function() {
			var me = this;
			var url = _master_svr() + '/api/JSXhub.api?url=' + encodeURIComponent(me.props.url) + 
			    	'&tm=' + new Date().getTime();
			$.get(url, function(data, status){
				if (data.success)  {
					me._asyncModule = data.code;
					me.setState({success: true, update : new Date().getTime()});
				} else {
					me._asyncModuleErr = data.err;
					me.setState({success: false, update : new Date().getTime()});
				}
				
			});			
		},
		render: function() {
			var me = this;
			if (me.state.success === false) {
				return  (<span>Script Error: {me._asyncModuleErr}</span>)
			} else if (me._asyncModule) {
				
				// return  (<span><NNBB parent={me.props.parent}/></span>)
				try {
					var _asyncOBJ = new Function(decodeURIComponent(me._asyncModule));
					//var _asyncOBJ = {};
					//eval('_asyncOBJ = ' + decodeURIComponent(me._asyncModule));
					return  (<span><_asyncOBJ parent={me.props.parent}/></span>)
				} catch (err) {
					return  (<span>Script Error: {err.message}</span>)
				}
			} else {
				return  (<span>Loading ...</span>)
			}
		}
	});	
} catch (err) {
	console.log(err.message);
}

try {
	var _asyncModule = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function(prevState, prevProps) {
			var me = this;
			me.loadPlugin();
		},		
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;
			if (me.props.code !== prevProps.code) { 
				me.loadPlugin();
			}	
		},
		dataEngine : function(engCfg) {
			var me = this;
			Root.lib.loadEng(me, engCfg);
		},		
		loadPlugin : function() {
			var me = this;
			$.ajax({
				type: 'POST',
				url: _master_svr() + '/api/JSXhub.api',
				data: me.props.plugin,
				dataType: 'JSON',
				timeout: (2 * 1000),
				success: function(resultData){
					me._asyncModule = resultData.code;
					me.setState({success: true, update : new Date().getTime()});
				},
				error : function(xhr, textStatus, error) { 
					me._asyncModuleErr = error;
					me.setState({success: false, update : new Date().getTime()})
				}
			});		
		},
		render: function() {
			var me = this;
			if (me.state.success === false) {
				return  (<span>Script Error: {me._asyncModuleErr}</span>)
			} else if (me._asyncModule) {
				try {
					eval(decodeURIComponent(me._asyncModule.includes) + 
					     '; var _asyncOBJ = ' + decodeURIComponent(me._asyncModule.master));
					
					console.log(decodeURIComponent(me._asyncModule.includes) + 
					     '; var _asyncOBJ = ' + decodeURIComponent(me._asyncModule.master));
					return  (<span>
							<_asyncOBJ parent={me}/>
							{/*Root.lib.landingModal(me)*/}
						</span>)
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

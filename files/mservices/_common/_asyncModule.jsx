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
		dataEngine : function(engCfg) {
			var me = this;
			Root.lib.loadEng(me, engCfg);
		},		
		loadCode : function() {
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
					alert("Something went wrong");
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
					eval('var _asyncOBJ = ' + decodeURIComponent(me._asyncModule));
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

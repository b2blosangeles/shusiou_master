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
		dataEngine : function(engCfg, obj) {
			var me = this;
			engCfg.callBack = function() {
				alert(9988);
				obj.niuniu();
			}
		//	Root.lib.loadEng(me, engCfg);
			
			setTimeout(
				function() {
					obj.niuniu();
					console.log('called niuniu roof');
				}, 3000
			);			
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
				try {
					// var _asyncOBJ = new Function(decodeURIComponent(me._asyncModule));
					// var _asyncOBJ = {};
					eval('var _asyncOBJ = ' + decodeURIComponent(me._asyncModule));
					return  (<span>{me.vid}==<_asyncOBJ parent={me}/></span>)
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

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
			me._asyncModule = null;
			me.props.plugin.code = me.props.code;
			
			var cfg = {
				  package:{
					   includes : ['/files/js/module/publicNews/dataList.jsx'],
					   main : '/files/js/module/publicNews/main.jsx',
					   parkReact : true
				   },
				   master: '//master1_dev.shusiou.win/api/JSXhub.api'

				};
			  $.ajax({
			     type: 'POST',
			     url: cfg.master,
			     data: cfg.package,
			     dataType: 'JSON',
			     timeout: (cfg.timeout) ? cfg.timeout : (6 * 1000),
			     success: function(resultData){
				   console.log(decodeURIComponent(resultData.code));
				   me.setState({success: true, update : new Date().getTime()});
			     },
			     error : function(xhr, textStatus, error) { 
				console.log(error);
			      // me._asyncModuleErr = error;
			      // me.setState({success: false, update : new Date().getTime()})
			     }
			  }); 			
			/*
			$.ajax({
				type: 'POST',
				url: _master_svr() + '/api/JSXhub.api',
				data: me.props.plugin,
				dataType: 'JSON',
				timeout: (2 * 1000),
				success: function(resultData){
					me._asyncModule = resultData;
					// console.log(resultData);
					me.setState({success: true, update : new Date().getTime()});
				},
				error : function(xhr, textStatus, error) { 
					me._asyncModuleErr = error;
					me.setState({success: false, update : new Date().getTime()})
				}
			});
			*/
		},
		render: function() {
			var me = this;
			if (me.state.success === false) {
				return  (<span>Script Error: {me._asyncModuleErr}</span>)
			} else if (me._asyncModule) {
				try {
					var _asyncOBJ = React.createClass({render: function() { return (<span/>)}});
					eval(decodeURIComponent(me._asyncModule.code));
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

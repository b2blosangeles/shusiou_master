try {
	var _pluginObj = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function() {
			var me = this;
			// var url = _master_svr() + me.props.url + '?tm=' + new Date().getTime();
			var url = _master_svr() + '/api/JSXhub.api?tm=' + new Date().getTime();
			
			me._v = React.createClass({
			  getInitialState: function() {
			    var me = this;
			    return {niu:new Date().toString()}
			  },
			  render: function() {
			    var me = this;
			    return  (<span>{me.state.niu}</span>)
			  }
			});	
			setTimeout(
				function() {
					me.setState({url : url});
				}, 1200
			);
			
			
			$.get(url, function(data, status){
				console.log(data);
				me.setState({url : url});
				
			});
			
			/*
			$.getScript(url, function( data, textStatus, jqxhr ) {
			  console.log( data ); // Data returned
			  console.log( textStatus ); // Success
			  console.log( jqxhr.status ); // 200
			  console.log( "Load was performed." );
			});
			*/
			
		},
		render: function() {
			var me = this;
			if (me._v) {
				var v = new me._v();
				return  (<span>{v.render()}</span>)
			} else {
				return  (<span>NONO</span>)
			}
		}
	});	
} catch (err) {
	console.log(err.message);
}

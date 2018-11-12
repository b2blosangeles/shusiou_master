try {
	var _pluginObj = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function() {
			var me = this;
			var url = _master_svr() + me.props.url + '?tm=' + new Date().getTime();

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
			me.setState({url :url});
			/*
			$.get(url, function(data, status){
				console.log(data);
				
			});
			*/
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
			var _v = me._v;
			return  (<span><_v/></span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

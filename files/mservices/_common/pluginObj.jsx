try {
	var _pluginObj = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function() {
			var me = this;
			var url = _master_svr() + me.props.url + '?tm=' + new Date().getTime();
			$.get(url, function(data, status){
				console.log(data);
				me.setState({url :(<_v/>)});
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
			return  (<span>{me.state.url}</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

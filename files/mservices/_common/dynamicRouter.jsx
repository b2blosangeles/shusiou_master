try {
	var dynamicRouter = React.createClass({		
		getInitialState: function() {
			return {};
		},
		render: function() {
			var me = this;

			return me.props.route.routeconfig.component
		}		
	});	
} catch (err) {
	console.log(err.message);
}

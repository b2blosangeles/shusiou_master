try {
	var dynamicRouter = React.createClass({		
		getInitialState: function() {
			return {};
		},
		render: function() {
			var me = this;

			return (			
				<div><br/>
					<{me.props.route.route_config.component}/>uu</div>
			);
		}		
	});	
} catch (err) {
	console.log(err.message);
}

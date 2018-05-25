try {
	var dynamicRouter = React.createClass({		
		getInitialState: function() {
			return {};
		},
		render: function() {
			var me = this;

			return (			
				<div>dynamicRouter</div>
			);
		}		
	});	
} catch (err) {
	console.log(err.message);
}

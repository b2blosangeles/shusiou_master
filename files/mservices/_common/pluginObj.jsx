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
			
			me._pluginObj = React.createClass({
			  getInitialState: function() {
			    var me = this;
			    return {niu:new Date().toString()}
			  },
			  render: function() {
			    var me = this;
			    return  (<span>{me.state.niu}</span>)
			  }
			});	

			$.get(url, function(data, status){
				console.log(data);
				me.setState({url : url});
				
			});
			
		},
		render: function() {
			var me = this;
			if (me._pluginObj) {
				var v = new me._pluginObj();
				return  (<span>{v.render()}</span>)
			} else {
				return  (<span>Loading ...</span>)
			}
		}
	});	
} catch (err) {
	console.log(err.message);
}

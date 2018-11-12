try {
	var _pluginObj = React.createClass({
		getInitialState: function() {
			var me = this;
			var url = _node_svr() + '/api/video/pipe_stream.api';
      /*
			if (!_commObj.unicode || _commObj.unicode > 99999) {
				_commObj.unicode = 1;
			} else {
				_commObj.unicode++;
			}	
		//	console.log(_commObj.unicode);
    */
			return {url :  url };
		},	
		render: function() {
			var me = this;
			return  (<span>{me.state.url}</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

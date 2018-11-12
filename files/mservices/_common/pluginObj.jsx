try {
	var _pluginObj = React.createClass({
		getInitialState: function() {
			var me = this;
      /*
			if (!_commObj.unicode || _commObj.unicode > 99999) {
				_commObj.unicode = 1;
			} else {
				_commObj.unicode++;
			}	
		//	console.log(_commObj.unicode);
    */
			return {};
		},	
		render: function() {
				return  (<span>{me.props.obj}</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

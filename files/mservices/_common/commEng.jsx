try {
	var _commEng = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		postData: function() {
			var me = this;
			alert(12356);
			return true;
		},
		componentDidMount:function() {
			var me = this;
			
		},		
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			me.setState({niu:'BBB'});
		//	if (me.props.parent.state.niu != me.props.parent.state.niu) {
				console.log('me.props.parent.state.niu ===>');
				console.log(me.props.parent.state.niu);
		//	}
		//	console.log(me.State);
		//	console.log(prevStat);
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span> -- test {me.props.parent.state.niu} --</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

try {
	var _commEng = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		postData: function() {
			var me = this;
			alert('me.props.parent.state.eng.shift()');
			me.props.parent.setState({eng:me.props.parent.state.eng});
			return true;
		},
		componentDidMount:function() {
			var me = this;
			
		},		
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			if (me.props.parent.state.eng && me.props.parent.state.eng.length) {
				me.postData();
			}
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span> -- test  --</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

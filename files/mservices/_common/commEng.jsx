try {
	var _commEng = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		postData: function() {
			var me = this;
			alert(12356);
			me.props.parent.setState({eng:'BBBc'});
			return true;
		},
		componentDidMount:function() {
			var me = this;
			
		},		
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			if (me.props.parent.state.eng) {
				me.postData();
			}
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span> -- test {me.props.parent.state.eng} --</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

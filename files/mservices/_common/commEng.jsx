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
			me.postData();
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span> -- test 1 --</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

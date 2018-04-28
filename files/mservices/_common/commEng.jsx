try {
	var _commEng = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		postData: function() {
			var me = this;
			alert(123);
			return true;
		},
		componentDidMount:function() {
			var me = this;
			me.postData();
		},		
		componentDidUpdate:function() {
			var me = this;
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span> -- test --</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

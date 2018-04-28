try {
	var _commEng = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		cp: function() {
			let me = this, v = me.props.parent.state.eng.p.shift();
			alert(JSON.stringify(v));
			me.props.parent.setState({eng:me.props.parent.state.eng.p});
			return true;
		},
		componentDidMount:function() {
			var me = this;
			
		},		
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			if (me.props.parent.state.eng && me.props.parent.state.eng.p && me.props.parent.state.eng.p.length) {
				me.cp();
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

try {
	var _commWin = React.createClass({		
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			if (me.props.parent.state.ModalPopup) {
				
				me.setState({ModalPopup:me.props.parent.state.ModalPopup});
				me.props.parent.state({ModalPopup:null});
				alert('me.props.parent.state.ModalPopup');
				//if (!me.state.ModalPopup) {
				//	alert('me.cpCall()');
				//} 
			} 
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span>--niu<ModalPopup parent={me} />--</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

try {
	var _commWin = React.createClass({		
		getInitialState: function() {
			var me = this;
			return {};
		},
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span>niu<ModalPopup parent={me} /></span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

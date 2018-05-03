try {
	var _WinIndex = 0;
	var _commWin = React.createClass({		
		getInitialState: function() {
			_WinIndex = (!_WinIndex || _WinIndex > 10000) ? 1 : (_WinIndex + 1);
			return {id:_WinIndex};
		},
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			if (me.props.parent.state.ModalPopup === 'cancel') {
				me.props.parent.setState({ModalPopup:null});
				//me.render();
				viewpoint.find('.ModalPopup_' + me.state.id).modal('hide');
			} else if (me.props.parent.state.ModalPopup) {
				//me.render();
				viewpoint.find('.ModalPopup_' + me.state.id).modal({backdrop:'static'});
			}			
		},
		closePopup : function() {
			var me = this;
			me.props.parent.setState({ModalPopup:'cancel'});
		},
		callMessage : function() {
			var me = this;
			if ((me.props.parent) && (me.props.parent.state.ModalPopup) && (me.props.parent.state.ModalPopup.messageFn)) {
				return me.props.parent[me.props.parent.state.ModalPopup.messageFn]();;
			} else {
				return ''
			}
		},
		ModalLoadingClass: function() {
			let me = this;	
			return 'modal fade ModalPopup_' + me.state.id;
		},		
		render: function() {
			let me = this, ModalPopup = (me.props.parent.state.ModalPopup) ? me.props.parent.state.ModalPopup : {};
			let box_class = ModalPopup.box_class,
			    box_style=ModalPopup.box_style, 
			    close_icon = (ModalPopup.close_icon) ? '' : 'none',
			    popup_type = ModalPopup.popup_type;
			
			switch(popup_type) {
			    case 'alert':
				return (			
					<div className={me.ModalLoadingClass()} tabindex="-1" role="dialog" aria-hidden="true">  
						<div className="modal-dialog modal-lg" role="document">
							<div className={box_class} style={box_style} role="alert">
								<button type="button" className="close" 
									onClick={me.closePopup.bind(me)}
									style={{display:close_icon}}>
									&times;
								</button>
								{me.callMessage()}
							</div>
						</div>
					</div>	
				);
				break;
			    case 'window':
				return (			
					<div className={me.ModalLoadingClass()} tabindex="-1" role="dialog" aria-hidden="true">
						  <div className="modal-dialog modal-lg" role="document">
							<div className={box_class} style={box_style} role="alert">
								<button type="button" className="close" 
									onClick={me.closePopup.bind(me)}
									style={{display:close_icon, padding:'0.5em'}}>
									&times;
								</button>
								{me.callMessage()}
							</div>
						  </div>
					</div>	
				);
				break;
			    default:
				return (<div className={me.ModalLoadingClass()} tabindex="-1" role="dialog" aria-hidden="true"/> )
			}

		}		
		
	});	
} catch (err) {
	console.log(err.message);
}

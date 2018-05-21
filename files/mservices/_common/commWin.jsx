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
		callSection : function(code) {
			var me = this;
			if ((me.props.parent) && 
			    (me.props.parent.state.ModalPopup) && 
			    (me.props.parent.state.ModalPopup.section) &&
			    (me.props.parent.state.ModalPopup.section[code]) &&
			    (typeof me.props.parent[me.props.parent.state.ModalPopup.section[code]] === 'function')	
			   ) {
				return me.props.parent[me.props.parent.state.ModalPopup.section[code]]();
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
					<div className={me.ModalLoadingClass() + ' alert alert-success'} role="alert">
						<button type="button" className="close" 
							onClick={me.closePopup.bind(me)}
							style={{display:close_icon}}>
							&times;
						</button>						
					  <strong>Well done!</strong> You successfully read this important alert message.
					</div>					

				);
				break;					
			    case 'window':
				return (			
					<div className={me.ModalLoadingClass()} tabindex="-1" role="dialog" aria-hidden="true">
						<div className="modal-dialog modal-lg" role="document">
							<div className={box_class + ' container-fluid'} style={{padding:'0.5em'}}>
								<button type="button" className="close" 
									onClick={me.closePopup.bind(me)}
									style={{display:close_icon}}>
									&times;
								</button>
								{me.callSection('header')}
								{me.callSection('body')}
								{me.callSection('footer')}
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

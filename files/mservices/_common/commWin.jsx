try {
	var _WinIndex = 0;
	var _commWin = React.createClass({		
		getInitialState: function() {
			_WinIndex = (!_WinIndex || _WinIndex> 10000) ? 1 : (_WinIndex + 1);
			return {id : ''};
		},
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			if (me.props.parent.state.ModalPopup === 'cancel') {
				me.props.parent.setState({ModalPopup:null},
					function() {
						viewpoint.find('.ModalPopup_' + me.state.id).modal('hide');
					}
				);
				//me.render();
				
			} else if (me.props.parent.state.ModalPopup) {
				//me.render();
				viewpoint.find('.ModalPopup_' + me.state.id).modal({backdrop:'static'});
			}	
			console.log( me.state.id + '====')
		},
		closePopup : function() {
			var me = this;
			me.props.parent.setState({ModalPopup:'cancel'}, function() {
				viewpoint.find('.ModalPopup_' + me.state.id).modal('hide');
			});
		},		
		ModalLoadingClass: function() {
			let me = this;	
			return 'modal fade ModalPopup_' + me.state.id;
		},		
		render: function() {
			let me = this, ModalPopup = (me.props.parent.state.ModalPopup) ? me.props.parent.state.ModalPopup : null;
			if (!ModalPopup || ModalPopup === 'cancel') 
				return (<div className={me.ModalLoadingClass()} tabindex="-1" role="dialog" aria-hidden="true"/>);
			else {
				var box_class = 'danger', 
				    message = ModalPopup.message, 
				    box_style={}, close_icon = '';
				// close_icon = (me.state.ModalPlus.close_icon === false)?'none':'';
				return(
				<div className={me.ModalLoadingClass()} tabindex="-1" role="dialog" aria-hidden="true">
				  <div className="modal-dialog modal-lg" role="document">
					<div className={'alert alert-' + box_class} style={box_style} role="alert">
						<span dangerouslySetInnerHTML={{__html: message}}></span>
						<button type="button" className="close" 
							onClick={me.closePopup.bind(me)}
							style={{display:close_icon}}>
							&times;
						</button>
					</div>
				  </div>
				</div>		
				);	
			}
		}		
		
	});	
} catch (err) {
	console.log(err.message);
}

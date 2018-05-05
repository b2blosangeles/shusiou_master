try {
	var Embed_curriculum_demo =  React.createClass({
		getInitialState: function() {
			var me = this; 
			return {};
		},	
		componentDidMount:function() {
			var me = this;
			me.lib = new _commLib();
			if (me.props.params.opt == 'new') {
				me.props.parent.getVideoInfo(me.props.params.id,
					function(data) {
						me.props.parent.setState({video:data.data[0]});
					}
				);
			}			
		},
		callEngCbk : function(data) {
			let me = this;
			console.log('====callEngCbk===>');
			console.log(data);
		},
		callEng:function() {
			var me = this;
			me.setState({_eng:{
				i:[
					{url : _master_svr() + '/api/ad/get_default_ad.api', method:'get', data:{}}
				],				
				p:[
				//	{url : _master_svr() + '/api/ad/get_default_ad.api', method:'post', data:{}}
				],
				s:[
				//	{url : _master_svr() + '/api/ad/get_default_ad.api', method:'post', data:{}}
				],
				hold: 0,
				setting: {timeout:30000},
				callbackfn: 'callEngCbk'
				
			}});
		},
		callWin:function() {
			var me = this;
			let data = {message: 
				function() {
					var ta = me;
					return (
						<div style={{padding:'1em'}}>
							<p className="text-dark">
								{ta.state.ModalPopup.message}
							</p>
						</div>
					);
				}
			};
			let lib = new _commLib();
			lib.transferFunction(me, data, arguments.callee.name);
			me.setState({
				ModalPopup:{
					messageFn : arguments.callee.name + '_message',
					box_class : 'modal-content',
					popup_type : 'window',
					close_icon : true,
					message : 'niu window'
				}
			});
		},
		callAlert:function() {
			var me = this;
			let cfg = {
				section: {
					message : function() {
						var ta = me;
						return (
							<div style={{padding:'0.5em'}}>{ta.state.ModalPopup.function.message}----</div>
						);
					}	
				},
				box_class : 'alert alert-success',
				popup_type : 'alert',
				close_icon : true,
				message : 'niu bi'
			};
			me.lib.buildPopup(me, cfg);
			/*
			me.setState({
				ModalPopup:{
					messageFn : arguments.callee.name + '_message',
					box_class : 'alert alert-success',
					popup_type : 'alert',
					close_icon : true,
					message : 'niu bi'
				}
			});
			*/
		},		
		render: function() {
			var me = this;

			if ((me.props.params.id) && (me.props.parent.state.curriculum)) {
				return (<div>Embed_curriculum_demo : 
						[<a onClick={me.callEng.bind(me)}>Load Data</a>]
						&nbsp;-&nbsp;
						[<a onClick={me.callAlert.bind(me)}>popup Alert</a>]
						&nbsp;-&nbsp;
						[<a onClick={me.callWin.bind(me)}>popup Window</a>]
						<_commWin parent={me} />
						<_commEng parent={me} />
						
						<h4>{me.props.parent.state.video.title}</h4>	
						<p><b>Video ID</b>:{me.props.parent.state.curriculum.vid}</p>  
						<p><b>Video Length</b>:({me.props.parent.state.curriculum.video_length} Secs)</p>
						<br/>
						<_commObj code={'video'} data={{rec:me.props.parent.state.curriculum, 
								ss:90, t:10, size:320}}/>
						<br/>
						<_commObj code={'videoImage'}  data={{rec:me.props.parent.state.curriculum, 
							ss:90, size:180}}/>
						<_commObj code={'videoImage'}  data={{rec:me.props.parent.state.curriculum, 
							ss:190, size:180}}/>
						<_commObj code={'videoImage'}  data={{rec:me.props.parent.state.curriculum, 
							ss:290, size:180}}/>
					
					</div>)
			} else {
				return (<div>Embed_curriculum_preview 2</div>)
			}
		}
	});
	
	
} catch (err) {
	console.log(err.message);
}

try {
	var _commVoiceAI = React.createClass({
		getInitialState: function() {
			var me = this;	
			return {};
		},
		componentWillUnmount : function() {
			let me = this;
		},	
		componentDidUpdate:function(preProps, preState) {
			let me = this;
			console.log(me.props.parent.voiceObj + '===' + preProps.voiceObj);
		},
		componentDidMount:function() {
			let me = this;
			let MOVL = 10,
			    movl = 0;			
			let prog = me.props.parent.state.VoiceObj;
			if (!prog) return true;
			let  s = Math.ceil(new Date().getTime() * 0.001), t = 0, locked = 0;

			let _itv = setInterval(function(){ 
				if (Math.ceil(new Date().getTime() * 0.001) - s < 1) {
					return true;
				} else {
					s = Math.ceil(new Date().getTime() * 0.001);
				}
				if (!me.state.locked) {
					t++;
					if (Object.keys(prog).indexOf(t.toString()) === -1) {
						if (t > MOVL) {
							console.log(' === Game Over=== ');
							clearInterval(_itv);
							Root.lib.playTTS([{
								text: 'Good job, nice job, thank you',
								lang : 'en-US'							
								}], function() {
							});						
						} else {
							console.log('===componentDidMount===> ' + t);
						}
					} else {
						me.setState({locked : true});

						Root.lib.playTTS(prog[t.toString()], function() {
							me.setState({locked : false});
						});

						console.log(' locked --> ' + t.toString());
					}
				}

			}, 100);			
			return true;
		},
		render: function() {
			let me = this;
			return (<span></span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

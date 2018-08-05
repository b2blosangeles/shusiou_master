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
			if (me.props.voiceObj != preProps.voiceObj) {
				me.playVoiceAI();
			}
		},
		componentDidMount:function() {
			let me = this;
		},
		playVoiceAI : function() {
			let me = this;
			let MOVL = 10,
			    movl = 0;			
			let prog = me.props.parent.state.voiceObj;
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
							me.playTTS([{
								text: 'Good job, nice job, thank you',
								lang : 'en-US'							
								}], function() {
							});						
						} else {
							console.log('===componentDidMount===> ' + t);
						}
					} else {
						me.setState({locked : true});

						me.playTTS(prog[t.toString()], function() {
							me.setState({locked : false});
						});

						console.log(' locked --> ' + t.toString());
					}
				}

			}, 100);			
			return true;
		},
		voiceRecong : function(recs, cbk) {
			alert('JSON.stringify(recs)');
			cbk();
		},
		playTTS : function(Q, cbk) {
			let me = this;
			var data = Q[0];
			if (!data) {
				cbk();
				return true;
			} else {
				if (data.text) {
					var Q1 = data.text.split(/\,|\;|\.|\?/).filter(function(n){ return n.replace(/^\s+|\s+$/gm,'') != '' });
					if (Q1.length > 1) {
						Q.shift();
						for (let i = 0; i < Q1.length; i++) {
							Q.unshift({text:Q1[Q1.length - i - 1], lang:data.lang});
						}
						me.playTTS(Q, cbk);
					} else {

						$('audio').attr('src', _master_svr() + '/api/tts/google.api?str='+data.text + '&lang=' + data.lang).attr('autoplay', true);
						$("audio").unbind('ended').bind("ended", function() {
							Q.shift();
							if (Q.length) {
								// me.playTTS(Q, cbk);

								setTimeout(
									function() { me.playTTS(Q, cbk); }, 500
								)
							} else {
								$("audio").unbind('ended');
								cbk();
							}
						});
					}
				} else {
					me.voiceRecong(data, cbk)
				}			
			}
		},
		render: function() {
			let me = this;
			return (<span></span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

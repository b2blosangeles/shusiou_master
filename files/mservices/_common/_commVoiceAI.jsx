try {
	var _commVoiceAI = React.createClass({
		getInitialState: function() {
			var me = this;	
			return {};
		},
		componentWillUnmount : function() {
			let me = this;
			clearInterval(me._itv);
			me._stopplay = true;
			me.setState({locked : false});
		},	
		componentDidUpdate:function(preProps, preState) {
			let me = this;
			if (me.state.pingbo !== Root.state.pingbo) {
				me.setState({pingbo : Root.state.pingbo});
			}
			if ((me.state.pingbo) && me.state.pingbo !== preState.pingbo) {
				if (me.props.voiceObj) {
					let vid = document.getElementById("myVideo"); 
					vid.ontimeupdate = function() {
						console.log(vid.currentTime);	
					}
					vid.play();
					me.playVoiceAI();
				}
			}
			console.log('Root.state.stream ->' + Root.state.stream);
		},
		componentDidMount:function() {
			let me = this;
		},
		playVoiceAI : function() {
			let me = this;
			let MOVL = 10,
			    movl = 0;	
			me._stopplay = false;
			
			let prog = JSON.parse(JSON.stringify(me.props.parent.state.voiceObj));
			if (!prog) return true;
			
			let  s = Math.ceil(new Date().getTime() * 0.001), t = 0, locked = 0;

			me._itv = setInterval(function(){ 
				if (!me.state.pingbo || me._stopplay) {
					clearInterval(me._itv);
					me.state.locked = false;
					return true;
				}				
				if (Math.ceil(new Date().getTime() * 0.001) - s < 1) {
					return true;
				} else {
					s = Math.ceil(new Date().getTime() * 0.001);
				}
				Root.setState({stream : t});
				if (!me.state.locked) {
					t++;
					if (Object.keys(prog).indexOf(t.toString()) === -1) {
						if (t > MOVL) {
							clearInterval(me._itv);
							me.playTTS([{
								tts: 'stream finished, thank you',
								lang : 'en-US'							
								}], function() {
							});
							me._stopplay = true;
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
		playTTS : function(Q, cbk) {
			let me = this;
			var data = Q[0];
			if (me._stopplay) return true;
			if (!data) {
				cbk();
				return true;
			} else {
				if (data.tts) {
					var Q1 = data.tts.split(/\,|\;|\.|\?/).filter(function(n){ return n.replace(/^\s+|\s+$/gm,'') != '' });
					if (Q1.length > 1) {
						Q.shift();
						for (let i = 0; i < Q1.length; i++) {
							Q.unshift({tts:Q1[Q1.length - i - 1], lang:data.lang});
						}
						me.playTTS(Q, cbk);
					} else {
						$('audio').attr('src', _master_svr() + '/api/tts/google.api?str='+data.tts + '&lang=' + data.lang).attr('autoplay', true);
						$("audio").unbind('ended').bind("ended", function() {
							Q.shift();
							if (Q.length) {
								setTimeout(
									function() { me.playTTS(Q, cbk); }, 300
								)
							} else {
								$("audio").unbind('ended');
								cbk();
							}
						});
					}
				} else if (data.sp) { 
					me.props.parent._voiceRecong = function(data) {
						me.playTTS([{
							tts: data.cmd,
							lang : 'en-US'							
							}], function() {
						});
					}
					Root.qna_server.sendToClient({cmd:'voiceRecong',voiceRecong: data.sp}, 
						Root.state.pingbo);					
				} else {
					//me.voiceRecong(data, cbk)
				}			
			}
		},
		render: function() {
			let me = this;
			return (<span><_commPingbo parent={me.props.parent} parking={me} /></span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

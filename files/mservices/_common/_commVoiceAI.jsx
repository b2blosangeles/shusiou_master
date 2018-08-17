try {
	var _commVoiceAI = React.createClass({
		getInitialState: function() {
			var me = this;	
			return {currentText:''};
		},
		componentWillUnmount : function() {
			let me = this;
			clearInterval(me._itv);
			me._stopplay = true;
			me.setState({locked : false});
			me.vid.pause();
		},	
		componentDidUpdate:function(preProps, preState) {
			let me = this;
			if (me.state.pingbo !== Root.state.pingbo) {
				me.setState({pingbo : Root.state.pingbo});
			}
			if ((me.state.pingbo) && me.state.pingbo !== preState.pingbo) {
				if (me.props.voiceObj) {

					me.vid.pause(); 
					me.vid.currentTime = 0;
					me.vid.play();
					// me.playVoiceAI();
				}
			}
			if (Root.state.stream !== me.state.stream) {
				me.setState({stream : Math.floor(Root.state.stream)});
			}
			if (me.state.stream !== preState.stream) {
				me.playVoiceAIUnit(me.state.stream);
				console.log('Root.state.stream ->' + me.state.stream);
			}
		},
		componentDidMount:function() {
			let me = this;
			setTimeout(me.start);
			me.vid = document.getElementById("myVideo"); 
			me.vid.ontimeupdate = function(){
				if (Math.floor(me.vid.currentTime) === 0) {
					me.start();
				}
				Root.setState({stream : Math.floor(me.vid.currentTime)});
			};
		},
		isSpeachRecongnise : function() {
			let me = this, script = me.props.parent.state.voiceObj;
			if (script) {
				for (var o in script) {
					if (script[o].sp) {
						return true;
					}
				}
			} else {
				return false;
			}
		},
		start() {
			let me = this;
			me.prog = JSON.parse(JSON.stringify(me.props.parent.state.voiceObj));
			console.log('isSpeachRecongnise===>' + me.isSpeachRecongnise())
		},
		holdVideo : function() {
			let me = this;
			me.vid.pause(); 
		},
		playVideo : function(nextPoint) {
			let me = this;
			me.vid.currentTime = (nextPoint) ? (nextPoint + 1) : 0;
			me.vid.play(); 
		},
		playVoiceAIUnit : function(t) {
			let me = this;
			if (Object.keys(me.prog).indexOf(t.toString()) !== -1) {
				me.setState({locked : true});
				me.holdVideo();
				console.log(me.prog[t.toString()]);
				me.playTTS(me.prog[t.toString()], function() {
					me.setState({locked : false});
					
					if (Object.keys(me.prog).length === 1) {
						me.playTTS([{
							tts: 'stream finished, continue enjoy the video, thank you',
							lang : 'en-US'							
						}], function() {
							delete me.prog[t.toString()];
							me.playVideo(t);
							// me._stopplay = true;
						});						
					} else {
						delete me.prog[t.toString()];
						me.playVideo(t);
					}
				});
			}
		},		
		playVoiceAI : function() {
			let me = this;
				
			me._stopplay = false;
			
			let prog = JSON.parse(JSON.stringify(me.props.parent.state.voiceObj));
			if (!prog) return true;
			
			let  s = Math.ceil(new Date().getTime() * 0.001), t = 0, locked = 0;

			me._itv = setInterval(function(){ 
				if (!me.state.pingbo || me._stopplay) {
					clearInterval(me._itv);
					me.state.locked = false;
					me.holdVideo();
					return true;
				}				
				if (Math.ceil(new Date().getTime() * 0.001) - s < 1) {
					return true;
				} else {
					s = Math.ceil(new Date().getTime() * 0.001);
				}
				if (!me.state.locked) {
					t++;
					me.playVoiceAIUnit(t);
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
						me.setState({currentText : data.tts});
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
							cbk();
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
			return (<span><_commPingbo parent={me.props.parent} parking={me} />
					<br/>{me.state.currentText}<br/>
					<video id="myVideo" width="320" height="240" controls>
						<source src="http://node1.service.dev.shusiou.win/api/video/pipe_stream.api?space=https://shusiouwin-dev-1.s3.wasabisys.com/&video_fn=1808090000000001" type="video/mp4"/>
					</video>
					<br/>
					<a>start</a> <a>stop</a>
				</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

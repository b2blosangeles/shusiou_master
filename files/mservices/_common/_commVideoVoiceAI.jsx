try {
	var _commVideoVoiceAI = React.createClass({
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
				if (me.vid) {
					me.vid.pause(); 
					me.vid.currentTime = 0;
					me.vid.play();
				}
			}
			if (Root.state.timeLine !== me.state.timeLine) {
				me.setState({timeLine : Root.state.timeLine});
			}
			if (me.state.timeLine !== preState.timeLine) {
				me.playVoiceAIUnit(me.state.timeLine);
			}
		},
		componentDidMount:function() {
			let me = this;
			setTimeout(me.start, 1000);
			
			/* --- commnucation io ---*/
			me._p = new _PINGBALL_('p');
			
			let comm_svr = _comm_svr().replace(/^\/\//, '');
			me._p.init({ 
				link : '//' + comm_svr + '/',
				onConnect : function(socket) {
					me.comm_room = socket.id + '_' + new Date().getTime();
					me._p.sendToRoom(me.comm_room, null, function(data) {
						me.setState({commlink:'/api/IframPlugin.api?code=SR&commlink=' + comm_svr + '&room=' + me.comm_room});
					});
				}, 
				onClientMessage : function(incomeData) {
					console.log('---onClientMessage--->');
					console.log(incomeData);
				}
			});

		},
		isSpeachRecongnise : function() {
			let me = this, script = me.props.parent.state.script;
			function SR(script) {
				if (typeof script === 'object') {
					for (var o in script) {
						if ((script.sp) || (SR(script[o]))) return true;
					}
				} 		
			}
			return (SR(script)) ? true : false;
		},
		setVideoEvent : function() {
			let me = this;
			me.vidObj = $('#' + me.vboxid); 
			me.vid = me.vidObj[0];
			me.vidObj.attr("src", me.props.parent.state.videoUrl);
			me.vid.ontimeupdate = function(){
				let v = Math.floor(me.vid.currentTime * 2) * 0.5;
				if (Root.state.timeLine !== v) {
					Root.setState({timeLine : v});
				}
			};
			me.playVideo(0);		
		},
		start: function() {
			let me = this;
			me.script = me.props.parent.state.script;
			me.afterScript = me.props.parent.state.afterScript;
			me.timeLine = {}
			if (!me.props.parent.state.videoUrl) {
				Object.keys(me.script).filter(function(v) { return !isNaN(v); })
					.sort(function(a, b) { return parseFloat(a) > parseFloat(b)})
					.map(function(v, idx) { me.timeLine[idx.toString()] = me.script[v];});
				me.UIschedule();
				return true;
			} else {
				me.timeLine = {}
				Object.keys(me.script).filter(function(v) { return !isNaN(v); })
					.sort(function(a, b) { return parseFloat(a) > parseFloat(b)})
					.map(function(v) { 
						me.timeLine[(Math.floor(parseFloat(v) * 2) * 0.5).toString()] = me.script[v];});
				me.vboxid = 'main_video_' + new Date().getTime();
				if (typeof me.props.parent.state.videoSetting === 'object') {
					me.setState({videoSetting : me.props.parent.state.videoSetting, vboxid : me.vboxid}, me.setVideoEvent);
				} else {
					me.setState({videoSetting : null, vboxid : null});
					$('.content_bg').html('<video src="" id="' + me.vboxid + '"></video>');
					me.setVideoEvent();
				}
			}
		},
		holdVideo : function() {
			let me = this;
			me.vid.pause(); 
		},
		playVideo : function(t, length) {
			let me = this;
			me.vid.currentTime = t + ((length) ? length : 0);
			me.vid.play(); 
		},
		videoStatus: function() {
			let me = this;
			if (!Root.state.pingbo && (me.isSpeachRecongnise()) && (me.vid)) me.vid.pause();
			return (!me.vid || (!Root.state.pingbo && (me.isSpeachRecongnise()))) ? {display:'none'} : {display:null}
		},
		videoBox: function() {
			var me = this;
			if (!me.state.vboxid || !me.state.videoSetting) return (<span></span>)
			else return (<video src="" id={me.state.vboxid}  
					     width={(me.state.videoSetting.width) ? me.state.videoSetting.width : 320} 
					     height={(me.state.videoSetting.height) ? me.state.videoSetting.height : 240}  
					     controls>
				</video>)
		},		
		playVoiceAIUnit : function(t) {
			let me = this;
			if (Object.keys(me.timeLine).indexOf(t.toString()) !== -1) {
				me.setState({locked : true});
				if (me.vid) me.holdVideo();
				me.playTTS(me.timeLine[t.toString()], function() {
					me.setState({locked : false, currentText:null});
					
					if (Object.keys(me.timeLine).length === 1 && (me.afterScript)) {
						if (me.afterScript.tts) {
							me.playTTS([{
								tts: me.afterScript.tts,
								lang : me.afterScript.lang							
							}], function() {
								me.setState({currentText:null});
								delete me.timeLine[t.toString()];
								if ((me.vid)  && (me.afterScript.continuePlay))  me.playVideo(t);
							});
						} else {
							delete me.timeLine[t.toString()];
							if ((me.vid)  && (me.afterScript.continuePlay))  me.playVideo(t);				
						}
					} else {
						delete me.timeLine[t.toString()];
						if (me.vid) me.playVideo(t);
					}
				});
			}
		},		
		UIschedule : function() {
			let me = this;
			me._stopplay = false;
			if (Object.keys(me.timeLine).length) {
				Root.setState({timeLine : Object.keys(me.timeLine)[0]});
				setTimeout(me.UIschedule, 2000);
			}
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
									function() { me.playTTS(Q, cbk); }, 500
								)
							} else {
								$("audio").unbind('ended');
								cbk();
							}
						});
					}
				} else if (data.sr) { 
					me._p.sendToRoom(me.comm_room, {SR: data.sr}, function(data) {});
					me.props.parent._voiceRecong = function(data) {
						me.playTTS([{
							tts: data.cmd,
							lang : 'en-US'							
							}], function() {
							cbk();
						});
					}
					/*
					Root.qna_server.sendToClient({cmd:'voiceRecong',voiceRecong: data.sp}, 
						Root.state.pingbo);	
						*/
				} else {
					//me.voiceRecong(data, cbk)
				}			
			}
		},
		showSection : function() {
			let me = this;
			// if (!me.state.currentText && !me.isSpeachRecongnise()) {
			if (!me.state.currentText) {
				return {display: 'none', 'min-height': '80px'}
			} else {
				return {display: '', 'min-height': '80px'}
			}
		},
		render: function() {
			let me = this;
			return (<span><iframe className="pingball" src={me.state.commlink}></iframe>
					<div className="overlayer_box" style={me.showSection()}>
						{/*<_commPingbo parent={me.props.parent} parking={me} />*/}
						<h3>{me.state.currentText}</h3>
						{me.videoBox()}
						{/*me.microPhone()*/}							
					</div>
				</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

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
			Root.setState({main_video : 'main_video_' + new Date().getTime()});
			setTimeout(me.start);
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
		start() {
			let me = this;
			if (!me.props.parent.state.videoUrl) {
				me.script = JSON.parse(JSON.stringify(me.props.parent.state.script));
				me.UIschedule();
				return true;
			} else {
				me.script = JSON.parse(JSON.stringify(me.props.parent.state.script));
				me.vidObj = $('#' + Root.state.main_video); 
				me.vid = me.vidObj[0];
				me.vidObj.attr("src", me.props.parent.state.videoUrl);
				me.vid.ontimeupdate = function(){
					Root.setState({stream : Math.floor(me.vid.currentTime)});
				};
				me.playVideo(0);
				/* console.log('isSpeachRecongnise=--==>' + me.isSpeachRecongnise()) */
			}
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
		channelComm : function() {
			let me = this;
			if (!Root.state.pingbo_id) return true;
			// let url = "https://comm1.service.dev.shusiou.win/?room=CRON_REPORT_A";
			let url = 'https://comm1.service.dev.shusiou.win/?socket=' + Root.state.pingbo_id;
			Root.lib.positionedPopup(url, '','280','280','0','0','yes');
		},
		microPhone: function() {
			var me = this;
			return (!Root.state.pingbo && (me.isSpeachRecongnise())) ?
			(<span><i className="fa fa-microphone status_off" onClick={me.channelComm.bind(me)}
				aria-hidden="true" style={{"font-size":"5em"}}></i></span>) : 
			(<span>			
			</span>)
		},
		videoStatus: function() {
			let me = this;
			if (!Root.state.pingbo && (me.isSpeachRecongnise()) && (me.vid)) me.vid.pause();
			return (!me.vid || (!Root.state.pingbo && (me.isSpeachRecongnise()))) ? {display:'none'} : {display:null}
		},
		videoBox: function() {
			var me = this;
			return (<div className="content_bg">
				<video src="" id={Root.state.main_video} controls>
					
				</video>
				</div>)
		},
		videoBox1: function() {
			var me = this;
			/*
			return (<div className="content_bg">
				<video src="" id={me.state.main_video} width="320" height="240" controls style={me.videoStatus()}>
					
				</video>
				</div>)*/
			
			return (<video src="" id={me.state.main_video} width="320" height="240" controls style={me.videoStatus()}>
				{/*<source src={me.video} type="video/mp4"/>*/}	
			</video>) 
		},		
		playVoiceAIUnit : function(t) {
			let me = this;
			if (Object.keys(me.script).indexOf(t.toString()) !== -1) {
				me.setState({locked : true});
				if (me.vid) me.holdVideo();
				console.log(me.script[t.toString()]);
				me.playTTS(me.script[t.toString()], function() {
					me.setState({locked : false});
					
					if (Object.keys(me.script).length === 1) {
						if (!me.vid) {
							me._stopplay = true;
						} else {
							me.playTTS([{
								tts: 'stream finished, continue enjoy the video, thank you',
								lang : 'en-US'							
							}], function() {
								delete me.script[t.toString()];
								if (me.vid) me.playVideo(t);
							});
						}
					} else {
						delete me.script[t.toString()];
						if (me.vid) me.playVideo(t);
					}
				});
			}
		},		
		UIschedule : function() {
			let me = this;
			console.log('UIschedule 1');
			//return true;
			me._stopplay = false;
			
			let  s = Math.ceil(new Date().getTime() * 0.001), t = 0, locked = 0;

			me._itv = setInterval(function(){ 
				console.log('UIschedule 2');
				if (me._stopplay) {
					clearInterval(me._itv);
					me.state.locked = false;
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
					<br/>{me.state.currentText}
					<br/>
					{/*me.videoBox()*/}
					<br/>
					{me.microPhone()}							
					<br/><br/>
					<a>start</a> <a>stop</a>
				</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

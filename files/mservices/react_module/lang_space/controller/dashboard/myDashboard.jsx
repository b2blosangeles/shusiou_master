try {	
    var MyDashboard =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {list:[], text:{}, audioChannel: null, pingbo: '', socket_id:'', commData:'', locked: false};
        },
	dictionary:function(v) {
		if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
		return this.props.route.env.dictionary(v);
	},
	getCurrentLanguage: function() {
		return this.props.route.env.getCurrentLanguage();	
	},
	getText:function(v) {
		return this.state.text[this.getCurrentLanguage() + '/home_page/'+v];
	},
	textStyle:function() {
		var me = this;
		if (me.props.route.env.state.Breakpoint == 'sm' || me.props.route.env.state.Breakpoint == 'sx') {
			return {'font-size':'0.8em'}
		} else {
			return {'font-size':'1em'}	
		}
	},
	channelComm : function() {
		let me = this;
		if (!Root.state.pingbo_id) return true;
		// let url = "https://comm1.service.dev.shusiou.win/?room=CRON_REPORT_A";
		let url = 'https://comm1.service.dev.shusiou.win/?socket=' + Root.state.pingbo_id;
		Root.lib.positionedPopup(url, '','180','180','0','0','yes');
	}, 
	componentWillUnmount : function() {
		let me = this;
	},
        componentDidUpdate:function(prePropos, preState) {
		let me = this;
		return true;
        },
        componentDidMount:function() {
		let me = this;
		console.log('===comein ===');
		// https://cloud.google.com/speech-to-text/docs/languages
		// VoiceObj
		me.servicePush = {
			'good' : function() {
				alert('good');
			},
			'nice' : function() {
				alert('nice');
			}
		}		
		
		me.setState({voiceObj : {'2' : [{
				text: '深圳打响楼市个人限卖.第一枪',
				lang : 'cmn-Hans-CN'
			},{
				text: '中国,已安排最先进的海洋救助船',
				lang : 'cmn-Hans-CN'
			},{
				rc: 'good',
				lang : 'en-US'
			}
			], 
			'4' : [{
				text: '中央定调下半年中国经济',
				lang : 'cmn-Hans-CN'			
			}], 
			'6' : [{
				text: 'listen',
				lang : 'en-US'			
			}], 
			'8' : [{
				text: '稳中有变',
				lang : 'cmn-Hans-CN'			
			}]},
			pingbo_service: ['good', 'nice'],
			voiceObj_tm : new Date().getTime()	    
		});
		

		return true;
        },
	sendPP : function() {
		var me = this;
			//if (me.props.parent.state.pingbo_service) {
				Root.qna_server.sendToServer({cmd:'voiceRecong', data:me. state.pingbo_service});
				console.log('===serverPush>>>1===');
				//me.props.parent.setState({serverPush : null});
			//}	
	},
	releaseHold : function(data) {
		var me = this;
		me.setState({locked : false});
		return (data === 'string') ? data : JSON.stringify(data);
	},
	good: function(data) {
		console.log('===good===>');
		console.log(data);
	},
        render: function() {
            var me = this;
	    if (!me.state.pingbo) {
		    return (<div className="content_section">
				<br/>
				<div className="container">
					<div className="col-sm-12 col-lg-12 col-md-12"> 
					<div className="overlayer_box">
						{/*<_commPingbo parent={me}/>*/}
						<_commVoiceAI parent={me} voiceObj={me.state.voiceObj_tm}/>
						
						<h4 className="header" >{me.dictionary('Warning')}</h4> 
						<p> <a href="JavaScript:void(0)" onClick={me.channelComm.bind(me)}
							    className="btn btn-md btn-success bottom-adjust" >
								{me.dictionary('Open Security Voice Channel')}</a>
						</p>
						
						 <a href="JavaScript:void(0)" 
								    onClick={me.sendPP.bind(me,['good', 'nice', 'test'])}
								    className="btn btn-md btn-warning" >
									{me.dictionary('start')}</a>
						
						<i className="fa fa-microphone status_off" onClick={me.channelComm.bind(me)}
								aria-hidden="true" style={{"font-size":"5em"}}></i><br/><br/>
					</div>	
					</div>					
				</div> 
				<div className="content_bg"></div>
				     {Root.lib.landingModal(me)}
				
			</div>)
	    } else {
		    return (<div className="content_section">
				<br/>
				<div className="container">
					<div className="col-sm-4 col-lg-4 col-md-4"> 
						<div className="overlayer_box">
							{/*<_commPingbo parent={me} />*/}					
							<_commVoiceAI parent={me} voiceObj={me.state.voiceObj_tm}/>
							<h4 className="header">{me.dictionary('Private')}</h4>
							 <a href="JavaScript:void(0)" 
								    onClick={me.sendPP.bind(me,['good', 'nice', 'test'])}
								    className="btn btn-md btn-warning" >
									{me.dictionary('start')}</a>
						</div>	
					</div>					
				</div> 
				<div className="content_bg">
					<video src="" className="align-middle" muted></video>
				</div>
				    {Root.lib.landingModal(me)}
			</div>)
		}
	}});	
} catch (err) {
	  console.log(err.message);
}

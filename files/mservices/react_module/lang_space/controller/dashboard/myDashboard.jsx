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
	serverPush: function(data) {
		let me = this;
		console.log(data);
		me.setState({serverPush:data});
		/*
		let cfg = {
			section: {
				body : function() {
					let ta = me, popid = new Date().getTime();
					return (
					<span>test</span>
					);
				}
			},
			box_class : 'modal-content',
			popup_type : 'window',
			close_icon : true
		};
		Root.lib.popupWin(me, cfg);
		*/
	},
	channelComm : function() {
		let me = this;
		if (!me.state.socket_id) return true;
		// let url = "https://comm1.service.dev.shusiou.win/?room=CRON_REPORT_A";
		let url = 'https://comm1.service.dev.shusiou.win/?socket=' + me.state.socket_id;
		Root.lib.positionedPopup(url, '','180','180','0','0','yes');
	}, 
	componentWillUnmount : function() {
		let me = this;
	},

        componentDidMount:function() {
		let me = this;
		let MOVL = 10,
		    movl = 0;
		// https://cloud.google.com/speech-to-text/docs/languages
		let prog = {'2' : [{
				text: '深圳打响楼市个人限卖第一枪',
				lang : 'cmn-Hans-CN'
			},{
				text: '中国已安排最先进的海洋救助船',
				lang : 'cmn-Hans-CN'
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
			}]};
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
							text: 'Good job',
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
	releaseHold : function(data) {
		var me = this;
		me.setState({locked : false});
		return (data === 'string') ? data : JSON.stringify(data);
	},
	renderA: function() {
		var me = this;
		return (<span>{me.render0()}==={/*Root.lib.landingModal(me)*/}</span>)
	},
        render: function() {
            var me = this;
	    if (!me.state.pingbo) {
		    return (<div className="content_section">
				<br/>
				<div className="container">
					<div className="col-sm-12 col-lg-12 col-md-12"> 
					<div className="overlayer_box">
						<_commPingbo parent={me}/>
						
						<h4 className="header" >{me.dictionary('Warning')}</h4> 
						<p> <a href="JavaScript:void(0)" onClick={me.channelComm.bind(me)}
							    className="btn btn-md btn-success bottom-adjust" >
								{me.dictionary('Open Security Voice Channel')}</a>
						</p>
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
							<_commPingbo parent={me} />						
							
							<h4 className="header">{me.dictionary('Private')}</h4>
							 <a href="JavaScript:void(0)" 
								    onClick={me.serverPush.bind(me,['good', 'nice', 'test'])}
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

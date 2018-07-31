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
	playAudio: function(data) {
		$('audio').attr('src', _master_svr() + '/api/tts/google.api?str='+data.text + '&lang=' + data.lang).attr('autoplay', true);
	},
        componentDidMount:function() {
		let me = this;
		let MOVL = 260,
		    movl = 0;
		let prog = [30, 80, 189];
		let  s = Math.ceil(new Date().getTime() * 0.001), t = 0, locked = 0;
		
		me.playAudio({
			text: '曲线救国，也许印度中国药业上去了，美国药价也能下来。穷人吃外国药，富人愿意多掏钱可以吃美国药。一样可以叫全民保险。',
			lang : 'cmn-Hans-CN'
		});
		
		let _itv = setInterval(function(){ 
			if (Math.ceil(new Date().getTime() * 0.001) - s < 1) {
				return true;
			} else {
				s = Math.ceil(new Date().getTime() * 0.001);
			}
			if (!me.state.locked) {
				t++;
				if (prog.indexOf(t) === -1) {
					if (t > MOVL) {
						console.log(' === Game Over=== ');
						clearInterval(_itv);
					} else {
					//	console.log('===componentDidMount===> ' + t);
					}
				} else {
					me.setState({locked : true});
					console.log(' locked => ' + t);
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

try {	
    var MyDashboard =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {list:[], text:{}, audioChannel: null, pingbo: '', socket_id:'', commData:''};
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
	sendCMD: function(code) {
		let me = this;
		me.qna_server.sendToClient({cmd:code, dt:new Date()}, me.qna_server.getClients()[0]);
	},
	channelComm : function() {
		let me = this;
		if (!me.state.socket_id) return true;
		// let url = "https://comm1.service.dev.shusiou.win/?room=CRON_REPORT_A";
		let url = 'https://comm1.service.dev.shusiou.win/?socket=' + me.state.socket_id;
		Root.lib.positionedPopup(url, '','180','180','0','0','yes');
	},
	_commPingbo : function() {
		let me = this;
		return (me.state.refreshComm)?(<span/>):(<_commPingbo parent={me} />)
	}, 
	componentWillUnmount : function() {
		let me = this;
		me.setState({refreshComm:true});
	},	    
        componentDidMount:function() {
		let me = this;
		return true;
        },
        render: function() {
            var me = this;
	    if (!me.state.pingbo) {
		    return (<div className="content_section">
				<br/>
				<div className="container">
					<div className="col-sm-12 col-lg-12 col-md-12"> 
					<div className="overlayer_box">
						{me._commPingbo()}
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
			</div>)
	    } else {
		    return (<div className="content_section">
				<br/>
				<div className="container">
					<div className="col-sm-4 col-lg-4 col-md-4"> 
						<div className="overlayer_box">
							{me._commPingbo()}
							<h4 className="header">{me.dictionary('Private')}
								<br/>
								
							{/*(me.state.audioClient.data) ? 
							(me.state.audioClient.data + new Date().getTime()) : ''*/}
							</h4> 
							<p className="overlayer_box_body"  style={me.textStyle()}
								dangerouslySetInnerHTML={{__html: me.getText('how_to_study')}} />
							<p> <a href="JavaScript:void(0)" 
								    onClick={me.sendCMD.bind(me,'start')}
								    className="btn btn-md btn-warning bottom-adjust" >
									{me.dictionary('start')}</a>
							</p>
						</div>	
					</div>					
				</div> 
				<div className="content_bg">
					<video src="" className="align-middle" muted></video>
				</div>
			</div>)
		}
	}});	
} catch (err) {
	  console.log(err.message);
}

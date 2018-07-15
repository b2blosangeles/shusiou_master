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
	serverPush: function(data) {
		let me = this;
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
		return true;
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
								    onClick={me.serverPush.bind(me,['good', 'nice'])}
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

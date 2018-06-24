try {	
    var MyDashboard =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {list:[], text:{}};
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
	playVideo: function() {
	},
	channel : function(socket) {
		let me = this,
		    _link = 'http://comm1.service.dev.shusiou.win/',
		    _proxy = ['https://comm1.service.dev.shusiou.win/'];
		console.log('socket.id--' + socket.id);
		setInterval(function() {
			// socket.emit('clientData', {_room: 'CRON_REPORT_A', 
			 socket.emit('clientData', {_socket: socket.id,
				_link: _link, _proxy: _proxy, 
				data: {command: 'stop audio', sender:socket.id}});
				// data: {command: 'stop audio', sender:socket.id}});
		}, 6000);	
	},
        componentDidUpdate:function(preProps, preState) {
        },	    
        componentDidMount:function() {
		let me = this;
		Root.lib.loadSocketIO(me, {
			resource: 'http://comm1.service.dev.shusiou.win/',
			// publicId : 'CRON_REPORT_A', 
			// room:'CRON_REPORT_A',
			onServerData : function(incomeData, socket) {
			//	if (incomeData.data.sender ===  socket.id) {
			//		return true;
			//	}
			//	me.channel(socket.id);
				console.log(incomeData.data);
				console.log('onServerData  ===> ' + socket.id);
			},
			onConnection : function(socket) {				
				me.channel(socket);
			}
			/*,
			onServerMessage: function(data) {
					console.log('message coming!--' + me.rr);
			}*/
		});

		return true;
        },
        render: function() {
            var me = this;
            return (<div className="content_section">
			<br/>
			<div className="container">

				<div className="col-sm-4 col-lg-4 col-md-4"> 
					<div className="overlayer_box">
						<h4 className="header">{me.dictionary('public')}</h4> 
						<p className="overlayer_box_body" style={me.textStyle()}
							dangerouslySetInnerHTML={{__html: me.getText('what_to_study')}} />
						<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:1})}
							    className="btn btn-md btn-danger bottom-adjust" >
								{me.dictionary('more_detail')}</a>									
						</p>
					</div>	
				</div>

				<div className="col-sm-4 col-lg-4 col-md-4"> 
					<div className="overlayer_box">
						<h4 className="header">{me.dictionary('Private')}</h4> 
						<p className="overlayer_box_body"  style={me.textStyle()}
							dangerouslySetInnerHTML={{__html: me.getText('how_to_study')}} />
						<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:2})}
							    className="btn btn-md btn-warning bottom-adjust" >
								{me.dictionary('more_detail')}</a>
						</p>
					</div>	
				</div>

				<div className="col-sm-4 col-lg-4 col-md-4"> 
					<div className="overlayer_box">
						<h4 className="header">{me.dictionary('Finance')}</h4> 
						<p className="overlayer_box_body"  style={me.textStyle()}
							dangerouslySetInnerHTML={{__html: me.getText('how_i_studied')}} />
						<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:3})}
							    className="btn btn-md btn-success bottom-adjust" >
								{me.dictionary('more_detail')}</a>
						</p>
					</div>	
				</div>						
			</div> 
			<div className="content_bg">
				<video src="" className="align-middle" muted></video>
			</div>
		</div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

try {	
    var MyDemo =  React.createClass({
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
        componentDidUpdate:function(prePropos, preState) {
		let me = this;
		return true;
        },
	componentWillUnmount : function() {
		let me = this;

	},		    
	getVideoUrl : function() {
		let me = this;
		return '//' + _node_svr() + '/api/video/pipe_stream.api?space=https://shusiouwin-dev-1.s3.wasabisys.com/&video_fn=' + me.vid;
	},    
	getSectionUrl : function(ss, t) {
		let me = this;
		return '//' + _node_svr() + '/api/video/pipe.api?space=https://shusiouwin-dev-1.s3.wasabisys.com/&video_fn=' + 
			me.vid + '&ss=' + ss+ '&t=' + t;
	},  
        componentDidMount:function() {
		let me = this;
		me.vid = me.props.params['id'];
		// 1808090000000001
		me.setState({
			videoUrl: me.getVideoUrl(),
			//videoSetting : {width:480, height:320},
			script : {'4.5' : [
				{
					length: 6,
					section: true
				},				
				{
					length: 6,
					tts: '请重复',
					lang : 'cmn-Hans-CN'
				},			
				{
					length: 2,
					//tts: 'please repeat',
					sr: ['天底下没人能在200米距离命中它'],
					v : {
						Y : {
							tts: '天底下没人能在两百米距离命中它',
							lang : 'cmn-Hans-CN'
						},
						N: {
							tts: '不对, 请重试',
							lang : 'cmn-Hans-CN'
						}
					},
					lang : 'cmn-Hans-CN'
				}
			]},
			afterScript : {
				tts: '内容完成',
				lang : 'cmn-Hans-CN',
				continuePlay : true
			},    
			_tm : new Date().getTime()	    
		});
		return true;
        },
	/*
	releaseHold : function(data) {
		var me = this;
		me.setState({locked : false});
		return (data === 'string') ? data : JSON.stringify(data);
	}, */
        render: function() {
            var me = this;
	    return (<div className="content_section">
				<br/>
				<div className="container">
					<div className="col-sm-12 col-lg-12 col-md-12"> 
						<_commVideoVoiceAI parent={me} TM={me.state._tm}/>
					</div>					
				</div> 
				<div className="content_bg"></div>
				{Root.lib.landingModal(me)}
				
			</div>)
	}});	
} catch (err) {
	  console.log(err.message);
}

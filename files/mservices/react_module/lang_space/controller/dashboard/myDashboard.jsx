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
        componentDidUpdate:function(prePropos, preState) {
		let me = this;
		return true;
        },
	    
	    
        componentDidMount:function() {
		let me = this;
		me.setState({
			videoUrl: '//node1_dev.shusiou.win/api/video/pipe_stream.api?space=https://shusiouwin-dev-1.s3.wasabisys.com/&video_fn=1808090000000001',
			//videoSetting : {width:480, height:320},
			script : {'2' : [
				{
					length: 3,
					tts: '深圳打响楼市个人限卖第一枪',
					lang : 'cmn-Hans-CN'
				},			
				{
					length: 2,
					//tts: 'please repeat',
					sr: ['good', 'nice', 'stupid', 'california'],
					v : {
						Y : {
							tts: '很好',
							lang : 'cmn-Hans-CN'
						},
						N: {
							tts: '不对, 请重试',
							lang : 'cmn-Hans-CN'
						}
					},
					lang : 'en-US'
				}
			],
			'12' : [{
				length: 2,
				tts: '中央定调下半年中国经济',
				lang : 'cmn-Hans-CN'			
			}],  
			'18' : [{
				length: 2,
				tts: '稳中有变',
				lang : 'cmn-Hans-CN'			
			}]},
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

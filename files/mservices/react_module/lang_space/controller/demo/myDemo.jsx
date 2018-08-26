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
		if (me.vid) me.setState({vid:me.vid});
		var s_data = {
			'1808250000000002' :{'84.5' : [
					{
						length: 6,
						sectionText: '天底下没人能在200米距离命中它',
						section: true
					},				
					{
						length: 6,
						tts: 'please follow the sentense',

						lang : 'en-US'
					},			
					{
						length: 2,
						sr: ['天底下没人能在200米距离命中它'],
						lang : 'cmn-Hans-CN'
					}
				]},
			'1808250000000003' :{'30' : [
						{
							length: 5,
							sectionText: '我找你就是给我弄个官当当',
							section: true
						},				
						{
							length: 5,
							tts: 'please follow',

							lang : 'en-US'
						},			
						{
							length: 2,
							sr: ['我找你就是给我弄个官当当'],
							lang : 'cmn-Hans-CN'
						}
					],	
					'212' : [
						{
							length: 7,
							sectionText: '多大算大你面前都是大官',
							section: true
						},				
						{
							length:7,
							tts: 'please follow',

							lang : 'en-US'
						},			
						{
							length: 7,
							sr: ['多大算大你面前都是大官'],
							lang : 'cmn-Hans-CN'
						}
					],
					'410' : [
						{
							length: 3,
							sectionText: '快快快摘下来',
							section: true
						},				
						{
							length: 3,
							tts: 'please follow',

							lang : 'en-US'
						},			
						{
							length: 3,
							sr: ['快快快摘下来'],
							lang : 'cmn-Hans-CN'
						}
					]
				},		
		
		}
		
		me.setState({
			videoUrl: me.getVideoUrl(),
			//videoSetting : {width:480, height:320},
			script : s_data[me.vid],
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
	    return (me.state.vid) ? (<div className="content_section">
				<br/>
				<div className="container">
					<div className="col-sm-12 col-lg-12 col-md-12"> 
						<_commVideoVoiceAI parent={me} TM={me.state._tm}/>
					</div>					
				</div> 
				<div className="content_bg"></div>
				{Root.lib.landingModal(me)}
				
			</div>) : (<span>
					<div className="container">	
						<div className="col-sm-6 col-lg-6 col-md-6">
							<a href="#/demo/1808250000000002">1808250000000002</a>
						</div>
						<div className="col-sm-6 col-lg-6 col-md-6">
							<a href="#/demo/1808250000000003">1808250000000003</a>
						</div>
					</div>	
				<span>)
		}});	
} catch (err) {
	  console.log(err.message);
}

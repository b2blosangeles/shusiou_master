try {
	var _commObj = React.createClass({
		getInitialState: function() {
			var me = this;
			if (!_commObj.unicode || _commObj.unicode > 99999) {
				_commObj.unicode = 1;
			} else {
				_commObj.unicode++;
			}	
		//	console.log(_commObj.unicode);
			return {};
		},	
		videoImageUrl : function() {
			let me = this, a = me.props.data.rec, ss =  me.props.data.ss, 
			    size =  (me.props.data.size) ?  me.props.data.size : 480;
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&size=' + size + '&ss=' + ss;
			if (!a.space) return '';
			return url;
		},
		videoImage : function() {
			var me = this, 
			    url = me.videoImageUrl(), width = (me.props.data.width) ? me.props.data.width : '';
			if (!url) return (<span/>);
			else return (width) ? (<img src={url} width={width} />) :  (<img src={url} />);
		},
		videoBgImage : function() {
			let me = this, img = me.props.data.img, url =  me.videoImageUrl();
			return (url) ? (<img src={img} 
				style={{width:'100%', background:'url('+url+')', 'background-size':'cover'}} />) :  (<span/>);
		},		
		video : function() {
			var me = this;
			let a = me.props.data.rec, 
			    ss =  me.props.data.ss, 
			    t = me.props.data.t,
			    size =  (me.props.data.size) ?  me.props.data.size : 480,
			    url;			
			
			if (!a.space) return '';
			if (!ss || !t) url =  _node_svr() + '/api/video/pipe_stream.api?space=' + a.space + '&video_fn='+ a.vid;
			else url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid + '&ss=' + ss + '&t=' + t;
			
			var video_domid = 'video_' + _commObj.unicode; 
			setTimeout(
				(function(video_domid) {
					return function() {
						let video = $('#' + video_domid);
						video[0].play();
						video.click(function(){
							if (this.paused)  this.play();
							else this.pause();
						});
					}
				})(video_domid)
			);
			return (<video id={video_domid} src={url} width={size} loop={true} autoplay={true}>
			</video>);
			
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			if (typeof me[code] === 'function') {
				return (<span>{me[code]()}</span>)
			} else {
				return  (<span>{'inorrect code! ' + code}</span>)
			} 
		}
	});	
} catch (err) {
	console.log(err.message);
}

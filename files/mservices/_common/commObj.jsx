try {
	var _commObj = React.createClass({
		getInitialState: function() {
			var me = this;
			if (!_commObj.unicode || _commObj.unicode > 1000000) {
				_commObj.unicode = 0;
			} else {
				_commObj.unicode++;
			}	
			console.log(_commObj.unicode);
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
			    url = me.videoImageUrl();
			return (url) ? (<img src={url} width="100%"/>) : (<span/>);
		},
		videoBgImage : function() {
			var me = this;
			let img = me.props.data.img,
			    url =  me.videoImageUrl();
			if (!a.space) return '';
			return (url) ? (<img src={img} 
				style={{width:'100%', background:'url('+url+')', 'background-size':'cover'}} />) :  (<span/>);
		},		
		video : function() {
			var me = this;
			let a = me.props.data.rec, 
			    ss =  me.props.data.ss, 
			    size =  (me.props.data.size) ?  me.props.data.size : 480;
			if (!a.space) return '';
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&ss=' + ss + '&t=30';
			setTimeout(
				function() {
					$('#niu').click(function(){
						if (this.paused) {
							this.play();
						} else {
							this.pause();
						}
					    
					});
				}
			);
			return (<video id="niu" width={size} loop={true} autoplay={true}>
					<source src={url} type="video/mp4"/>
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

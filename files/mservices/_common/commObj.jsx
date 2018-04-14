try {
	var _commObj = React.createClass({
		getInitialState: function() {
			var me = this;
			console.log('--->');
			console.log(me.props.data);
			console.log(me.props.code);
			return {};
		},			
		videoImage : function() {
			var me = this;
			let a = me.props.data.rec, 
			    ss =  me.props.data.ss, 
			    size =  (me.props.data.size) ?  me.props.data.size : 480;
			
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&size=' + size + '&ss=' + ss;
			if (!a.space) return '';
			return (<img src={url}/>);
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
					$('#niu')[0].play();
				}, 1000	
			);
	
			return (<video id="niu" width={size} controls  autoplay>
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

try {
	var _commObj = React.createClass({
		getInitialState: function() {
			var me = this;
			console.log(me.props.data);
			return {};
		},		
		videoImage : function() {
			var me = this;
			let a = me.props.data.rec, 
			    t =  me.props.data.t, 
			    size =  (me.props.data.size) ?  me.props.data.size : 480;
			
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&size=' + size + '&ss=' + t;
			if (!a) return '';
			return (<img src={url}/>);
		},
		video : function() {
			var me = this;
			let a = me.props.data.rec, 
			    ss =  me.props.data.ss, 
			    size =  (me.props.data.size) ?  me.props.data.size : 480;
			if (!a) return '';
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&ss=' + ss + '&t=30';
			return (<video src={url} width={size} autoplay>
				This is fallback content to display for user agents that do not support the video tag.
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

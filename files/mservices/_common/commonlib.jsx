try {
	var _commonLib = React.createClass({
		getInitialState: function() {
			console.log(me.props.data);
			var me = this;
			return {};
		},		
		videoImageUrl : function(a, t) {
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&size=480&ss='+t;
			return (<img src={url}/>);
		},
		render: function() {
			var me = this;
			return (<span>{me.videoImageUrl({}, 60)}</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

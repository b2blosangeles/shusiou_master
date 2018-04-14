try {
	var _commonLib = React.createClass({
		getInitialState: function() {
			var me = this;
			console.log(me.props.data);
			return {};
		},		
		videoImageUrl : function() {
			var me = this;
			let a = me.props.data.rec, t =  me.props.data.t;
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&size=480&ss='+t;
			return (<img src={url}/>);
		},
		render: function() {
			var me = this;
			return (<span>{me.videoImageUrl()}</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}

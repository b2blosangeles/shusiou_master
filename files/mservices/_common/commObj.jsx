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
				      '&size=' + size + '&ss='+t;
			return (<img src={url}/>);
		},
		render: function() {
			let me = this, code = (me.props.data) ? me.props.data.code : '';
			return (typeOf me[code] === 'function') me[code]() : ('inorrect code! ' + code);
		}
	});	
} catch (err) {
	console.log(err.message);
}

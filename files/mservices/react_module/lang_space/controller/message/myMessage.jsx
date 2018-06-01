try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {list:[]};
        },
	buildSocketIO : function(o, room, onServerData, onServerMessage) {
		//let me = this;
		o.componentWillUnmount = function() {
			let me = this;
			console.log('---componentWillUnmount triggled');
			me.socket.close();
		}
		if (!o.socket) {
			console.log('fire connect');
			o.socket = io.connect('/');
			o.socket.on('connect', onServerData);
			o.socket.on('serverMessage', onServerMessage);
		}
	},    
        componentDidMount:function() {
          let me = this, i = 0;
		me.buildSocketIO(me, 'news_board',
			function(data) {
				console.log('--->connected -->' + me.socket.id);
				me.socket.emit('createRoom', 'news_board');
				me.socket.on('serverData', function(income) {
					if (income._room === 'news_board') {
						console.log(income.data);
					}
				});
			},
			function(data) {
				console.log('message coming!')
			});
		return true;
		/*
          localStorage.clear();
          me._itv = setInterval(
            function() {
              if (i > 4) {
                i = 0;
                localStorage.clear();
                me.setState({list : []});
              }
              i++;
              let list = me.state.list;
              list.push(i);
              me.setState({list : list});
              localStorage.setItem('upload_' + i, new Date());
            },6000
          );
	  */
        },
        render: function() {
            var me = this;
            return (<div className="content_section">
			{me.state.list.map((item) => {
				return (
					<div className="container" style={{'padding-top':'1em'}}>
						<div class="row">
							<div className="col-sm-12 col-lg-12 col-md-12">
								<div className="overlayer_box homepage_box">
								{localStorage.getItem('upload_' + item)}
								</div>	
							</div>
						</div>
					</div>
				)
			})}
		    	<div className="content_bg opacity_bg"/>
		    </div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

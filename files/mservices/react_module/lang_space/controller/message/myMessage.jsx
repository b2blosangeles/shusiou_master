try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {list:[]};
        },
	buildSocketIO : function(o, cfg) {
		o.componentWillUnmount = function() {
			console.log('---componentWillUnmount triggled');
			this.socket.close();
		}
		if (o.socket) {
			console.log('o.socket.close();');
			o.socket.close();
		}	
		o.socket = io.connect('/');
		o.socket.on('connect', function() {
			console.log('--->connected -->' + me.socket.id);
			o.socket.emit('createRoom', cfg.room);
			if (cfg.onServerData) {
				o.socket.on('serverData', cfg.onServerData);
			}	
		});
		o.socket.on('serverMessage', onServerMessage);
		
	}, 
	rr:'niuB',
        componentDidMount:function() {
          let me = this, i = 0;
		me.buildSocketIO(me, {
			room:'news_board',
			onServerData : function(incomeData) {
				if (incomeData._room === 'news_board') {
					console.log(incomeData.data);
					console.log('onServerData -- ' + me.rr);
				}
			},
			onServerMessage: function(data) {
					console.log('message coming!--' + me.rr)
				}
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

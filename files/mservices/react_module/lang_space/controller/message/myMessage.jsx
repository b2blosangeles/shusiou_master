try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {list:[]};
        },
	buildSocketIO : function() {
		let me = this;
		me.componentWillUnmount = function() {
			let me = this;
			console.log('componentWillUnmount triggled');
			// me.socket.close();
		}
		// if (me.socket) me.socket.close();
		me.socket = io.connect('/');
		me.socket.on('connect', function () {
			me.socket.emit('createRoom', 'news_board');
			me.socket.on('serverData', function(income) {
				if (income._room === 'news_board') {
					console.log(income.data);
				}
			});	
		});
		me.socket.on('serverMessage', function(data) {
			// console.log(data);
		});
	},    
        io1:function() {
		let me = this;
		let _itv = setInterval(function() {
			if (!Root.socket || !Root.socket.id) {
				return true;
			}
			if (!me.socket_id || me.socket_id  !== Root.socket.id) {
				console.log(me.socket_id + '<-->' + Root.socket.id);
				Root.socket.emit('createRoom', 'news_board');
				me.socket_id = Root.socket.id;
				Root.socket.on('serverData', function(income) {
					if (income._room === 'news_board') {
						console.log(income.data);
					}
				});				
				
			}
		}, 1000);

        },
        componentDidMount:function() {
          let me = this, i = 0;
		me.buildSocketIO();
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

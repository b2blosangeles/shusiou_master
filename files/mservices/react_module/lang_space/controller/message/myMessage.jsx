try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {list:[]};
        },
	rr:'niuB',
        componentDidMount:function() {
          let me = this, i = 0;
		Root.lib.loadSocketIO(me, {
			resource:'/',
			public : true, 
			room:'room2',
			onServerData : function(incomeData, socket) {
				console.log(incomeData.data);
				console.log('onServerData -- ' + me.rr + ' === ' + socket.id);
			}
			/*,
			onServerMessage: function(data) {
					console.log('message coming!--' + me.rr);
			}*/
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
			<br/>
			<div className="container">

				<div className="col-sm-4 col-lg-4 col-md-4"> 
					<div className="overlayer_box">
						<h4 className="header">{me.dictionary('what_to_study')}</h4> 
						<p className="overlayer_box_body" style={me.textStyle()}
							dangerouslySetInnerHTML={{__html: me.getText('what_to_study')}} />
						<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:1})}
							    className="btn btn-md btn-danger bottom-adjust" >
								{me.dictionary('more_detail')}</a>									
						</p>
					</div>	
				</div>

				<div className="col-sm-4 col-lg-4 col-md-4"> 
					<div className="overlayer_box">
						<h4 className="header">{me.dictionary('how_to_study')}</h4> 
						<p className="overlayer_box_body"  style={me.textStyle()}
							dangerouslySetInnerHTML={{__html: me.getText('how_to_study')}} />
						<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:2})}
							    className="btn btn-md btn-warning bottom-adjust" >
								{me.dictionary('more_detail')}</a>
						</p>
					</div>	
				</div>

				<div className="col-sm-4 col-lg-4 col-md-4"> 
					<div className="overlayer_box">
						<h4 className="header">{me.dictionary('how_i_studied')}</h4> 
						<p className="overlayer_box_body"  style={me.textStyle()}
							dangerouslySetInnerHTML={{__html: me.getText('how_i_studied')}} />
						<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:3})}
							    className="btn btn-md btn-success bottom-adjust" >
								{me.dictionary('more_detail')}</a>
						</p>
					</div>	
				</div>						
			</div>	
			<div className="content_bg">
				<video src="" className="align-middle" muted></video>
			</div>
		</div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

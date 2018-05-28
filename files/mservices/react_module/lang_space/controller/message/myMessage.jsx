try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {list:[]};
        },
	componentDidMount:function() {
		let me = this, i = 0;
		localStorage.clear();
		me._itv = setInterval(
			function() {
				i++;
				let list = me.state.list;
				list.push(i);
				me.setState({list : list});
				localStorage.setItem('upload_' + i, new Date());
			},1000
		);
	},
        render: function() {
            var me = this;
            return (<div className="content_section">
			<br/>
			{me.state.list.map((item) => {
				return (
					<div className="container1">
						<div class="row">
							<div className="col-sm-12 col-lg-12 col-md-12">
								<div className="overlayer_box editor_box">
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

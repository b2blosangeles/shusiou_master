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
			<br/><br/><br/>==
			{me.state.list.map((item) => {
				    return (<div>{item}</div>)
				// return (<div>{localStorage.getItem('upload_' + item)}</div>)
			})}
		    	<div className="content_bg opacity_bg"/>
		    </div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

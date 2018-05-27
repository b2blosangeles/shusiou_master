try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {};
        },
	componentDidMount:function() {
		let me = this;
		localStorage.clear();
		me._itv = setInterval(
			function() {
				me.list.push(i);
				localStorage.setItem('upload_' + i, new Date());
			},1000
		);
	},
        render: function() {
            var me = this;
	    if (!me.list) me.list = [];	
            return (<div className="content_section">
			<br/><br/><br/>
			{me.list.map((item) => {
				return (<div>{localStorage.getItem('upload_' + item)}</div>)
			})}
		    	<div className="content_bg opacity_bg"/>
		    </div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

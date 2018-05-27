try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {};
        },
	componentDidMount:function() {
		let me = this;
		if (!me.list) me.list = [];
		for (let i = 0 ; i < 100; i++) {
			me.list.push(i);
			localStorage.setItem('upload_' + i, new Date());
		}
	},
        render: function() {
            var me = this;
            return (<div className="content_section">
			<br/><br/><br/>
			{me.list.map((item) => {
				return (<div>{localStorage.getItem('upload' + item)}</div>)
			})}
		    	<div className="content_bg opacity_bg"/>
		    </div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

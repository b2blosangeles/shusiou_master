try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {};
        },
	componentDidMount:function() {
		var me = this;
		
		for (let i = 0 ; i < 100; i++) {
			localStorage.setItem('upload_' + i, new Date());
		}
	},
        render: function() {
            var me = this;
            return (<div className="content_section">
			<br/><br/><br/>
			{localStorage.getItem('upload1')} <br/>
			{localStorage.getItem('upload2')} <br/>
			{localStorage.getItem('upload3')} <br/>
		    	<div className="content_bg opacity_bg"/>
		    </div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

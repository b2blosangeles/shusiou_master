try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {};
        },
	componentDidMount:function() {
		var me = this;
		localStorage.setItem('upload', new Date());
	},
        render: function() {
            var me = this;
            return (<div className="content_section">
			<br/><br/><br/>
			    {localStorage.getItem('upload')}
		    	<div className="content_bg opacity_bg"/>
		    </div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

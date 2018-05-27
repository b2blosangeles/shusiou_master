try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            var me = this;
            return {};
        },		
        render: function() {
            var me = this;
            return (<div className="content_section">
			<br/><br/><br/>    
		    	<div className="content_bg opacity_bg"/>
		    </div>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

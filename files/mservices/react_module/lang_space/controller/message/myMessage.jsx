try {	
    var MyMessage =  React.createClass({
        getInitialState: function() {
            var me = this;
            return {};
        },		
        render: function() {
            var me = this;
            return (<span>
			<br/><br/><br/>    
		    	<div className="content_bg opacity_bg"/>
		    </span>)
	}	
    });	
	
} catch (err) {
	  console.log(err.message);
}

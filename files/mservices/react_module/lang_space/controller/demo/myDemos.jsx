try {	
    var MyDemos =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {};
        },
        render: function() {
            var me = this;
	    return (<div className="content_section">
				<div className="container"> 
				    <div className="col-sm-6 col-lg-6 col-md-6">
					<a href="#/demo/1808250000000002">1808250000000002</a>
				    </div>
				    <div className="col-sm-6 col-lg-6 col-md-6">
					<a href="#/demo/1808250000000003">1808250000000003</a>
				    </div>
				</div>  
				<div className="content_bg"></div>
				{Root.lib.landingModal(me)}
				
			</div>)
	}});	
} catch (err) {
	  console.log(err.message);
}

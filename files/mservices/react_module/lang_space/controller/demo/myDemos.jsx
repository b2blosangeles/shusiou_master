try {	
    var MyDemos =  React.createClass({
        getInitialState: function() {
            let me = this;
        },	    
        render: function() {
            var me = this;
	    return  (<span>
				<div className="container">	
					<div className="col-sm-6 col-lg-6 col-md-6">
						<a href="#/demo/1808250000000002">1808250000000002</a>
					</div>
					<div className="col-sm-6 col-lg-6 col-md-6">
						<a href="#/demo/1808250000000003">1808250000000003</a>
					</div>
				</div>	
			</span>)
		}});	
} catch (err) {
	  console.log(err.message);
}

try {	
    var MyDemos =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {};
        },
	dictionary:function(v) {
		if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
		return this.props.route.env.dictionary(v);
	},
	getCurrentLanguage: function() {
		return this.props.route.env.getCurrentLanguage();	
	},
        componentDidUpdate:function(prePropos, preState) {
		let me = this;
		return true;
        },
	componentWillUnmount : function() {
		let me = this;

	},		    
	    
        componentDidMount:function() {

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

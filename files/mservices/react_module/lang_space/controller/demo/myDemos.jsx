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
	    return (<span></span>)
	}});	
} catch (err) {
	  console.log(err.message);
}

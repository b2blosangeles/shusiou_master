try {	
    var MyDemos =  React.createClass({
        getInitialState: function() {
            let me = this;
        },	    
        render: function() {
            var me = this;
	    return  (<span>123</span>)
		}});	
} catch (err) {
	  console.log(err.message);
}

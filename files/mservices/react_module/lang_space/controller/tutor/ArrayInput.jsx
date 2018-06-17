try {		
	var ArrayInput =  React.createClass({
		getInitialState: function() {
			var me = this; 
			return {
				data:[]
			};
		},
		componentDidMount:function() {
			var me = this;
		},
		componentDidUpdate:function(prePropos, prevState) {	
			var me = this;
		},		
		addItem(event) {
			var me = this;
			me.state.data.push({});
			me.setState({data:me.state.data});
		},
		deleteItem(idx, event) {
			var me = this, v = me.state.data, nv = [];
			for (let i = 0; i < v.length; i++) {
				if (i == idx) continue;
				nv.push(v[i]);
			}
			me.setState({data:nv})
		},		
		render: function() {
			var me = this;
			return (
				<span>
					<div className="content_section">
					  {
						 me.state.data.map(function(item, idx){  
						  return(
							<div className="container">
								<div className="col-sm-1 col-lg-1 col-md-1">{idx}</div>
								<div className="col-sm-11 col-lg-11 col-md-11">
								  <input className="form-control inpit-white-bg" 
									placeholder={'input text ' + 'idx'} 
									value={me.state.data['idx']}/>
								</div>
								<div className="col-sm-1 col-lg-1 col-md-1">
									<i className="fa fa-trash" style={{"font-size":"1.5em"}}
									   onClick={me.deleteItem.bind(me, idx)}></i>
								</div>
							    </div>
							)
						 })	 
					  }					
					</div>
					
				</span>
			
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}

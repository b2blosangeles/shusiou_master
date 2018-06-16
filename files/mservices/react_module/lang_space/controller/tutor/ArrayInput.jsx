try {		
	var ArrayInput =  React.createClass({
		getInitialState: function() {
			var me = this; 
			return {
				scriptLangs:[],
				scriptList:[],
				scriptListFilter:{},
				script_id:0,
				data:{},
				c_tpl:{}
			};
		},
		componentDidMount:function() {
			var me = this;
		},
		componentDidUpdate:function(prePropos, prevState) {	
			var me = this;
		},
		handleChange(idx, event) {
			var me = this;
			if (event.target.type == 'text') {
				me.setStateData(idx, event.target.value)
			}
		},
		textField: function(idx) {
			var me = this;
			if (idx === 'description') {
				return (
					<span>
						<table className="table">
						  <thead>
						    <tr>
						      <th scope="col"></th>
						      <th scope="col">Answer</th>
						      <th scope="col"><i className="fa fa-plus-square"  
									      style={{"font-size":"1.5em"}}></i></th>
						    </tr>
						  </thead>
						  <tbody>
						    <tr>
						      <th scope="row"></th>
						      <td><input className="form-control inpit-white-bg" 
							placeholder={'input text ' + idx} 
							value={me.state.data[idx]}  
							onChange={me.handleChange.bind(me, idx)}/></td>
						      <td> <i className="fa fa-trash" style={{"font-size":"1.5em"}}></i></td>
						    </tr>
						  </tbody>
						</table>							
					</span>		
				)			
			} else {
				return (
					<span>
						<p><input className="form-control inpit-white-bg" 
							placeholder={'input text ' + idx} 
							value={me.state.data[idx]}  onChange={me.handleChange.bind(me, idx)}  />
						</p>				
					</span>		
				)
			}
		},									
		render: function() {
			var me = this;
			return (
			<table className="table">
			  <thead>
			    <tr>
			      <th scope="col"></th>
			      <th scope="col">Answer</th>
			      <th scope="col"><i className="fa fa-plus-square"  
						      style={{"font-size":"1.5em"}}></i></th>
			    </tr>
			  </thead>
			  <tbody>
			    <tr>
			      <th scope="row"></th>
			      <td><input className="form-control inpit-white-bg" 
				placeholder={'input text ' + idx} 
				value={me.state.data[idx]}  
				onChange={me.handleChange.bind(me, idx)}/></td>
			      <td> <i className="fa fa-trash" style={{"font-size":"1.5em"}}></i></td>
			    </tr>
			  </tbody>
			</table>
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}

try {	
    var MyDemos =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {};
        },
	newAddThumbnail:function(t) {
		var url = _master_svr() + '/images/teacher_1.jpg';
		return url;
	},
        render: function() {
            var me = this;
	    return (<div className="content_section">
				<div className="container"> 
				    <div className="col-sm-6 col-lg-6 col-md-6">
					    <div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
						<img src={me.newAddThumbnail()} style={{width:'100%'}}/>
						<div className="video_thumbnail_text pull-right">
							<a href={'#/demo/1808250000000002'}>
							<button type="button" 
								className="btn btn-warning">
								{Root.lib.dictionary('demo 1')}
							</button>
							</a>	
						</div>
					</div>
				    </div>
				    <div className="col-sm-6 col-lg-6 col-md-6">
					    <div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
						<img src={me.newAddThumbnail()} style={{width:'100%'}}/>
						<div className="video_thumbnail_text pull-right">
							<a href={'#/demo/1808250000000003'}>
							<button type="button" 
								className="btn btn-warning">
								{Root.lib.dictionary('demo 2')}
							</button>
							</a>	
						</div>
					</div>
				    </div>
				</div>  
				<div className="content_bg"></div>
				{Root.lib.landingModal(me)}
				
			</div>)
	}});	
} catch (err) {
	  console.log(err.message);
}

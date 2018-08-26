try {	
    var MyDemos =  React.createClass({
        getInitialState: function() {
            let me = this;
            return {};
        },
	newAddThumbnail:function(t) {
		var url = _master_svr() + '/images/teacher_'+t+'.jpg';
		return url;
	},
        render: function() {
            var me = this;
	    return (<div className="content_section">
			    <br/><br/>
				<div className="container"> 
					<div className="col-sm-1 col-lg-1 col-md-1"></div>
				    <div className="col-sm-4 col-lg-4 col-md-4">
					    <div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
						<img src={me.newAddThumbnail(1)} style={{width:'100%'}}/>
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
					<div className="col-sm-2 col-lg-2 col-md-2"></div>
				    <div className="col-sm-4 col-lg-4 col-md-4">
					    <div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
						<img src={me.newAddThumbnail(2)} style={{width:'100%'}}/>
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
					<div className="col-sm-1 col-lg-1 col-md-1"></div>
				</div>  
				<div className="content_bg"></div>
				{Root.lib.landingModal(me)}
				
			</div>)
	}});	
} catch (err) {
	  console.log(err.message);
}

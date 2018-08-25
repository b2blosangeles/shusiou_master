try {
	var Embed_video_editor =  React.createClass({
		getInitialState: function() {
			var me = this;
			me.lib = new _commLib();
			me.video = me.props.video;
			me.sections = me.props.sections;
			return {
				preview_time:0,
				track:me.props.track,
				video:{},
				video_bar_width:0,
				section_id : me.props.section_id
			};
		},	
		componentDidMount:function() {
			var me = this, code = '';
			var p_video = $('#preview_video')[0];
			if (p_video) {
				p_video.ontimeupdate = function() {
					var v = Math.floor(p_video.currentTime);
					me.setState({preview_time:v})
				};
			}
			 
			var vurl = _node_svr() + '/api/video/pipe_stream.api?space=' + me.video.space + '&video_fn='+ me.video.vid;
			
			var _itv = setInterval(
				function() {
					if (me.video.vid) {
						clearInterval(_itv);
						me.setState({vid:me.video.vid});
						p_video.src =  vurl;
						setTimeout(function() {
							me.setState({video_bar_width:Math.round($('#video_bar').width())},
							function() {}	    
							);
						}, 1000	
						);		
					}
				}
			,100);
		},
		clickTime:function(v) {
			var me = this;
			var n = me.state.video_bar_width, X = [];
			var MAX = 1000;
			n = (n > MAX)?MAX:n;	
			var p_video = $('#preview_video')[0];
			var c_video = $('#preview_clip_video')[0];
			p_video.currentTime = Math.round(me.video.video_length * v / n);
			me.setState({track:{s:p_video.currentTime, t:10}}, function() {
				p_video.pause();
				c_video.pause();
				me.playSection();			
			});

		},		
		videoBar:function() {
			var me = this;
			var n = me.state.video_bar_width, X = [];
			var MAX = 1000;
			n = (n > MAX)?MAX:n;
			
			for (var i=0; i < n; i++) X[X.length] = '';
			let video_length = me.video.video_length;
			console.log('--XY-->');
			console.log(me.state);
			return (
				<table id="video_bar" width="100%" height="16" style={{'border':'1px solid #ddd'}}><tr>
				{X.map(function(x, idx) {	
					for (var j = 0; j < me.sections.length; j++) {
						if (!me.sections[j] || !me.sections[j].data) continue;	
						let s = parseFloat(me.sections[j].data.track.s),
						    t = parseFloat(me.sections[j].data.track.t);

						if (idx >= Math.round(n * s / video_length ) && 
						    idx < Math.round((n * s + n * t) / video_length)) {
							if (me.sections[j].section_id == me.state.section_id) {
								return (<td width="1" style={{'background-color':'green'}}></td>)
							} else {
								return (<td width="1" style={{'background-color':'red'}}></td>)
							}
						}
					}
					return (<td width="1" style={{'background-color':'lightyellow'}}
						onClick={me.clickTime.bind(me,idx)} className="videoBar"
						></td>)
				})}
				<td width="*" style={{'background-color':'#ddd'}}></td>	
				</tr></table>
			);	
		},
		componentDidUpdate:function(prePropos, preState) {
			var me = this;
			if (prePropos.popid != me.props.popid) {
				me.sections = me.props.sections;
				me.setState({track:me.props.track});
			}
		},
		sendTrack: function() {
			var me = this;
			var v = me.props.track;
			var c_video = $('#preview_clip_video')[0];
			var p_video = $('#preview_video')[0];
			if (c_video) c_video.pause();
			if (p_video) p_video.pause();
			v.s = me.state.track.s;
			v.t = me.state.track.t;
			me.lib.closePopupWin(me);
		},
		showSectionImages: function() {
			var me = this, A = [];

			if (!me.state.track) return false;
			for (var i = 0; i < 2 * me.state.track.t; i++) {
				A[A.length] = parseInt(me.state.track.s) + i * 0.5;
			}
			return A.map(function(a,idx){
				if (idx < 8 || idx > A.length - 8)  return (<span>
					<_commObj code={'videoImage'}  
					data={{ rec:me.video, ss:A[idx], size:90, width:90, click:function() {
								alert('niu');
							}}}/>
				</span>)
				else return (<span></span>)
			});
		},
		
		
		playSection:function() {
			let me = this;
			let v = _node_svr() + '/api/video/pipe.api?space=' + me.video.space + '&video_fn='+ me.video.vid + 
			    '&ss=' + me.state.track.s + '&t=' + me.state.track.t;
			$('#preview_clip_video')[0].src = v;
			$('#preview_clip_video')[0].play();		
		},
		
		disbleAdjustSection:function(ds, dt) {
			var me = this;
			return (!me.changeAble(ds, dt))?{display:'none'}:{display:''};
		},		
		
		changeAble:function(ds, dt) {
			return true;
			var me = this;
			var n = me.state.video_bar_width, X = [];
			var MAX = 1000;
			n = (n > MAX)?MAX:n;	
			var s =  parseFloat(me.state.track.s) + parseFloat(ds); t = s + parseFloat(me.state.track.t) + parseFloat(dt);
			for (var j = 0; j < me.sections.length; j++) {
				if (me.sections[j].id == me.state.track.id) continue;
				for (var d = s; d < t; d+=0.5) {
					if (d >= me.sections[j].track.s &&  d < (me.sections[j].track.s + me.sections[j].track.t)) {
						return false;
					}
				}
			}
			return true;
		},		
		
		adjustSection:function(po, dt) {
			let me = this,
			    s = parseFloat(me.state.track.s),
			    t = parseFloat(me.state.track.t);
			if (po === 'left') s += parseFloat(dt); 
			else if (po === 'right')  t += parseFloat(dt); 
			if (s<0) s=0; if (t>20) t=20; if (t<2) t=2;
			me.setState({track:{s:s, t:t}}, function(){
				me.playSection();	
			});
			
		},		
		bytesToSize:function (bytes) {
		   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		   if (bytes == 0) return '0 Byte';
		   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		},		
		hideNullSection: function() {
			return (this.state.track.t == null)?{display:'none'}:{diaplay:''};
		},
		hideValueSection: function() {
			return (this.state.track.t != null)?{display:'none'}:{diaplay:''};
		},		
		preCacheImage:function() {
			var me = this;
		},	
		render: function() {
			var me = this;
			return (
				<div className="container-fluid">
					<table width="100%" className="section_template_frame">	
					<tr>
							<td width="48%">
								Original Movie:
							</td>
							<td width="1%" style={{'border-right':'2px solid #ccc'}}></td>
							<td width="1%" style={{'border-left':'2px solid #ccc'}}></td>
							<td width="50%">
								<video id="preview_clip_video" style={{display:'none'}}>
									<source src="" autoplay
									type="video/mp4"/>
								</video>
								Movie clip :<span 
								style={(me.state.track.s !== null)?{display:''}:{display:'none'}}		     
								dangerouslySetInnerHTML={{__html: (me.state.track.t)?(me.lib.toHHMMSS(me.state.track.s) + 
								' - ' + me.lib.toHHMMSS(parseInt(me.state.track.s) + parseInt(me.state.track.t))):''}} />

								<button type="button" className="btn btn-default btn-xs video_editor_button" 
									style={(me.state.track.t)?{display:''}:{display:'none'}}
									onClick={me.playSection.bind(this)}>
									<i className="fa fa-play" aria-hidden="true"></i>&nbsp;Listen 
								</button>

								<button type="button" className="btn btn-warning video_editor_button" 
									style={(me.state.track.t)?{display:''}:{display:'none'}}
									onClick={me.sendTrack.bind(me)}>
									Accept clip
								</button>								
							</td>
						</tr>						
						<tr>
							<td width="48%">
								<video id="preview_video" width="100%" controls>
									<source src="" 
									type="video/mp4"/>
								</video>							
							</td>
							<td width="1%" style={{'border-right':'2px solid #ccc'}}></td>
							<td width="1%" style={{'border-left':'2px solid #ccc'}}></td>						
							<td width="50%">
							{me.showSectionImages()}

							</td>
						</tr>
					</table>	
					<div id="niu1"></div>
					<br/>	
					{me.videoBar()}	
					<table width="100%" className="section_template_frame">		
						<tr>
							<td width="48%">						
							</td>
							<td width="1%" style={{'border-right':'2px solid transparent'}}></td>
							<td width="1%" style={{'border-left':'2px solid transparent'}}></td>						
							<td width="50%">
								<span style={me.hideNullSection()}>
									 <button type="button" className="btn btn-sm btn-warning btn_margin3"
										  style={me.disbleAdjustSection(-0.5, 0)}
										 onClick={me.adjustSection.bind(this, 'left', -0.5)}> 									
										  -&#189;</button>							

									<button type="button" className="btn btn-sm btn-warning btn_margin3"
										style={me.disbleAdjustSection(0.5, 0)}
										 onClick={me.adjustSection.bind(this, 'left', 0.5)}> 
										 +&#189;</button>
									<span 
										style={(me.state.track.s !== null)?{display:''}:{display:'none'}}		     
										dangerouslySetInnerHTML={{__html: (me.state.track.t)?(me.lib.toHHMMSS(me.state.track.s) + 
										' - ' + me.lib.toHHMMSS(parseInt(me.state.track.s) + parseInt(me.state.track.t))):''}} />
									
									 <button type="button" className="btn btn-sm btn-success btn_margin3"
										  style={me.disbleAdjustSection(-0.5, 0)}
										 onClick={me.adjustSection.bind(this, 'right', -0.5)}> 									
										 -&#189; </button>									
									
									<button type="button" className="btn btn-sm btn-success btn_margin3"
										  style={me.disbleAdjustSection(-0.5, 0)}
										 onClick={me.adjustSection.bind(this, 'right', 0.5)}> 									
										 +&#189; </button>
								</span>							

							</td>
						</tr>						
					</table>	

					<span className="pull-right text-warning" style={{'padding-top':'0.5em'}}>
						{(function() {
							if ((me.state.video.length) && (me.state.video.q)) {
								return 'Lazy caching ...';
							} else {
								return '';
							}
						})()}									

					</span>	
					<p className="video_editor" style={me.hideNullSection()}>
						{/*me.showSectionImages()*/}
					</p>
				</div>	

				)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}

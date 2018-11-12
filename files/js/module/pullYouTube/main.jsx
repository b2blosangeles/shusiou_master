React.createClass({
        getInitialState: function() {
                var me = this;
                return {video_url:'', vid:'', error:'', list:[], method: ''};
        },
        initState:function() {
                this.setState({video_url:'', vid:'', title:'', length_seconds:0,thumbnail_url:'', error:''});			
        },
        componentDidMount:function() {
                var me = this;	
        },
        componentDidUpdate:function(prePropos, preState) {
                var me = this;
                if (prePropos.id != me.props.id) {
                //	console.log(prePropos.id + '=======' + me.props.id);
                        me.setState({video_url:'', vid:'', error:'', list:[]});
                }
        },
        handleChange:function(e) {
                var me = this;
                me.setState({video_url:e.target.value});
        },        
        videoUrlDecode:function() {
                var me = this, code = me.state.video_url;		
                let engCfg = {
                        request:{code:'getVieoInfo', 
                                 url :  _master_svr() + '/api/video/myVideo.api?opt=getYouTubeInfo', 
                                 method:'post', 
                                 data:{video_url: me.state.video_url}
                        },
                        hold:500,
                        setting: {timeout:6000},
                        callBack: function(data) {
                                data.data.code = code;
                                me.setState(data.data);
                        }
                }			
                Root.lib.loadEng(me, engCfg);
        },
        videoUrlValidation:function(){
                var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
                return (this.state.video_url.match(p))?true:false;
        },		
        videoUrlSubmitable:function(){
                return (this.videoUrlValidation())?'input-group-addon btn btn-warning':'input-group-addon btn btn-warning disabled';
        }, 
        pullingYoutube : function () {
                var me = this;
                // value={'12234'}
                return (<p  style={{'padding':'1em'}}>				

                          <input type="text" className="form-control" placeholder="Input YouTube link" 
                                  
                                  aria-describedby="basic-addon2"/>      
                             <hr/>   
                                
                          
                </p>)
        },        
        render: function() {
          var me = this;
          return  (<span><input type="text" className="form-control" placeholder="Input YouTube link" 
                                  value={'888'}/></span>)
        }
});

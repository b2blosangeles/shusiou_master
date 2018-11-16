React.createClass({
        getInitialState: function() {
          var me = this;
          return {}
        },
        goBackMyVideos: function() {
                window.location.href = '#/tutor/my_videos';
        },
        componentDidMount:function() {
               var me = this;
               me.init();
        },        
        init : function() {
                var meObj = this;
        },
        render: function() {
          var me = this;
          return  (<span>
                        Public News 
                          <hr/>
                          <dataList/>
                 </span>)
        }
});

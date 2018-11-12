React.createClass({
        getInitialState: function() {
          var me = this;
          return {}
        },
        pp: function() {
                var me = this;
                me.props.parent.goBackMyVideos();
        },
        render: function() {
          var me = this;
          return  (<span>
                         File Upload <a onClick={me.pp.bind(me)} >Go Back</a>
                 </span>)
        }
});

React.createClass({
        getInitialState: function() {
          var me = this;
          return {}
        },
        pp: function() {
          alert('File Upload');
        },
        render: function() {
          var me = this;
          return  (<span>
                          File Upload <a onClick={me.pp.bind(me)} >test</a>
                 </span>)
        }
});

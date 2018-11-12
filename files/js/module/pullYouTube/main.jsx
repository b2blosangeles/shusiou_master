React.createClass({
        getInitialState: function() {
          var me = this;
          return {}
        },
        pp: function() {
          alert('Pull YouTube');
        },
        render: function() {
          var me = this;
          return  (<span>
                          Pull YouTube <a onClick={me.pp.bind(me)} >test</a>
                 </span>)
        }
});

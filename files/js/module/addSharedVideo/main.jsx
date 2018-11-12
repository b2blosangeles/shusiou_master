

React.createClass({
        getInitialState: function() {
          var me = this;
          return {}
        },
        pp: function() {
          alert('Add Shared Video');
        },
        render: function() {
          var me = this;
          return  (<span>
                          Add Shared Video <a onClick={me.pp.bind(me)} >test</a>
                 </span>)
        }
});

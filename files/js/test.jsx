React.createClass({
        getInitialState: function() {
          var me = this;
          return {niu:new Date().toString()}
        },
        pp: function() {
          alert('p2p');
        },
        render: function() {
          var me = this;
          return  (<span>{me.state.niu}
            <a onClick={me.pp.bind(me)} >test</a>
            </span>)
        }
});

var _v = React.createClass({
  getInitialState: function() {
    var me = this;
    return {niu:new Date().toString()}
  },
  render: function() {
    var me = this;
    return  (<span>{me.state.niu}</span>)
  }
});

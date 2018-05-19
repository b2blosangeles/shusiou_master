var _commLib = function () {
    this.buildPopup = function(o, setting)  {
       let caller_name = arguments.callee.caller.name,
           f_list = {},
           ModalPopup_cfg = {};
       
        for (var key in setting) {
            if (key == 'section') {
                  for (var v in setting.section) {
                     if (typeof setting.section[v] === 'function') {
                        o[ caller_name + '_' + v] = setting.section[v];
                        f_list[v] = caller_name + '_' + v;
                        delete setting.section[v];
                     }
                  }
                  ModalPopup_cfg['section'] =  f_list;
             } else {
                ModalPopup_cfg[key] = setting[key];
             }
        }
        o.setState({ModalPopup : ModalPopup_cfg});        
        
    }
    this.closePopup = function(o) {
       var me = this;
       if (!o.props || !o.props.parent) {
         alert('No props');
       } else {
            if (!o.props.parent.state.ModalPopup) {
                  me.closePopup(o.props.parent);
            } else {
               o.props.parent.setState({ModalPopup : 'cancel'});
            }
       } 
    }
    
    this.toHHMMSS = function(v, noms) {
        if (isNaN(v)) return v;
        var h = Math.floor(v / 3600),m = ("00" + Math.floor((v % 3600) / 60)).slice(-2),
                s = ("00" + (Math.floor(v) % 3600) % 60).slice(-2), ms = 1000 * (v - Math.floor(v));
            if (!noms) { ms = (ms)?'&#189;':''; }
            else ms = '';
        return h + ':' + m + ':' + s + ' ' + ms;
    }
    
    this.cpSeeker = function(pint, idx, data) {
        
    }

    this.obj2Json = function(o) {
       for (var item in o) {
          if (typeof o[item] === 'object') {
              if (!Array.isArray(o[item])) {
                o[item] = this.obj2Json(o[item]);
              }
          } else if (typeof o[item] === 'function') {
               o[item] = o[item].toString();
          }
       }
       return o;
    } 
};

var _commLib = function () {
   
    this.buildPopup = function(o, setting)  {
       let caller_name = arguments.callee.caller.name,
           f_list = {},
           ModalPopup_cfg = {};
       
        for (var key in setting) {
            if (key == 'section') {
                  for (var v in setting.section) {
                     if (typeof setting.section[v] === 'function') {
                        if (v === '_closePopup') {
                           alert(88);
                           o[v] = setting.section[v];
                           f_list[v] = v;
                        } else {
                            o[ caller_name + '_' + v] = setting.section[v];
                            f_list[v] = caller_name + '_' + v;
                        }  
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
    this.closePopup = function() {
      alert('this.closePopup');  
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
};

var _commLib = function () {
   
    this.buildPopup = function(o, setting)  {
       let caller_name = arguments.callee.caller.name,
           f_list = {},
           ModalPopup_cfg = {};
       alert(caller_name);
       
        for (var key in setting) {
            if (key == 'function') {
                  for (var v in setting.function) {
                     if (typeof setting.function[v] === 'function') {
                        o[ caller_name + '_' + v] = setting.function[v];
                        f_list[v] = caller_name + '_' + v;
                        delete setting.function[v];
                     }
                  }
             } else {
                ModalPopup_cfg[key] = setting[key];
             }
           
        }
        o.setState({
            ModalPopup:{
                function : f_list,
                box_class : 'alert alert-success',
                popup_type : 'alert',
                close_icon : true,
                message : 'niu bi'
            }
        });        
        
    }
    this.transferFunction = function(o, data, caller)  {
        alert('arguments.callee.caller.name--->');
        alert(arguments.callee.caller.name);
        alert(this.constructor.name)
        for (var key in data) {
            if (typeof data[key] === 'function') {
                o[ caller + '_' + key] = data[key];
                delete data[key];
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
};

var _LibIndex = 0;
var _commLib = function () {
    _LibIndex = (!_LibIndex || _LibIndex > 1000000) ? 1 : (_LibIndex + 1);
    
    this.landingModal = function(o) {
	o.existModal = true;
    	return(<span><_commWin parent={o} /><_commEng parent={o} /></span>)
    }
    this.assignEng = function(target, engCfg) {
	let ta = (target.existModal) ? target : Root;
    	ta.setState({_eng:engCfg})
    }    
    this.alert = function(target, message, alert_type,  holdTime)  {	
	    console.log('===target.existModal===>');
	    console.log(target.existModal);
	var me = this, ta = (target.existModal) ? target : Root;
	let cfg = {
		section: {
			message : function() { return message; }
		},
		box_class : 'alert-' + alert_type,
		popup_type : 'alert',
		close_icon : true
	};
	me.buildPopup(ta, target, cfg);
	setTimeout(function() {
		if ((ta.state.ModalPopup) && (ta.state.ModalPopup.popup_type === 'alert')) {
			ta.setState({ModalPopup:'cancel'});
		}
	}, (holdTime) ? holdTime : 6000);
	return true;       
        
    }
    this.popup = function(o, setting)  {
	let me = this, ta = Root;  
	me.buildPopup(ta, setting);
    }    
    this.buildPopup = function(ta, o, setting)  {
	let me = this;  
        let caller_name = arguments.callee.caller.name,
           f_list = {},
           ModalPopup_cfg = {};
       
        for (var key in setting) {
            if (key == 'section') {
                  for (var v in setting.section) {
                     if (typeof setting.section[v] === 'function') {
                        o[ caller_name + '_' + v] =  setting.section[v];	
                        f_list[v] = caller_name + '_' + v;
                        delete setting.section[v];
                     }
                  }
                  ModalPopup_cfg['section'] =  f_list;
             } else {
                ModalPopup_cfg[key] = setting[key];
             }
        }
        ta.setState({ModalPopup : ModalPopup_cfg});        
        
    }
    
    this.closePopup = function(o) {
	var me = this, ta = Root;
	ta.setState({ModalPopup : 'cancel'});
	    return true;
	if (!ta.props || !ta.props.parent) {
		alert('No props');
	} else {
		if (!ta.props.parent.state.ModalPopup) {
			me.closePopup(ta.props.parent);
		} else {
			ta.props.parent.setState({ModalPopup : 'cancel'});
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
    this.setCallBack = function(o, target) {
	    console.log('target.existModal-->');
	     console.log(target.existModal);
       let me = this, ta = (target.existModal) ? target : Root;
       let func = null, id = new Date().getTime() + '_' + _LibIndex;
        
       if (typeof o.callBack === 'function') {
           func = o.callBack;
	   ta['EngCbk_' + id] = function(data) {
               let me = target;
               func(data);
               delete ta['EngCbk_' + id];
               delete o['EngCbk_' + id];
	   }
           o.callBack = 'EngCbk_' + id;
       }
    }
    this.obj2Json = function(o) {
       for (var item in o) {
          if (typeof o[item] === 'object') {
              if (!Array.isArray(o[item])) {
                o[item] = this.obj2Json(o[item]);
              }
          } else if (typeof o[item] === 'function') {
               o[item] = o[item].name;
          }
       }
       return o;
    } 
};

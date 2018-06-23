var _LibIndex = 0;
var _commLib = function () {
	
    _LibIndex = (!_LibIndex || _LibIndex > 1000000) ? 1 : (_LibIndex + 1);

    this.getAuth = function() {
		return (reactCookie.load('auth'))?reactCookie.load('auth'):{}
    }
    this.inte_array = function (a, b) {
	for(var i=0; i < a.length; i++) { if (b.indexOf(a[i]) !== -1) return true;}
	return false;
    }
    this.routerPermission = function(userInfo, permission) {
	let roles = (!userInfo || !userInfo.roles) ? [] : userInfo.roles,
	    uid = (!userInfo || !userInfo.uid) ? null  : userInfo.uid;
	if (!this.inte_array(roles, permission.role) &&  !this.inte_array(['*'], permission.role)) {
	//	window.location.href = '/#/';
	}
	if (!uid && (permission.auth)) {
	//	window.location.href = '/#/Signin';
	}
    }	    
    this.landingModal = function(o) {
	o.existModal = true;
    	return(<span><_commWin parent={o} /><_commEng parent={o} /></span>)
    }
    this.loadEng = function(target, engCfg) {
       	if (!Root._EngQ)  Root._EngQ = [];
	Root._EngQ.push({target:target, engCfg:engCfg});
	if (!Root._EngQ_ITV)  {
		Root._EngQ_ITV = setInterval(
			function() {
				if (Root._EngC) return;
				if (!Root._EngQ.length) {
					clearInterval(Root._EngQ_ITV);
					delete Root._EngQ_ITV;
					return true;
				}
				Root._EngC = Root._EngQ.shift();
				(function(target, engCfg) {
					let ta = (target.existModal) ? target : Root,
					    func = null, 
					    id = new Date().getTime() + '_' + _LibIndex;

				       if (typeof engCfg.callBack === 'function') {
					   func = engCfg.callBack;
					   ta['EngCbk_' + id] = function(data) {
						let me = target;
						delete Root._EngC;
					       func(data);
					       delete ta['EngCbk_' + id];
					       delete engCfg['EngCbk_' + id];
					   }
					   engCfg.callBack = 'EngCbk_' + id;
					}
					ta.setState({_eng:engCfg});
				    })(Root._EngC.target, engCfg = Root._EngC.engCfg);
			}, 100
		);
	}
    }   
    this.alert = function(target, message, alert_type,  holdTime, callback)  {
	var me = this, ta = (target.existModal) ? target : Root;
	let cfg = {
		section: {
			message : function() { return message; }
		},
		box_class : 'alert-' + alert_type,
		popup_type : 'alert',
		close_icon : true,
		closeCallback : (typeof  holdTime === 'function')? holdTime :
			(typeof callback === 'function') ? callback : null
	};
	me.buildPopup(ta, target, cfg);
	if (!isNaN(holdTime)) { 
		setTimeout(function() {
				if ((ta.state.ModalPopup) && (ta.state.ModalPopup.popup_type === 'alert')) {
					ta.setState({ModalPopup:'cancel'});
					if (typeof  holdTime === 'function') holdTime();
					if (typeof callback === 'function') callback();
				}
		}, holdTime);
	}
	return true;       
        
    }
    this.popupWin = function(target, setting)  {
	let me = this, ta = (target.existModal) ? target : Root;
	me.buildPopup(ta, target, setting);
    }
    this.closePopupWin = function(target)  {
	let me = this, ta = (target.existModal) ? target : Root;
	ta.setState({ModalPopup:'cancel'}); 
    }        
    this.buildPopup = function(ta, o, setting)  {
	let me = this;  
        let caller_name = (ta.moduleName) ? ta.moduleName : '_Dynamic_',
           f_list = {},
           ModalPopup_cfg = {};
	    
        for (var key in setting) {
            if (key == 'section') {
                  for (var v in setting.section) {
                     if (typeof setting.section[v] === 'function') {
                        ta[ caller_name + '_' + v] =  
				(function(v) {
					let me = o;
					return setting.section[v];
				})(v);
					
                        f_list[v] = caller_name + '_' + v;
                        delete setting.section[v];
                     }
                  }
                  ModalPopup_cfg['section'] =  f_list;
             } else if (key == 'closeCallback') {

		     if (typeof setting.closeCallback === 'function') {
			ta[ caller_name + '_closeCallback'] =  
				(function(v) {
					let me = o;
					return setting.closeCallback;
				})(v);

			ModalPopup_cfg['closeCallback'] = caller_name + '_closeCallback';
			delete setting.closeCallback;
		     }
             } else {
                ModalPopup_cfg[key] = setting[key];
             }
        }
        ta.setState({ModalPopup : ModalPopup_cfg});        
        
    }
    
    this.toHHMMSS = function(v, noms) {
        if (isNaN(v)) return v;
        var h = Math.floor(v / 3600),m = ("00" + Math.floor((v % 3600) / 60)).slice(-2),
                s = ("00" + (Math.floor(v) % 3600) % 60).slice(-2), ms = 1000 * (v - Math.floor(v));
            if (!noms) { ms = (ms)?'&#189;':''; }
            else ms = '';
        return h + ':' + m + ':' + s + ' ' + ms;
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

	this.loadSocketIO = function(o, cfg) {
		let _id = (cfg.publicId) ? cfg.publicId :
		    (!o || !o.props || !o.props.route || !o.props.route.path) ? cfg.room : (o.props.route.path + '_' + cfg.room);

		// console.log('_id =D=>' + _id);

		Root.socket = (Root.socket) ? Root.socket : {};
		Root.socket[_id] = (Root.socket[_id]) ? Root.socket[_id] : {};

		//let obj = (!cfg.public) ? o : Root.socket[_id]; 
		let obj = Root.socket[_id];
		
		if (!cfg.publicId) {
			o.componentWillUnmount = (function(o, componentWillUnmount) {
				return function() {
					if (typeof componentWillUnmount === 'function') {
						componentWillUnmount();
					}
					// console.log('---componentWillUnmount triggled ==' + _id);
					obj.socket.close();
				}
			})(o, o.componentWillUnmount);
			console.log('====closed A===');
		}
		if (!cfg.publicId && (obj.socket)) {
			console.log('====closed===');
			obj.socket.close();
		}
		if (!obj.socket) {
			obj.socket = io.connect(cfg.resource);
			obj.socket.on('connect', function() {
				console.log('--->connected -->' + obj.socket.id + '--' + cfg.room);
				obj.socket.emit('createRoom', cfg.room);
				if (typeof cfg.onServerData === 'function') {
					obj.socket.on('serverData', function(incomeData) {
						//if (incomeData._room === cfg.room) {
							cfg.onServerData(incomeData, obj.socket);
						//}
					});					
				}
				if (typeof cfg.onConnection === 'function') {
					cfg.onConnection(obj.socket);					
				}				
			});
			if (typeof cfg.onServerMessage === 'function') {
				obj.socket.on('serverMessage', cfg.onServerMessage);
			}
		}
	}   
	this.dictionary = function(v) {
		if  (!Root.state.dictionary[v]) return v;
		return (!Root.state.dictionary[v][Root.state.c_lang])?Root.state.dictionary[v]['en']:Root.state.dictionary[v][Root.state.c_lang];
	}
};

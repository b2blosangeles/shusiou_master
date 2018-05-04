var _commLib = function () {

    this.transferFunction = function(o, data, caller)  {
        for (var key in data) {
            if (typeof data[key] === 'function') {
                o[ caller + '_' + key] = data[key];
                delete data[key];
            }
        }
        o.setState({
            ModalPopup:{
                caller : arguments.callee.name
            }
        });
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

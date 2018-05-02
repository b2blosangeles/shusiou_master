var _commLib = function () {

    this.transferFunction = function(o, data, caller)  {
        for (var key in data) {
            if (typeof data[key] === 'function') {
                o[ caller + '_' + key] = data[key];
                delete data[key];
            }      
        }
        
    }
};

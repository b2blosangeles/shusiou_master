var _commLib = function () {

    this.transferFunction = function(o, data, caller)  {
        let fn = caller + '_' + 'message';    
        /*
        if (typeof data.message === 'function') {
            o[fn] = data.message;
            delete data.message;
        }
        */
        for (var key in data) {
            if (typeof data[key] === 'function') {
                o[key] = data[key];
                delete data[key];
            }      
        }
        
    }
};

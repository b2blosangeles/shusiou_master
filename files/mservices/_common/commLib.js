var _commLib = function () {

    this.transferFunction = function(o, data, caller)  {
        let fn = caller + '_' + 'message';       
        if (typeof data.message === 'function') {
            o[fn] = data.message;
            delete data.message;
        }
        
    }
};

var _commLib = function () {

    this.transferFunction = function(o, data, calle)  {
        let fn = calle.name + '_' + 'message';       
        if (typeof data.message === 'function') {
            o[fn] = data.message;
            delete data.message;
        }
        
    }
};

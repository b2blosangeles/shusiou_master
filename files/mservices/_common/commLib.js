var _commLib = function () {
    this.transferFunction = function(o, fn, data)  {
        if (typeof data.message === 'function') {
            o[fn] = data.message;
            delete data.message;
        }
        
    }
};

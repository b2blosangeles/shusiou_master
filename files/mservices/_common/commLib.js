var _commLib = function () {
    this.messageFunction = function(o, fn, data)  {
        if (typeof data.message === 'function') {
            o[fn] = data.message;
        }
        
    }
};

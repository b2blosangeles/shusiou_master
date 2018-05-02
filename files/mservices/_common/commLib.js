var _commLib = function () {
    console.log('---arguments.callee.name--->>');
    console.log(arguments.callee);
    this.transferFunction = function(o, fn, data)  {
        
        
        if (typeof data.message === 'function') {
            o[fn] = data.message;
            delete data.message;
        }
        
    }
};

var _commLib = function () {
    this.transferFunction = function(o, fn, data)  {
        console.log('---arguments.callee.name---');
        console.log(arguments.callee);
        if (typeof data.message === 'function') {
            o[fn] = data.message;
            delete data.message;
        }
        
    }
};

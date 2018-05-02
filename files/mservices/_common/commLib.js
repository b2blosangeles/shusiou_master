var _commLib = function () {
    this.transferFunction = function(o, fn, data)  {
        alert('---arguments.callee.name---');
        alert(arguments.callee.name);
        if (typeof data.message === 'function') {
            o[fn] = data.message;
            delete data.message;
        }
        
    }
};

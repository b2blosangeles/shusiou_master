var _commLib = function () {

    this.transferFunction = function(o, calle, data)  {
         console.log('---arguments.callee.name-===>>');
        console.log(calle);       
        
        if (typeof data.message === 'function') {
            o[fn] = data.message;
            delete data.message;
        }
        
    }
};

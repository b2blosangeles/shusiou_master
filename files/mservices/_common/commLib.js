var _commLib = function () {

    this.transferFunction = function(o, data, caller)  {
        let fn = caller + '_' + 'message';    
        for (var key in data) {
            console.log(key + '===')
            if (typeof data[key] === 'function') {
                o[key] = data[key];
                delete data[key];
            }      
        }
        
    }
};

function find(obj, item, value) {   
    function objFind(obj, item, value){
        for(var key in obj) {                                  

           if(obj[key] && obj[key].length ==undefined) {     
                if(obj[item]==value){
                    return obj;
                }
              objFind(obj[key], item, value);             
                
            }else{ 
                if(obj[key] && obj[key].length >0){
                    if(Array.isArray(obj[key])){
                        for(var i=0;i<obj[key].length;i++){
                            var results = objFind(obj[key][i], item, value);
                            if(typeof results === "object"){
                                return results;
                            }
                        }
                    }
                }
            }
        }
    }
    if(obj.length >0){
        for(var i=0;i<obj.length;i++){
            var results=objFind(obj[i], item, value);
            if(typeof results === "object"){
                return results;
            }
        }
    }
    else{
       var results=objFind(obj, item, value);
        if(typeof results === "object"){
            return results;
        }
    }
}
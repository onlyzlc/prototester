
module.exports = function(obj1,obj2){
    Object.freeze(obj1);
    Object.freeze(obj1);

    var f1=obj1 instanceof Object;
    var f2=obj2 instanceof Object;
    if(!f1 || !f2){
        return obj1===obj2
    }
    if(Object.keys(obj1).length!== Object.keys(obj2).length){
        return false
    }
    for(var p in obj1){
        var a= obj1[p] instanceof Object; 
        var b= obj2[p] instanceof Object; 
        if(a && b){
            equals(obj1[p],obj2[p])
        }else if(obj1[p]!=obj2[p]){
            return false;
        }
    }
    return true;
}

/*
we use modules to keep pieces of code that are related to one another together
*/


//its a app on its own
//ultimately its a object
var budgetController = (function(){
    var a = 10;
    var add = function(x){
        return a+x;
    }

    return {
        addPublic: function(y){
            return add(y);
        }
    }
})();

var UIController = (function(){
    //all code for ui change goes here
})();


//helps to connect budget controller and uicontroller
var controller = (function(budgetCntrl, UICntrl){
    var z = budgetCntrl.addPublic(100);
    return {
        showResult: function(){
            console.log(z);
        },
        name: 'Pankaj'
    }
})(budgetController, UIController);
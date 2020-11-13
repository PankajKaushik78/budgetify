
var budgetController = (function(){

})();

var UIController = (function(){

    var DOM = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOM.inputType).value,
                description: document.querySelector(DOM.inputDescription).value,
                value: document.querySelector(DOM.inputValue).value
            }
        },
        getDOMStrings: function(){
            return DOM;
        }
    }


})();

var controller = (function(budgetCntrl, UICntrl){

    var DOM = UICntrl.getDOMStrings();
    
    var ctrlAddItem = function(){
        var input = UICntrl.getInput();
        console.log(input);
    }

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.key === 'Enter'){
            ctrlAddItem();
        }
    });

})(budgetController, UIController);

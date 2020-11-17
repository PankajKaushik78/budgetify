

var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });

        data.totals[type] = sum;
    };

    return {
        addItem : function(type, desc, val){
            var id, newItem;

            if(data.allItems[type].length === 0){
                id = 0;
            }else{
                id = data.allItems[type][data.allItems[type].length-1].id + 1;
            }

            if(type === 'inc'){
                newItem = new Income(id,desc,val);
            }else if(type === 'exp'){
                newItem = new Expense(id, desc, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: function(){
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            else
                data.percentage = -1;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing : function(){
            console.log(data.allItems);
        }
    }

})();

var UIController = (function(){
    
    var DOM = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetIncome: '.budget__income--value',
        budgetExpense: '.budget__expenses--value',
        totalPercentage: '.budget__expenses--percentage',
        budgetValue: '.budget__value',
    }
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOM.inputType).value,
                description: document.querySelector(DOM.inputDescription).value,
                value: parseFloat(document.querySelector(DOM.inputValue).value)
            }
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            
            if(type === 'inc'){
                element = DOM.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element = DOM.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOM.inputDescription + ', ' + DOM.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current){
                current.value = "";
            }); 
            fieldsArr[0].focus();
        },

        updateUI: function(){
            var budget = budgetController.getBudget();
            document.querySelector(DOM.budgetIncome).textContent = budget.totalInc > 0 ? '+' + budget.totalInc : budget.totalInc;
            document.querySelector(DOM.budgetExpense).textContent = budget.totalExp > 0 ? '-' + budget.totalExp : budget.totalExp;
            document.querySelector(DOM.budgetValue).textContent = budget.budget;
            if(budget.percentage > 0)
                document.querySelector(DOM.totalPercentage).textContent = budget.percentage + '%';
            else 
                document.querySelector(DOM.totalPercentage).textContent = '---';
        },

        getDOMStrings: function(){
            return DOM;
        }
    }
    
    
})();

var controller = (function(budgetCntrl, UICntrl){
    
    var setupEventListeners = function(){
        var DOM = UICntrl.getDOMStrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event){
            if(event.key === 'Enter'){
                ctrlAddItem();
            }
        });
    };
    
    var updateBudget = function(){        
        //calculate the budget
        budgetCntrl.calculateBudget();

        //return the budget
        var budget = budgetCntrl.getBudget();

        //display the budget
        UICntrl.updateUI();

    };
    
    var ctrlAddItem = function(){
        var input, newItem;

        input = UICntrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value !== 0){
            newItem = budgetCntrl.addItem(input.type, input.description, input.value);
            UICntrl.addListItem(newItem,input.type);
            UICntrl.clearFields();
            updateBudget();
        }
    };
    
    return {
        init: function(){
            console.log("Application started!");
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();
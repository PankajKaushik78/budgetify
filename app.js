

var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
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

        deleteItem: function(type, id){
            var ids, index;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
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

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var percentages = data.allItems.exp.map(function(curr){
                return curr.percentage;
            });
            return percentages;
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
        container: '.container',
        itemPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    }

    var formatNumber = function(num, type){
        var number, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);
        number = num.split('.');

        int = number[0];
        dec = number[1];

        if(int.length > 3){
            int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);
        }

        return (type === 'inc' ? '+' : '-') + ' ' + int + '.' + dec;
    }; 
    
    var nodeListForEach = function(list, callback){
        for(var i=0; i<list.length; i++){
            callback(list[i], i);
        }
    };

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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element = DOM.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteItem: function(itemID){
            var el = document.getElementById(itemID);
            el.parentNode.removeChild(el);
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
            var budget, type;

            budget = budgetController.getBudget();
            type = '';
            if(budget.budget !== 0){
                type = (budget.budget > 0 ? 'inc' : 'exp');
            }

            document.querySelector(DOM.budgetIncome).textContent = formatNumber(budget.totalInc,'inc');
            document.querySelector(DOM.budgetExpense).textContent = formatNumber(budget.totalExp, 'exp');
            document.querySelector(DOM.budgetValue).textContent = formatNumber(budget.budget,type);
            if(budget.percentage > 0)
                document.querySelector(DOM.totalPercentage).textContent = budget.percentage + '%';
            else 
                document.querySelector(DOM.totalPercentage).textContent = '---';
        },

        updatePercentagesUI: function(percentageList){
            var nodeList = document.querySelectorAll(DOM.itemPercentageLabel);

            nodeListForEach(nodeList, function(current, idx){
                if(percentageList[idx] > 0)
                    current.textContent = percentageList[idx] + '%';
                else
                    current.textContent = '---';
            });
        },

        getDate: function(){
            var now, year, month, monthList;
            monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            year = now.getFullYear();
            month = monthList[now.getMonth()];
            document.querySelector(DOM.dateLabel).textContent = month + ', ' + year; 
        },

        changeType: function(){
            var fields;

            fields = document.querySelectorAll(
                DOM.inputType + ',' + 
                DOM.inputDescription + ',' +
                DOM.inputValue
            );

            nodeListForEach(fields, function(curr){
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOM.inputButton).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICntrl.changeType);
    };
    
    var updateBudget = function(){        
        //calculate the budget
        budgetCntrl.calculateBudget();

        //return the budget
        var budget = budgetCntrl.getBudget();

        //display the budget
        UICntrl.updateUI();

    };

    var updatePercentages = function (){
        //1. Calculate the percentages
        budgetCntrl.calculatePercentages();

        //2. Read the percentages
        var percentages = budgetCntrl.getPercentages();

        //3. Update the budget in ui
        UICntrl.updatePercentagesUI(percentages);
    };
    
    var ctrlAddItem = function(){
        var input, newItem;

        input = UICntrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value !== 0){
            newItem = budgetCntrl.addItem(input.type, input.description, input.value);
            UICntrl.addListItem(newItem,input.type);
            UICntrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            //inc-1 or exp-1
            splitID = itemID.split('-'); // ['inc', '1']
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //Delete the item from the data structure
            budgetCntrl.deleteItem(type,ID);
            //Delete the item from the ui
            UICntrl.deleteItem(itemID);
            //Update the budget
            updateBudget();

            updatePercentages();
        }
    };
    
    return {
        init: function(){
            console.log("Application started!");
            UICntrl.getDate();
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();
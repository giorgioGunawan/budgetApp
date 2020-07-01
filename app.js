var print = function(x){
    console.log(x);
}

// budget controller
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentages = -1;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    Expense.prototype.calculatePercentage = function(totalIncome){
        
        if( totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }        
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    
    var data = {
        allItems:{
            exp: [],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget: 0,
        percentage: -1
    };
        
    var calculateTotal = function(type){
        
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum = sum + current.value;
        });
        
        data.totals[type] = sum;
    };
    
    return {
        addItem: function(type, des, val){
            
            var newItem, ID;
            
            // basically getting the last ID
            // create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            // create new item based on inc or exp type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            // push it into our data structure
            data.allItems[type].push(newItem);
            
            // return new element
            return newItem;
            
        },
        
        deleteItem: function(type, id){
            var ids, index;
            
            // ids example ids = [1 2 4 6 8]
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function(){
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calcullate budget: income and expensses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }else{
                data.percentage = -1;
            }
        },
        
        calculatePercentages: function(){
            
            data.allItems.exp.forEach(function(cur){
               cur.calculatePercentage(data.totals.inc); 
            });
            
        },
        
        getPercentages: function(){
            // here we use map because we want to return smth and store it somehwere
            var allPerc = data.allItems.exp.map(function(cur){
                
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        testing: function(){
            print(data);
        },
        
        getBudget: function() {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    };
    
})();


// UI Controller
var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        
    };
    
    var formatNumber =  function(num, type){
            var numSplit, int, dec;
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            // if more than athousand, we use comma 
            if(int.length > 3){
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3,3); 
            }
            dec = numSplit[1];
            
            type === 'exp' ? sign = '-' : sign = '+';
            
            return (type === 'exp' ? '-' :  '+') + ' ' + int + '.' +  dec;
    };
    var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    // current and index
                    callback(list[i], i);
                }
    };
    
    // whatever we return will be assigned to UIController var
    return{
        getinput: function(){
            return {
                 // get value of type whoch is income(inc) or expenses(exp)
                type: document.querySelector(DOMstrings.inputType).value,

                // get description of income/expense 
                description: document.querySelector(DOMstrings.inputDescription).value,

                // get value of money 
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if(type === "inc"){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === "exp"){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace ('%value%', formatNumber(obj.value, type));
            newHtml = newHtml.replace('%description%', obj.description);
            
            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        // basically a getter!
        getDOMstrings: function(){
            return DOMstrings;
        },
        
        deleteListItem: function(selectorID){
        
            var selection = document.getElementById(selectorID);
            selection.parentNode.removeChild(selection);
            
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            // Slice a list into an array!
            fieldsArr = Array.prototype.slice.call(fields);
            
            // this is a special javascript method!
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            
            // after entering something, it clears and then mouse goes back to
            // the first field, which is the description
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj){
            var type;
            obj.budget >= 0 ? type = 'inc' : type  = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
        displayPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            
            nodeListForEach(fields, function(current, index){
                
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }                
            });
            
        },
        
        displayMonth: function(){
            var now, year, month, months;
            now = new Date();
            months = ['January', 'February','March', 'April','May', 'June','July', 'August','September', 'October','November', 'December',]
            month = months[now.getMonth() - 1];
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;
        },
        
        changedType: function(){
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
            );
            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        }
    }
})();

// Global Controller
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        // an alternative when someone presses the enter key instead of the button
        document.addEventListener('keypress', function(e){    
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    
    var updateBudget = function(){
        
        // 1. calculate budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget - return and nothing else! want code to be more modular
        var budget =budgetCtrl.getBudget();
        
        // 3. display the budget on ui
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function(){
    
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. update UI with new percentages
        UICtrl.displayPercentages(percentages);
    };
    
    var ctrlAddItem = function(){
        var input, newItem, addList;
        
        // 1. get filled input data
        input = UICtrl.getinput();
        print("out");
        // description  shouldnt be empty and the input value should be a number
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            
            print("in");
            // 2. add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add item to UI
            addList = UICtrl.addListItem(newItem, input.type);

            // 4. clear fields
            UICtrl.clearFields();

            // 5. Final Budget Update
            updateBudget();
            
            // 6. Calculate percentages and update percenartages
            updatePercentages();
        }
    };    
    
    var ctrlDeleteItem = function(e){
        var itemID,splitID;
        
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete tjhe iten from data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show new budget
            updateBudget();
            
            // 4. Update and show new percentages
            updatePercentages();
        }
    };
    
    return{
        init: function(){
            
            print('Application has started.');
            UICtrl.displayBudget({
                
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
            UICtrl.displayMonth();
        }
    };
})(budgetController, UIController);

// Just one initialisation function!
controller.init();





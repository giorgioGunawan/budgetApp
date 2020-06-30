var print = function(x){
    console.log(x);
}

// budget controller
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
        allItems:{
            exp: [],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        }
    }
    
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
        
        testing: function(){
            print(data);
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
        expensesContainer: '.expenses__list'
    }
    // whatever we return will be assigned to UIController var
    return{
        getinput: function(){
            return {
                 // get value of type whoch is income(inc) or expenses(exp)
                type: document.querySelector(DOMstrings.inputType).value,

                // get description of income/expense 
                description: document.querySelector(DOMstrings.inputDescription).value,

                // get value of money 
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if(type === "inc"){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === "exp"){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace ('%value%', obj.value);
            newHtml = newHtml.replace('%description%', obj.description);
            
            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        // basically a getter!
        getDOMstrings: function(){
            return DOMstrings;
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
    };
    
    var ctrlAddItem = function(){
        var input, newItem, addList;
        
        // 1. get filled input data
        input = UICtrl.getinput();
        
        // 2. add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. add item to UI
        addList = UICtrl.addListItem(newItem, input.type);
        
        // 4. clear fields
        UICtrl.clearFields();
        // 4. calculate budge
        
        // 5. display the budget on ui
    }    
    
    return{
        init: function(){
            print('Application has started.');
            setupEventListeners();
        }
    };
})(budgetController, UIController);

// Just one initialisation function!
controller.init();





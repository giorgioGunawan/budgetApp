// budget controller
var budgetController = (function(){
    
    
})();


// UI Controller
var UIController = (function(){
    
})();

// Global Controller
var controller = (function(budgetCtrl, UICtrl){
    
    document.querySelector('.add__btn').addEventListener('click', function(){
        
        // 1. get filled input data
        
        // 2. add item to the budget controller
        
        // 3. add item to UI
        
        // 4. calculate budge
        
        // 5. display the budget on ui
        
    });
    
    // an alternative when someone presses the enter key instead of the button
    document.addEventListener('keypress', function(e){    
        
        if(e.keyCode === 13){
            console.log("enter key pressed");
        }
    });
    
})(budgetController, UIController);
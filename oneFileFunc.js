const addNewTransactionBtn = document.getElementById('open-btn');
const modal = document.querySelector('.new-transaction');
const form = document.getElementById('new-transaction__form');
const backdrop = document.querySelector('.backdrop');
const checkBoxInputs = document.getElementById('checkboxes').querySelectorAll('input');//two checkbox inputs
const cancelTransactionBtn = document.querySelector('.new-transaction__cancel');
const emptyListEl = document.getElementById('empty-list');
const ul = document.querySelector('.history-lists');
const incomeEl = document.getElementById('balance__total-income').querySelector('span');
const expenseEl = document.getElementById('balance__total-expense').querySelector('span');


const allExpenses =[];//store all expenses here
let idToRemove;


const deleteExpense = (identifier)=>{
    const index = allExpenses.findIndex(el=> el.id ==identifier);
    ul.removeChild(ul.children[index]);
    allExpenses.splice(index, 1);
    renderBalance(allExpenses);//to rerender ul in html without deleted el
}


let total_balance = 0;
const income = 'new-income';
const expense = 'new-expense';

let checkedboxInput=document.getElementById('new-income');

function validateCheckboxHandler(event){
    checkedboxInput.checked=false;
    checkedboxInput = event.currentTarget;
}



function addNewExpenseHandler(event){
    event.preventDefault();
    const new_name_value  = document.getElementById('new-transaction__name').value;//form[0].value
    
    if(new_name_value.trim().length<2){
        alert('empty expense description is not accepted, please enter at least two characters');
        return; 
    }

    const new_amount_value  = document.getElementById('new-transaction__amount').value;//form[1].value
    if(new_amount_value.length<1){
        alert('amount field is empty, please enter amount');
        return; 
    }
    const converetd = +new_amount_value *100/100;
    const validatedAmount = converetd < 0? -1* converetd:  converetd;
    
    if(!checkBoxInputs[0].checked && !checkBoxInputs[1].checked){//if nor checkboxes was checked, if both false
        const error = checkBoxInputs.querySelector('checkbox-error');
        error.classList.add('show-error');
        return;
    }
    
    //create object that will store the values of new transaction
    const newTransaction = {
        id: Math.random(),
        transaction_name: new_name_value,
        transaction_amount: validatedAmount/*number*/,
        operation: checkedboxInput.id
    }

    console.log(newTransaction)
    allExpenses.push(newTransaction);

    renderExpenses(newTransaction);
    renderBalance(allExpenses);    

    clearInput();
    toggleModal();

}

function renderExpenses(newItem){
    const clonedTemplate = document.getElementById('template').content.cloneNode(true); 
    const newListEl = clonedTemplate.querySelector('li');
    newListEl.id = newItem.id;
  
    const p1 = newListEl.querySelector('.history-list__name');
    const p2 =  newListEl.querySelector('.history-list__amount');

    p1.textContent = newItem.transaction_name;
    p2.textContent = newItem.transaction_amount;

   
    
    if( newItem.operation===income){
        newListEl.classList.add('positive')
    } else{ newListEl.classList.add('negative')}

    ul.addEventListener('click', event=>{
        event.stopImmediatePropagation();
        deleteExpense(event.target.closest('li').id);

    });    
    ul.append(newListEl);
  
}

function renderBalance(allExpenses){
    const totalBalanceEl = document.getElementById('balance__total').querySelector('span');//in span amount
    
    if(allExpenses.length===0){
        totalBalanceEl.textContent =0;
        emptyListEl.classList.remove('disabled');
    } else{
        emptyListEl.classList.add('disabled');
    }
    

    const [positive, negative] = totalInOut(allExpenses);
    const total = positive - negative;    
    totalBalanceEl.textContent = total; 
    incomeEl.textContent = positive;
    expenseEl.textContent = negative*-1;

}

function totalInOut(arr){        
    
        const filteredIncome = arr.filter(el=>el.operation===income);
        const totalIncome = filteredIncome.reduce((acc, el)=>acc+el.transaction_amount, 0);
    
        const filteredExpense = arr.filter(el=>el.operation===expense);
        const totalExpense = filteredExpense.reduce((acc, el)=>acc+el.transaction_amount, 0);
    
    return [totalIncome, totalExpense];
 
}

const clearInput = ()=>{
    form.querySelector('input').value = '';
    form.querySelector('textarea').value = '';
}

const toggleModal = ()=>{
    backdrop.classList.toggle('disabled');
    modal.classList.toggle('disabled');
}


addNewTransactionBtn.addEventListener('click', toggleModal);//openModal
cancelTransactionBtn.addEventListener('click', toggleModal);//closeModal
backdrop.addEventListener('click', toggleModal);//close the modal when backdrop is clicked
checkBoxInputs.forEach(checkbox=>checkbox.addEventListener('change', validateCheckboxHandler));
form.addEventListener('submit', addNewExpenseHandler);




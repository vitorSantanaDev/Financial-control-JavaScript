const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const form = document.querySelector('#form');

const localstorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))

let transactions = localStorage
    .getItem('transactions') !== null ? localstorageTransactions : [];

const removeTransaction = ID => {
    transactions = transactions
    .filter((transaction) => transaction.id !== ID);
    updateLocalStorage();
    init();
}

const addTransactionDom = ({name, amount, id}) => {

    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
    ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">
    <i class="fas fa-trash"></i>
    </button>
    `
    transactionsUl.prepend(li);
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter((value) => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0)).toFixed(2);

const getIncome = transactionsAmounts => transactionsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0).toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0).toFixed(2);

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount);

    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts);
    const expense = getExpenses(transactionsAmounts);
    
    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
}


const init = () => {
    transactionsUl.innerHTML = '';

    transactions.forEach(addTransactionDom);
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateID = () => Math.round(Math.random() * 1000);

const addTransactionsToArray = (transactionName, transactionAmount) =>{
    transactions.push( {
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
}

const handleFormSubmit = event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

    if(isSomeInputEmpty){
        window.alert('Por favor preencha todos os campos!');
        return
    }

    addTransactionsToArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    cleanInputs();
}
form.addEventListener('submit', handleFormSubmit)
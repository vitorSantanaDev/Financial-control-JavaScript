const transactionsUl = document.querySelector('#transactions') // SELECIONANDO A ul VAZIA DO DOCUMENTO HTML
const incomeDisplay = document. querySelector('#money-plus') // ID QUE EXIBE O VALOR TOTAL DAS RECEITAS
const expenseDisplay = document.querySelector('#money-minus') // ID QUE EXIBE O VALOR TOTAL DAS DESPESAS
const balanceDisplay = document.querySelector('#balance') // ID QUE EXIBE O SALDO TOTAL
const form = document.querySelector('#form') // ID DO FORM
const inputTransactionName = document.querySelector('#text') // ID DO INPUT COM O NOME DA TRANSAÇÃO
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions =  JSON.parse(localStorage
    .getItem('transations'))

let transactions = localStorage
    .getItem('transations') !== null ? localStorageTransactions : []

// FUNÇÃO PARA REMOVER AS TRANSAÇÃOES
const removeTransaction = ID =>{
     transactions  =  transactions .filter(transaction => 
        transaction.id !== ID)
    updateLocalStorage()
    initial()
}

const addTransactionIntoDom = transaction => {
    const operator = transaction.amount < 0 ? '-': '+' // FAZENDO UMA VERIFICAÇÃO NO AMOUNT PARA ADICONAR AS STRINS
    const cssClass = transaction.amount < 0 ? 'minus' : 'plus' // FAZENDO OUTRA VERIFICAÇÃO PARA ADICIONARMOS AS CLASSES
    const amountWidthoutOperator = Math.abs(transaction.amount) // O METÓDO 'Math.abs' RETORNA O VALOR ABSOLUTO DO VALOR CONTIDO NO AMOUNT
    const li = document.createElement('li') // CRIANDO UMA 'li' DENTRO DA VARIAVÉL 'LI'

    li.classList.add(cssClass) // ADICIONANDO A 'cssClass' DENTRO DA VARIAVÉL 'LI'

    // FAZENDO UMA INTERPOLAÇÃO COM OS ELEMENTOS
    li.innerHTML = `
    ${transaction.name} <span> ${operator} R$ ${amountWidthoutOperator} </span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
    </button>
    `

    transactionsUl.prepend(li) // ADICIONANDO A 'LI' NA UL VAZIA DO DOCUMENTO
}

// CRIANDO FUNÇÃO QUE IRA RETORNAR A SUBTOTAL DOS VALORES
const getExpenses = transactionsAmount =>  Math.abs(transactionsAmount
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncome = transactionsAmount => transactionsAmount
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmount => transactionsAmount
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () =>{
    const transactionsAmount =  transactions.map(({amount}) => amount)

    const total = getTotal(transactionsAmount)
    const income = getIncome(transactionsAmount)
    const expense = getExpenses(transactionsAmount)
    
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

// QUANDO A PAGÍNA FOR CARREGADA A INITIAL VAI ADICIONAR A TRANSAÇÕES NO DOM
const initial = () =>{
    transactionsUl.innerHTML = ''
     transactions .forEach(addTransactionIntoDom)
    updateBalanceValues()
}

initial()

// FUNÇÃO QUE VAI ADICIONAR AS TRANSAÇÕES NO LOCALSTORAGE
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

// FUNÇÃO PARA GERAR 'IDS' ALEATÓRIOS
const generateId = () => Math.round(Math.random() * 1000)

const addTransactionsArray = (transactionName, trasactionAmount) => {
    transactions.push( {
        id: generateId(), 
        name: transactionName, 
        amount: Number(trasactionAmount)
    })
}

const clearInpust = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event =>{
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeInputEmpty){
        alert('Por favor preencha tanto o nome, quanto o valor da transação!')
        return
    }

    addTransactionsArray(transactionName, transactionAmount)
    initial()
    updateLocalStorage()
    clearInpust()
}

// FUNÇÃO PARA VERIFICAR SE O USUÁRIO PREENCHEU O FORMULÁRIO CORRETAMENTE
form.addEventListener('submit', handleFormSubmit)
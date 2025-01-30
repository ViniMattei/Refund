// Seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseTotal = document.querySelector("aside header h2")
const expenseQuantity = document.querySelector("aside header p span")

// Captura o evento de input para formatar o valor
amount.oninput = () => {
  //Obtem o valor atual do input e remove todos os caracteres não numéricos
  let value = amount.value.replace(/\D/g, "")

  // Transforma o valor em  centavos (exemplo 150 / 100 = 1.50 que é igual a R$ 1,50)
  value = Number(value) / 100

  // Atualiza o valor do input
  amount.value = formatCurrency(value)
}

// Função para formatar o valor em moeda(BRL)
function formatCurrency(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}

// Captura o evento de submit do formulário
form.onsubmit = (event) => {
  // Previne o comportamento padrão do formulário
  event.preventDefault()

  // Cria um objeto com os dados da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  // chama a função para adicionar a nova despesa
  expenseAdd(newExpense)
}

// Adiciona a nova despesa na lista
function expenseAdd(newExpense) {
  try {
    // cria o elemento de li para adicionar o item na lista(ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // cria o icone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adicionar name e categoria na div das informações
    expenseInfo.append(expenseName, expenseCategory)

    // cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    // cria o icone de remove
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "Remover despesa")

    // Adiciona as informação no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // adiciona o item na lista
    expenseList.append(expenseItem)

    // limpa os campos do formulário
    formClear()

    // atualiza os totais
    updateTotals()
  } catch (error) {
    alert("Não foi possível adicionar a despesa")
    console.error(error)
  }
}

// atualiza os totais

function updateTotals() {
  try {
    // recupera todos os itens da (li) da lista (ul)
    const items = expenseList.children

    // atualiza a quantidade de itens na lista
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "depesas" : "depesa"
    }`
    // varivael para armazenar o total
    let total = 0

    // percorre todos os itens da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmont = items[item].querySelector(".expense-amount")

      // remove caracteres não numéricos e substitui a virgula por ponto
      let value = itemAmont.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      // converte o valor para float
      value = parseFloat(value)

      // verifica se o valor é um número
      if (isNaN(value)) {
        return alert("Valor inválido")
      }

      // imprera o valor ao total
      total += Number(value)
    }

    // cria a span para adiciona a Rs formatação
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // formata o valor e remove o R$ que sera exibindo pelo small
    total = formatCurrency(total).toUpperCase().replace("R$", "")

    // limpa o conteudo atual do elemento
    expenseTotal.innerHTML = ""

    // adiciona o simbolo e o total no elemento
    expenseTotal.append(symbolBRL, total)
  } catch (error) {
    console.error(error)
    alert("Não foi possível atualizar os totais")
  }
}

// evento que captura o click no icone de remover
expenseList.addEventListener("click", function (event) {
  // verifica se o elemento clicado é o icone de remover
  if (event.target.classList.contains("remove-icon")) {
    // obtem a li pai do elemento clicado
    const item = event.target.closest(".expense")

    // remove o item da lista
    item.remove()

    // atualiza os totais
    updateTotals()
  }
})

function formClear() {
  // limpa os campos do formulário
  expense.value = ""
  amount.value = ""
  category.value = ""

  // foca no campo de despesa
  expense.focus()
}

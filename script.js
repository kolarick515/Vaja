const expenseContainer = document.getElementById('additionalExpenses');
const addExpenseButton = document.getElementById('addExpense');
const calculateButton = document.getElementById('calculate');
const expenseTemplate = document.getElementById('expenseTemplate');

const numberInput = (id) => Number(document.getElementById(id).value) || 0;
const eur = new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR' });

function createExpenseRow() {
  const fragment = expenseTemplate.content.cloneNode(true);
  const row = fragment.querySelector('.expense-row');
  row.querySelector('.remove').addEventListener('click', () => row.remove());
  expenseContainer.appendChild(fragment);
}

function readAdditionalExpenses() {
  const rows = [...expenseContainer.querySelectorAll('.expense-row')];

  return rows
    .map((row) => ({
      name: row.querySelector('.expense-name').value.trim() || 'Dodatni strošek',
      person: row.querySelector('.expense-person').value,
      amount: Number(row.querySelector('.expense-amount').value) || 0,
    }))
    .filter((item) => item.amount > 0);
}

function calculate() {
  const trgovinaKatja = numberInput('trgovinaKatja');
  const polozniceKristjan = numberInput('polozniceKristjan');
  const otroskiDodatek = numberInput('otroskiDodatek');
  const vrtec = numberInput('vrtec');

  const additionalExpenses = readAdditionalExpenses();
  const additionalTotal = additionalExpenses.reduce((sum, item) => sum + item.amount, 0);
  const additionalKatja = additionalExpenses
    .filter((item) => item.person === 'Katja')
    .reduce((sum, item) => sum + item.amount, 0);
  const additionalKristjan = additionalExpenses
    .filter((item) => item.person === 'Kristjan')
    .reduce((sum, item) => sum + item.amount, 0);

  const sharedPool = trgovinaKatja + polozniceKristjan + additionalTotal;
  const katjaTarget = sharedPool * 0.5 + vrtec * 0.4;
  const kristjanTarget = sharedPool * 0.5 + vrtec * 0.6 - otroskiDodatek;

  const katjaActual = trgovinaKatja + additionalKatja;
  const kristjanActual = polozniceKristjan + vrtec + additionalKristjan - otroskiDodatek;

  const katjaDifference = katjaTarget - katjaActual;
  const kristjanDifference = kristjanTarget - kristjanActual;

  document.getElementById('totalExpenses').textContent = eur.format(sharedPool + vrtec - otroskiDodatek);
  document.getElementById('katjaTarget').textContent = eur.format(katjaTarget);
  document.getElementById('kristjanTarget').textContent = eur.format(kristjanTarget);
  document.getElementById('katjaActual').textContent = eur.format(katjaActual);
  document.getElementById('kristjanActual').textContent = eur.format(kristjanActual);

  const settlement = document.getElementById('settlement');

  if (Math.abs(katjaDifference) < 0.01 && Math.abs(kristjanDifference) < 0.01) {
    settlement.textContent = 'Poravnava ni potrebna. Oba sta pokrila svoj delež.';
  } else if (katjaDifference > 0) {
    settlement.textContent = `Katja naj nakaže Kristjanu ${eur.format(katjaDifference)}.`;
  } else {
    settlement.textContent = `Kristjan naj nakaže Katji ${eur.format(Math.abs(kristjanDifference))}.`;
  }

  document.getElementById('results').classList.remove('hidden');
}

addExpenseButton.addEventListener('click', createExpenseRow);
calculateButton.addEventListener('click', calculate);

createExpenseRow();

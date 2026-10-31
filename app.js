document.addEventListener('DOMContentLoaded', function () {
  // Find the page elements used below.
  const itemRows = document.getElementById('items');
  const totalOutput = document.getElementById('total');
  const menuSuggestions = document.getElementById('menu');
  const addButton = document.getElementById('add');
  const orderForm = document.getElementById('order');

  // Store prices in cents so adding money does not introduce rounding errors.
  const pricesByName = new Map();

  for (const menuItem of menu) {
    const name = menuItem.name.toLowerCase();
    const priceInCents = Math.round(menuItem.price * 100);

    pricesByName.set(name, priceInCents);
  }

  // Sort the suggestions alphabetically by item name.
  const sortedMenu = [...menu];

  sortedMenu.sort(function (firstItem, secondItem) {
    return firstItem.name.localeCompare(secondItem.name);
  });

  for (const menuItem of sortedMenu) {
    const option = document.createElement('option');

    option.value = menuItem.name;
    option.label = '$' + menuItem.price.toFixed(2);

    menuSuggestions.append(option);
  }

  function updateTotal() {
    const inputs = itemRows.querySelectorAll('input');
    let totalInCents = 0;

    for (const input of inputs) {
      const enteredName = input.value.trim().toLowerCase();
      const priceInCents = pricesByName.get(enteredName);
      const priceOutput = input.parentElement.querySelector('output');

      // Blank, incomplete, or unknown item names do not count toward the total.
      if (priceInCents === undefined) {
        priceOutput.value = '';
        continue;
      }

      const quantity = Number(input.parentElement.querySelector('select').value);
      const rowTotalInCents = priceInCents * quantity;
      const priceInDollars = rowTotalInCents / 100;

      priceOutput.value = '$' + priceInDollars.toFixed(2);
      totalInCents += rowTotalInCents;
    }

    const totalInDollars = totalInCents / 100;

    totalOutput.value = '$' + totalInDollars.toFixed(2);
  }

  function addItem() {
    const newRow = document.createElement('div');
    const newInput = document.createElement('input');
    const newPriceOutput = document.createElement('output');
    const newQuantitySelect = itemRows.querySelector('select').cloneNode(true);

    newQuantitySelect.value = '1';

    newInput.type = 'text';
    newInput.placeholder = 'Menu item';
    newInput.autocomplete = 'off';

    // Give each new input the same menu suggestions as the first input.
    newInput.setAttribute('list', 'menu');

    newRow.append(newInput, ' ', newQuantitySelect, ' ', newPriceOutput);
    itemRows.append(newRow);

    newInput.focus();
  }

  function resetOrder(event) {
    // Handle resetting here so we can also remove the extra rows.
    event.preventDefault();

    while (itemRows.children.length > 1) {
      itemRows.lastElementChild.remove();
    }

    const firstInput = itemRows.querySelector('input');

    firstInput.value = '';
    itemRows.querySelector('select').value = '1';

    updateTotal();
  }

  // Connect the page actions to their functions.
  itemRows.addEventListener('input', updateTotal);
  itemRows.addEventListener('change', updateTotal);
  addButton.addEventListener('click', addItem);
  orderForm.addEventListener('reset', resetOrder);

  orderForm.addEventListener('submit', function (event) {
    event.preventDefault();
  });
});

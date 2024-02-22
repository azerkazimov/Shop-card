let products = [
  {
    id: 1,
    name: "Jacket",
    price: 99.9,
    image: "images/jacket.jpeg",
    info: "Jacket",
  },
  {
    id: 2,
    name: "Jeans",
    price: 86.9,
    image: "images/jeans.jpeg",
    info: "Jeans",
  },
  {
    id: 3,
    name: "Shoes",
    price: 49.9,
    image: "images/shoes.jpeg",
    info: "Shoes",
  },
];

const catalog = document.querySelector(".products .row");
const shoppingCartTableBody = document.querySelector(".table tbody");
const selectedProducts = new Map();

// Render the products in the catalog
function renderCatalog() {
  const fragment = document.createDocumentFragment();

  products.forEach(function (product) {
    const card = document.createElement("div");
    card.classList.add("col-md-4");
    card.innerHTML = `
      <div class="card" data-name="${product.name}">
          <img src="${product.image}" class="card-img-top" alt="..." >
          <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.info}</p>
              <p class="card-text">${product.price} AZN</p>
              <a href="#" class="btn btn-secondary add-item">Add to cart</a>
          </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  catalog.appendChild(fragment);
}
renderCatalog();

// Add product to the shopping cart
function addShopCard(e) {
  e.preventDefault();

  const productName = e.target.closest(".card").dataset.name;

  if (!selectedProducts.has(productName)) {
    const selectedProduct = products.find(
      (product) => product.name === productName
    );

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <span id="name">${productName}</span>
      </td>
      <td>
        <span id="price">${selectedProduct.price} AZN</span>
      </td>
      <td>
        <input type="number" class="form-control quantity" value="1" min="1" max="10">
      </td>
      <td>
        <span id="total">${selectedProduct.price} AZN</span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    shoppingCartTableBody.appendChild(row);
    selectedProducts.set(productName, selectedProduct);
    updateLocalStorage();

    const quantityInput = row.querySelector(".quantity");
    quantityInput.addEventListener("input", updateTotalPrice);
  }
  updateTotalPrice();
}

// Remove product from the shopping cart
function removeProduct(e) {
  e.preventDefault();
  if (e.target.classList.contains("fa-trash")) {
    const row = e.target.closest("tr");
    const productName = row.querySelector("#name").textContent;

    row.remove();
    selectedProducts.delete(productName);
    updateLocalStorage();
    updateTotalPrice();
  }
}

// Update the total price of the shopping cart
function updateTotalPrice() {
  let totalPrice = 0;

  shoppingCartTableBody.querySelectorAll("tr").forEach((row) => {
    const quantity = parseInt(row.querySelector(".quantity").value);
    const price = parseFloat(row.querySelector("#price").textContent);
    const total = parseFloat((quantity * price).toFixed(2));
    row.querySelector("#total").textContent = `${total} AZN`;
    totalPrice += total;
  });

  const countPrice = parseFloat(totalPrice.toFixed(2));
  document.getElementById("totalPrice").textContent = `${countPrice} AZN`;

  updateLocalStorage();
}

// Update the shopping cart data in local storage
function updateLocalStorage() {
  const shoppingCartItems = Array.from(
    shoppingCartTableBody.querySelectorAll("tr")
  ).map((row) => {
    const productName = row.querySelector("#name").textContent;
    const price = parseFloat(row.querySelector("#price").textContent);
    const quantity = parseInt(row.querySelector(".quantity").value);
    const total = parseFloat(row.querySelector("#total").textContent);

    return {
      productName,
      price,
      quantity,
      total,
    };
  });

  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCartItems));
}
updateTotalPrice();

// Load the shopping cart data from local storage
function loadShoppingCartFromStorage() {
  const savedItems = localStorage.getItem("shoppingCart");

  if (savedItems) {
    const shoppingCartItems = JSON.parse(savedItems);

    shoppingCartItems.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <span id="name">${item.productName}</span>
        </td>
        <td>
          <span id="price">${item.price.toFixed(2)} AZN</span>
        </td>
        <td>
          <input type="number" class="form-control quantity" value="${
            item.quantity
          }" min="1" max="10">
        </td>
        <td>
          <span id="total">${item.total.toFixed(2)} AZN</span>
        </td>
        <td>
          <button class="btn btn-danger btn-sm">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;

      shoppingCartTableBody.appendChild(row);
      selectedProducts.set(item.productName, item);
      const quantityInput = row.querySelector(".quantity");
      quantityInput.addEventListener("input", updateTotalPrice);
    });
  }
}
loadShoppingCartFromStorage();

// Event delegation for adding/removing items
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-item")) {
    addShopCard(e);
  } else if (e.target.classList.contains("fa-trash")) {
    removeProduct(e);
  }
});

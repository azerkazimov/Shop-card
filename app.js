//  Create product catalog with 3 products with id, name and price and image properties
let products = [
  {
    id: 1,
    name: "Apple",
    price: 100,
    image: "images/apple.jpeg",
    info: "Apple is a good fruit",
  },
  {
    id: 2,
    name: "Orange",
    price: 80.3,
    image: "images/orange.webp",
    info: "Orange is a good fruit",
  },
  {
    id: 3,
    name: "Banana",
    price: 30,
    image: "images/banana.jpeg",
    info: "Banana is a good fruit",
  },
];

let catalog = document.querySelector(".products .row");

// Create a function renderCatalog() to render the products in the catalog
products.forEach(function (product) {
  catalog.innerHTML += `
    <div class="col-4">
        <div class="card" data-name="${product.name}">
            <img src="${product.image}" class="card-img-top" alt="..." style="height:260px; object-fit:cover">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.info}</p>
                <p class="card-text">${product.price} AZN</p>
                <a href="#" class="btn btn-primary add-item">Add to cart</a>
            </div>
        </div>
    </div>
    `;
});

// ==================
// Create a shop card
// ==================

const shoppingCardTableBody = document.querySelector(".table tbody");

const addShopCard = (e) => {
  e.preventDefault();

  const productName = e.target.closest(".card").dataset.name;

  const selectedProduct = products.find(
    (product) => product.name === productName
  );

  let shoppingCartItem = `
    <tr>
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
        <button class="btn btn-danger btn-sm">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
  shoppingCardTableBody.innerHTML += shoppingCartItem;

  const quantityInputs = document.querySelectorAll(".table tbody input");
  quantityInputs.forEach((input) => {
    input.addEventListener("input", updateTotalPrice);
  });
};

const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("click", addShopCard);
});

// Product total price

function updateTotalPrice() {
  let totalPrice = 0;

  const quantityInputs = document.querySelectorAll(".table tbody input");
  quantityInputs.forEach((input) => {
    const quantity = input.value;
    const price = parseFloat(
      input.parentNode.previousElementSibling.querySelector("span").textContent
    );
    const total = (quantity * price).toFixed(2);
    totalPrice += parseFloat(total);
    input.parentNode.nextElementSibling.querySelector(
      "span"
    ).textContent = `${total} AZN`;
  });

  const countPrice = `${totalPrice} AZN`;

  const totalProductsPrice = document.getElementById("totalPrice");
  totalProductsPrice.textContent = countPrice;
}





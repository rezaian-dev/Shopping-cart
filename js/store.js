// Store product data with properties such as id, name, image path, and price.
let storeProducts = [
  { id: 1, name: "Album 1", img: "assets/Images/products/Album-1.webp", price: 5000000 },
  { id: 2, name: "Album 2", img: "assets/Images/products/Album-2.webp", price: 1000000 },
  { id: 3, name: "Album 3", img: "assets/Images/products/Album-3.webp", price: 2550000 },
  { id: 4, name: "Album 4", img: "assets/Images/products/Album-4.webp", price: 3000000 },
  { id: 5, name: "Coffee", img: "assets/Images/products/Coffee.webp", price: 55000000 },
  { id: 6, name: "Shirt", img: "assets/Images/products/Shirt.webp", price: 6500000 }
];

// Retrieve user's shopping cart items and total price from LocalStorage, fallback to defaults if not available.
let userCartItems = JSON.parse(localStorage.getItem("Products")) || [];
let cartTotalPrice = JSON.parse(localStorage.getItem("TotalPrice")) || 0;

// DOM element references for manipulating the page content.
const productsContainer = document.querySelector(".store__products-container");
const removeAllBtn = document.querySelector(".cart__remove-all");
const cartItemsContainer = document.querySelector(".cart__items");
let totalPrice = document.querySelector(".cart__total-price");

// Configuring SweetAlert to be used for confirmation dialogs.
const SwalConfig = {
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#0d6efd",
  icon: "warning",
  confirmButtonText: "Yes",
  cancelButtonText: "Cancel"
};

// Function to display products in the store, called on page load.
const showStoreProducts = () => {
  storeProducts.forEach(({ name, img, price }) => {
    // Adding HTML for each product in the store.
    productsContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="col">
        <div class="card h-100 product-card">
          <div class="product-image-container">
            <img src="${img}" loading="lazy" class="product-image" alt="${name}">
          </div>
          <div class="card-body text-center d-flex flex-column">
            <h5 class="product-title">${name}</h5>
            <p class="product-price mb-3">$${price.toLocaleString()}</p>
            <button class="btn btn-primary mt-auto" onClick="addToCart('${name}', '${img}', ${price})">Add to Cart</button>
          </div>
        </div>
      </div>`
    );
  });
  calculateTotalPrice();  // Recalculate total price after loading products.
  createCartList();  // Display cart contents if any.
}

// Function to save cart data to LocalStorage for persistence.
const saveDataLocalStorage = () => {
  localStorage.setItem("Products", JSON.stringify(userCartItems));
  localStorage.setItem("TotalPrice", JSON.stringify(cartTotalPrice));
}

// Helper function to format the product name as a valid HTML ID.
const formatNameToId = (name) => name.replace(" ", "-");  // Replace spaces with hyphens for valid IDs.

const filterUserCart = (filterValue, propertyKey) => {
  const filterBy = propertyKey === "name" ? "name" : "count";
  userCartItems = userCartItems.filter(product => product[filterBy] !== filterValue);
}

// Function to add a product to the cart. If the product already exists, it updates its count.
const addToCart = (name, img, price) => {
  if (userCartItems.some((product) => product.name === name)) {
    updateUserCart(name, null); // If product exists, update its quantity.
  } else {
    // If product doesn't exist in the cart, add it with a quantity of 1.
    const newProduct = { id: userCartItems.length, name, img, price: +price, count: 1 };
    userCartItems.push(newProduct);
    createCartList(); // Refresh the cart items list.
  }
  saveDataLocalStorage(); // Save cart data.
  calculateTotalPrice(); // Update the total price.
}

// Function to calculate the total price based on the cart contents.
const calculateTotalPrice = () => {
  cartTotalPrice = userCartItems.reduce((sum, product) => sum + product.price * product.count, 0);
  totalPrice.innerHTML = `$${cartTotalPrice.toLocaleString()}`; // Update displayed total price.
}

// Function to remove a product from the cart with a confirmation prompt.
const removeProduct = (name) => {
  Swal.fire({
    ...SwalConfig,
    title: "Remove Product?",
    text: `Are you sure you want to remove "${name}" from your cart? This product will no longer be in your shopping list.`
  }).then((result) => {
    if (result.isConfirmed) {
      filterUserCart(name, "name"); // Remove product by name.
      createCartList();  // Update cart list.
      calculateTotalPrice();  // Recalculate total price.
      saveDataLocalStorage();  // Save updated cart to LocalStorage.

      Swal.fire({
        title: "Product Removed",
        text: `"${name}" has been successfully removed from your shopping cart.`,
        icon: "success",
        confirmButtonColor: "#0d6efd"
      });
    }
  });
}

// Function to remove all products from the cart with a confirmation prompt.
const removeAllProduct = () => {
  Swal.fire({
    ...SwalConfig,
    title: "Clear Entire Cart?",
    text: "Are you sure you want to clear your shopping cart? This action will remove all products and cannot be undone."
  }).then((result) => {
    if (result.isConfirmed) {
      cartItemsContainer.innerHTML = "";  // Clear cart list in the DOM.
      userCartItems = [];  // Reset cart items.
      createCartList();  // Refresh the cart.
      calculateTotalPrice();  // Recalculate total price.
      saveDataLocalStorage();  // Save empty cart to LocalStorage.
      cartTotalPrice = 0;  // Set total price to zero.

      Swal.fire({
        title: "Cart Cleared",
        text: "Your shopping cart has been successfully cleared.",
        icon: "success",
        confirmButtonColor: "#0d6efd"
      });
    }
  });
}

// Function to render the current cart items and their quantities in the DOM.
const createCartList = () => {
  // Toggle the "Remove All" button based on cart status.
  removeAllBtn.disabled = userCartItems.length === 0;
  filterUserCart("0","count")
  cartItemsContainer.innerHTML = "";  // Clear current cart list in the DOM.

  // If the cart contains items, display them; otherwise, show a message indicating the cart is empty.
  if (userCartItems.length) {
    userCartItems.forEach(({ name, img, price, count }) => {
      cartItemsContainer.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td class="product-cell" data-label="Product">
            <div class="d-flex align-items-center">
              <img src="${img}" loading="lazy" class="cart-item-image" alt="${name}">
              <span class="ms-3">${name}</span>
            </div>
          </td>
          <td class="text-center" data-label="Price">$${price.toLocaleString()}</td>
          <td class="text-center" data-label="Quantity">
            <input type="number" class="form-control cart-item-quantity mx-md-auto" style="max-width: 100px;" value="${count}" min="1" id="${formatNameToId(name)}" onChange="updateUserCart('${name}', event.target.value)">
          </td>
          <td class="text-center" data-label="Action">
            <button class="btn btn-link text-danger p-0 cart-item-remove" onClick="removeProduct('${name}')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="#ff0000" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
              </svg>
            </button>
          </td>
        </tr>`
      );
    });
  } else {
    // Display an empty cart message if there are no items in the cart.
    cartItemsContainer.insertAdjacentHTML("beforeend", `
      <tr class="text-center">
        <td colspan="4" class="empty-cart-message">
          <div class="alert alert-danger w-100" role="alert">
            Your cart is empty!
          </div>
        </td>
      </tr>
    `);
  }
}

// Function to update the quantity of a specific product in the cart.
const updateUserCart = (name, count) => {
  if(count === "0") {
    removeProduct(name); // If count is zero, remove the product from cart.
  }
  let quantityInputElement = document.getElementById(formatNameToId(name));
  let cartItem = userCartItems.find((item) => item.name === name);

  cartItem.count = count || ++cartItem.count;  // Update quantity or increment if not specified.
  quantityInputElement.value = cartItem.count;  // Update the input value for quantity.

  calculateTotalPrice();  // Recalculate the total price based on updated quantity.
  saveDataLocalStorage();  // Save updated data to LocalStorage.
}

// Event listeners
window.addEventListener("load", showStoreProducts); // Display products when page loads.
removeAllBtn.addEventListener("click", removeAllProduct); // Add event listener to "Remove All" button.

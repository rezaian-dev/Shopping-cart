// Store products
let storeProducts = [
  {id: 1, name: "Album 1", img: "assets/Images/products/Album-1.webp", price: 5000000},
  {id: 2, name: "Album 2", img: "assets/Images/products/Album-2.webp", price: 1000000},
  {id: 3, name: "Album 3", img: "assets/Images/products/Album-3.webp", price: 2550000},
  {id: 4, name: "Album 4", img: "assets/Images/products/Album-4.webp", price: 3000000},
  {id: 5, name: "Coffee", img: "assets/Images/products/Coffee.webp", price: 55000000},
  {id: 6, name: "Shirt", img: "assets/Images/products/Shirt.webp", price: 6500000}
];

// User's shopping cart items and total price
let userCartItems = JSON.parse(localStorage.getItem("Products")) || [];
let cartTotalPrice = JSON.parse(localStorage.getItem("TotalPrice")) || 0;

// DOM element references
const productsContainer = document.querySelector(".store__products-container");
const removeAllBtn = document.querySelector(".cart__remove-all");
const cartItemsContainer = document.querySelector(".cart__items");
let totalPrice = document.querySelector(".cart__total-price");

// Common Swal configuration
const SwalConfig = {
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#0d6efd",
  icon: "warning",
  confirmButtonText: "Yes",
  cancelButtonText: "Cancel"
};

// Function to display store products
const showStoreProducts = () => {
  storeProducts.forEach(({name, img, price}) => {
    
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
  calculateTotalPrice();
  createCartList();
}

// Function to save data to LocalStorage
const saveDataLocalStorage = () => {
  localStorage.setItem("Products", JSON.stringify(userCartItems));
  localStorage.setItem("TotalPrice", JSON.stringify(cartTotalPrice));
}

// Function to format name to a valid HTML ID
const formattedId = (name) => {
  return name.replace(" ", "-");
}

// Function to add a product to the cart
const addToCart = (name, img, price) => {
  // Check if product already exists in the cart
  if (userCartItems.some((product) => product.name === name)) {
    updateUserCart(name, null); // Update count if already in cart
  } else {
    const newProduct = { id: userCartItems.length, name, img, price: +price, count: 1 };
    userCartItems.push(newProduct); // Add new product to cart
    createCartList();
  }
  saveDataLocalStorage();
  calculateTotalPrice();
}

// Function to calculate the total price of the cart
const calculateTotalPrice = () => {
  cartTotalPrice = userCartItems.reduce((sum, product) => {
    return sum + product.price * product.count;
  }, 0);
  totalPrice.innerHTML = `$${cartTotalPrice.toLocaleString()}`;
}

// Function to remove a product from the cart
const removeProduct = (name) => {
  Swal.fire({
    ...SwalConfig,
    title: "Remove Product?",
    text: `Are you sure you want to remove "${name}" from your cart? This product will no longer be in your shopping list.`
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove product from cart
      userCartItems = userCartItems.filter((product) => product.name !== name);
      createCartList();
      calculateTotalPrice();
      saveDataLocalStorage();

      // Show success message
      Swal.fire({
        title: "Product Removed",
        text: `"${name}" has been successfully removed from your shopping cart.`,
        icon: "success",
        confirmButtonColor: "#0d6efd"
      });
    }
  });
}

// Function to remove all products from the cart
const removeAllProduct = () => {
  Swal.fire({
    ...SwalConfig,
    title: "Clear Entire Cart?",
    text: "Are you sure you want to clear your shopping cart? This action will remove all products and cannot be undone.",
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear cart
      cartItemsContainer.innerHTML = "";
      userCartItems = [];
      createCartList();
      calculateTotalPrice();
      saveDataLocalStorage();
      cartTotalPrice = 0;

      // Show success message
      Swal.fire({
        title: "Cart Cleared",
        text: "Your shopping cart has been successfully cleared.",
        icon: "success",
        confirmButtonColor: "#0d6efd"
      });
    }
  });
}

// Function to create the cart list in the DOM
const createCartList = () => {
  // Enable/Disable remove all button
  userCartItems.length ? removeAllBtn.disabled = false : removeAllBtn.disabled = true;
  cartItemsContainer.innerHTML = "";

  // If there are items in the cart, render them
  userCartItems.length ?
    userCartItems.forEach(({name, img, price, count}) => {
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
                <input type="number" class="form-control cart-item-quantity mx-md-auto" style="max-width: 100px;" value="${count}" min="1" id="${formattedId(name)}" onChange="updateUserCart('${name}', event.target.value)">
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
    }) : 
    // If the cart is empty, display an empty cart message
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

// Function to update the product count in the cart
const updateUserCart = (name, count) => {
  let quantityInputElement = document.getElementById(formattedId(name));
  let cartItem = userCartItems.find((item) => item.name === name);

  cartItem.count = count || ++cartItem.count; // Increment or set the count
  quantityInputElement.value = cartItem.count; // Update the input value

  calculateTotalPrice();
  saveDataLocalStorage();
}

// Event listeners for page load and remove all button
window.addEventListener("load", showStoreProducts);
removeAllBtn.addEventListener("click", removeAllProduct);

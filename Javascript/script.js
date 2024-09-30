document.addEventListener('DOMContentLoaded', () => {
    // Select all "Add to Cart" buttons and the cart count element
    const addToCartButtons = document.querySelectorAll('.product-button');
    const cartCountElement = document.getElementById('cart-count');

    // Add click event listeners to each "Add to Cart" button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Find the closest product card and extract product details
            const productCard = event.target.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').innerText;
            const productPrice = productCard.querySelector('.product-price').innerText;
            const productImage = productCard.querySelector('.product-image').src;

            // Create a product object with the extracted details
            const product = {
                title: productTitle,
                price: productPrice,
                image: productImage
            };

            // Add the product to the cart and update the cart count
            addToCart(product);
            updateCartCount();
        });
    });

    // Function to add a product to the cart
    function addToCart(product) {
        // Retrieve the cart from localStorage or initialize an empty array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Add the new product to the cart
        cart.push(product);
        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        // Alert the user that the product has been added to the cart
        alert('Product added to cart!');
    }

    // Function to update the cart count displayed on the page
    function updateCartCount() {
        // Retrieve the cart from localStorage or initialize an empty array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Update the cart count element with the number of items in the cart
        cartCountElement.innerText = cart.length;
    }

    // Initialize cart count and display cart items on page load
    updateCartCount();
    displayCartItems();
});

// Function to display cart items on the page
function displayCartItems() {
    // Select the cart items container and bill body elements
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const billBody = document.getElementById('bill-body');
    let total = 0;

    // Clear the current contents of the cart items container and bill body
    cartItemsContainer.innerHTML = '';
    billBody.innerHTML = '';

    // Iterate over each product in the cart
    cart.forEach((product, index) => {
        // Create a new cart item element and populate it with product details
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${product.title}</h3>
                <p class="cart-item-price">${product.price}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${product.quantity || 1}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
        `;

        // Append the cart item element to the cart items container
        cartItemsContainer.appendChild(cartItem);

        // Calculate the total price for the current product
        const price = parseFloat(product.price.replace('Rs.', ''));
        const quantity = product.quantity || 1;
        const itemTotal = price * quantity;
        total += itemTotal;

        // Create a new row for the bill summary and populate it with product details
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.title}</td>
            <td>${quantity}</td>
            <td>Rs. ${price}</td>
            <td>Rs. ${itemTotal}</td>
        `;
        // Append the row to the bill body
        billBody.appendChild(row);
    });

    // Update the total cost element with the calculated total
    document.getElementById('total-cost').textContent = `Rs. ${total}`;

    // Add event listeners for the quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', updateQuantity);
    });
}

// Function to update the quantity of a product in the cart
function updateQuantity(event) {
    // Get the index of the product to update from the button's data attribute
    const index = event.target.dataset.index;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const isIncrement = event.target.classList.contains('plus');

    // Increment or decrement the product quantity based on the button clicked
    if (isIncrement) {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
    } else {
        cart[index].quantity = Math.max((cart[index].quantity || 1) - 1, 1);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Refresh the cart items display and update the cart count
    displayCartItems();
    updateCartCount();
}

// Add an event listener to the "Clear Cart" button to clear the cart
document.getElementById('clear-cart-button').addEventListener('click', clearCart);

// Function to clear the cart
function clearCart() {
    // Remove the cart from localStorage
    localStorage.removeItem('cart');
    // Refresh the cart items display and update the cart count
    displayCartItems();
    updateCartCount();
}

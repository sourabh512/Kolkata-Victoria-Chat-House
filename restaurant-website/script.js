let cart = [];


// =========================
// ADD TO CART
// =========================

function addToCart(name, price) {

    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
}


// =========================
// UPDATE CART
// =========================

function updateCart() {

    let cartItems = document.getElementById("cart-items");
    let cartCount = document.getElementById("cart-count");
    let cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    cart.forEach(function(item, index) {

        let itemTotal = item.price * item.quantity;

        total = total + itemTotal;
        totalItems = totalItems + item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <div class="cart-controls">

                    <button onclick="decreaseQuantity(${index})">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQuantity(${index})">
                        +
                    </button>

                    <button class="remove-btn"
                            onclick="removeItem(${index})">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    cartCount.innerText = totalItems;
    cartTotal.innerText = total;
}


// =========================
// INCREASE
// =========================

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();
}


// =========================
// DECREASE
// =========================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    updateCart();
}


// =========================
// REMOVE
// =========================

function removeItem(index) {

    cart.splice(index, 1);

    updateCart();
}


// =========================
// OPEN / CLOSE CART
// =========================

function toggleCart() {

    let cartBox = document.getElementById("cart-box");

    cartBox.classList.toggle("show-cart");
}


// =========================
// PLACE ORDER
// =========================

function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    let summary = document.getElementById("order-summary");
    let formTotal = document.getElementById("form-total");

    summary.innerHTML = "";

    let orderTotal = 0;

    cart.forEach(function(item) {

        let itemTotal = item.price * item.quantity;

        orderTotal = orderTotal + itemTotal;

        summary.innerHTML += `
            <div class="summary-item">

                <span>
                    ${item.name} × ${item.quantity}
                </span>

                <span>
                    ₹${itemTotal}
                </span>

            </div>
        `;
    });

    // PUT TOTAL IN FORM
    formTotal.innerText = orderTotal;

    // CLOSE CART
    document.getElementById("cart-box")
        .classList.remove("show-cart");

    // OPEN ORDER FORM
    document.getElementById("order-form")
        .classList.add("show-form");
}


// =========================
// CLOSE ORDER FORM
// =========================

function closeOrderForm() {

    document.getElementById("order-form")
        .classList.remove("show-form");
}


// =========================
// CONFIRM ORDER
// =========================


function confirmOrder(event) {

    event.preventDefault();

    let name = document.getElementById("customer-name").value;
    let phone = document.getElementById("customer-phone").value;
    let address = document.getElementById("customer-address").value;

    // Calculate total amount
    let total = 0;

    cart.forEach(function(item) {
        total = total + (item.price * item.quantity);
    });

    // Convert cart items into text
    let items = "";

    cart.forEach(function(item) {
        items = items + item.name + " x " + item.quantity + ", ";
    });

    // Send order to Spring Boot
   fetch("https://kolkata-victoria-chat-house-production.up.railway.app/api/orders",  {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            name: name,
            phone: phone,
            address: address,
            items: items,
            total: total

        })
    })

    .then(function(response) {

        if (!response.ok) {
            throw new Error("Order failed");
        }

        return response.json();
    })

    .then(function(data) {

        console.log("Order saved in database:", data);

   showOrderSuccessPopup(
    data.id,
    data.total,
    name
);

        // EMPTY CART
        cart = [];

        updateCart();

        // CLOSE FORM
        closeOrderForm();

        // RESET FORM
        document.querySelector("#order-form form").reset();
    })

    .catch(function(error) {

        console.error("Error:", error);

        alert(
            "Sorry! Order could not be placed."
        );
    });
}




// =========================
// ORDER NOW
// =========================

function orderNow() {

    toggleCart();
}


// =========================
// LEARN MORE
// =========================

function showMessage() {

    alert("Welcome to Kolkata Victoria Chat House!");
}

// =====================================
// LOAD MENU FROM DATABASE
// =====================================

function loadCustomerMenu() {

    let menuContainer =
        document.getElementById("dynamic-menu");

    if (!menuContainer) {
        return;
    }

   fetch("https://kolkata-victoria-chat-house-production.up.railway.app/api/menu")
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Could not load menu");
            }

            return response.json();
        })

        .then(function(menuItems) {

            menuContainer.innerHTML = "";

            // Show only available items
            let availableItems =
                menuItems.filter(function(item) {
                    return item.available === true;
                });

            if (availableItems.length === 0) {

                menuContainer.innerHTML =
                    '<p class="no-menu">No menu items available right now.</p>';

                return;
            }

            availableItems.forEach(function(item) {

                // Create card
                let card =
                    document.createElement("div");

                card.className =
                    "dynamic-menu-card";


                // Create image
                if (item.image) {

                    let image =
                        document.createElement("img");

                    image.className =
                        "dynamic-menu-image";

                    image.src = item.image;

                    image.alt = item.name;

                    // Hide broken image
                    image.onerror = function() {
                        this.style.display = "none";
                    };

                    card.appendChild(image);
                }


                // Create content
                let content =
                    document.createElement("div");

                content.className =
                    "dynamic-menu-content";


                // Item name
                let name =
                    document.createElement("h3");

                name.textContent =
                    item.name;


                // Item price
                let price =
                    document.createElement("div");

                price.className =
                    "dynamic-menu-price";

                price.textContent =
                    "₹" + item.price;


                // Add to cart button
                let button =
                    document.createElement("button");

                button.className =
                    "dynamic-menu-button";

                button.textContent =
                    "Add to Cart";


                // Connect button to existing cart
                button.addEventListener(
                    "click",
                    function() {

                        addToCart(
                            item.name,
                            Number(item.price)
                        );

                    }
                );


                // Add everything
                content.appendChild(name);

                content.appendChild(price);

                content.appendChild(button);

                card.appendChild(content);

                menuContainer.appendChild(card);

            });

        })

        .catch(function(error) {

            console.error(
                "Menu loading error:",
                error
            );

            menuContainer.innerHTML =
                '<p class="menu-error">' +
                'Unable to load menu. Please try again.' +
                '</p>';

        });
}


// Load menu after page is ready
document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCustomerMenu();

    }
);

// =====================================
// ORDER SUCCESS POPUP
// =====================================

function showOrderSuccessPopup(
    orderId,
    total,
    customerName
) {

    document.getElementById(
        "success-order-id"
    ).textContent = "#" + orderId;

    document.getElementById(
        "success-order-total"
    ).textContent = "₹" + total;

    document.getElementById(
        "success-customer-name"
    ).textContent = customerName;

    document.getElementById(
        "order-success-popup"
    ).classList.add("show");
}


function closeSuccessPopup() {

    document.getElementById(
        "order-success-popup"
    ).classList.remove("show");
}

// =====================================
// CUSTOMER ORDER TRACKING
// =====================================
function trackOrder() {

    let orderId = document.getElementById(
        "tracking-order-id"
    ).value.trim();

    let result = document.getElementById(
        "tracking-result"
    );

    if (orderId === "") {

        result.innerHTML =
            '<p class="tracking-error">' +
            'Please enter your Order ID.' +
            '</p>';

        return;
    }

    result.innerHTML =
        "<p>Checking order...</p>";

    let url =
    "https://kolkata-victoria-chat-house-production.up.railway.app/api/orders/" +
    encodeURIComponent(orderId);
    console.log("Tracking URL:", url);

    fetch(url, {
        method: "GET"
    })
    .then(function(response) {

        console.log(
            "Tracking response status:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );
        }

        return response.json();
    })
    .then(function(order) {

        console.log(
            "Order received:",
            order
        );

        displayOrderStatus(order);

    })
    .catch(function(error) {

        console.error(
            "Order tracking error:",
            error
        );

        result.innerHTML =
            '<p class="tracking-error">' +
            'Unable to find this order. ' +
            'Please check your Order ID.' +
            '</p>';
    });
}

// Display order status

function displayOrderStatus(order) {

    let result =
        document.getElementById(
            "tracking-result"
        );

    let status =
        order.status;

    let newActive =
        status === "NEW" ||
        status === "PREPARING" ||
        status === "READY" ||
        status === "COMPLETED";

    let preparingActive =
        status === "PREPARING" ||
        status === "READY" ||
        status === "COMPLETED";

    let readyActive =
        status === "READY" ||
        status === "COMPLETED";

    let completedActive =
        status === "COMPLETED";


    result.innerHTML =

        '<div class="tracking-order-card">' +

            '<h3>' +
            'Order #' + order.id +
            '</h3>' +

            '<p>' +
            '<strong>Name:</strong> ' +
            escapeHtml(order.name) +
            '</p>' +

            '<p>' +
            '<strong>Total:</strong> ₹' +
            order.total +
            '</p>' +

            '<p>' +
            '<strong>Current Status:</strong> ' +
            status +
            '</p>' +

            '<div class="order-status">' +

                createStatusStep(
                    "Order Received",
                    newActive
                ) +

                createStatusStep(
                    "Preparing",
                    preparingActive
                ) +

                createStatusStep(
                    "Ready",
                    readyActive
                ) +

                createStatusStep(
                    "Completed",
                    completedActive
                ) +

            '</div>' +

        '</div>';
}


// Create status step

function createStatusStep(
    text,
    active
) {

    let activeClass =
        active ? "active" : "";

    let symbol =
        active ? "✓" : "";

    return (

        '<div class="status-step ' +
        activeClass +
        '">' +

            '<div class="status-circle">' +
            symbol +
            '</div>' +

            '<span>' +
            text +
            '</span>' +

        '</div>'

    );
}

// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(text) {

    if (text === null || text === undefined) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
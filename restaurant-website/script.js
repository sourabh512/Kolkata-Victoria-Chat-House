
// =====================================
// BACKEND API URL
// =====================================

const API_BASE_URL =
    "https://resplendent-solace-production-a0b3.up.railway.app";


let cart = [];


// =========================
// ADD TO CART
// =========================

function addToCart(name, price) {

    let existingItem =
        cart.find(item => item.name === name);

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

    let cartItems =
        document.getElementById("cart-items");

    let cartCount =
        document.getElementById("cart-count");

    let cartTotal =
        document.getElementById("cart-total");

    if (!cartItems || !cartCount || !cartTotal) {
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;


    cart.forEach(function(item, index) {

        let itemTotal =
            item.price * item.quantity;

        total =
            total + itemTotal;

        totalItems =
            totalItems + item.quantity;


        cartItems.innerHTML += `
            <div class="cart-item">

                <div>
                    <h4>${escapeHtml(item.name)}</h4>
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

                    <button
                        class="remove-btn"
                        onclick="removeItem(${index})">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });


    cartCount.innerText =
        totalItems;

    cartTotal.innerText =
        total;
}


// =========================
// INCREASE
// =========================

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity++;

    updateCart();
}


// =========================
// DECREASE
// =========================

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

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

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    updateCart();
}


// =========================
// OPEN / CLOSE CART
// =========================

function toggleCart() {

    let cartBox =
        document.getElementById("cart-box");

    if (!cartBox) {
        return;
    }

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


    let summary =
        document.getElementById("order-summary");

    let formTotal =
        document.getElementById("form-total");


    if (!summary || !formTotal) {

        alert(
            "Order form could not be opened."
        );

        return;
    }


    summary.innerHTML = "";

    let orderTotal = 0;


    cart.forEach(function(item) {

        let itemTotal =
            item.price * item.quantity;

        orderTotal =
            orderTotal + itemTotal;


        summary.innerHTML += `
            <div class="summary-item">

                <span>
                    ${escapeHtml(item.name)} × ${item.quantity}
                </span>

                <span>
                    ₹${itemTotal}
                </span>

            </div>
        `;

    });


    // PUT TOTAL IN FORM

    formTotal.innerText =
        orderTotal;


    // CLOSE CART

    let cartBox =
        document.getElementById("cart-box");

    if (cartBox) {

        cartBox.classList.remove(
            "show-cart"
        );

    }


    // OPEN ORDER FORM

    let orderForm =
        document.getElementById("order-form");

    if (orderForm) {

        orderForm.classList.add(
            "show-form"
        );

    }

}


// =========================
// CLOSE ORDER FORM
// =========================

function closeOrderForm() {

    let orderForm =
        document.getElementById("order-form");

    if (!orderForm) {
        return;
    }

    orderForm.classList.remove(
        "show-form"
    );
}


// =========================
// CONFIRM ORDER
// =========================

function confirmOrder(event) {

    event.preventDefault();


    let name =
        document.getElementById(
            "customer-name"
        ).value.trim();


    let phone =
        document.getElementById(
            "customer-phone"
        ).value.trim();


    let address =
        document.getElementById(
            "customer-address"
        ).value.trim();


    if (!name || !phone || !address) {

        alert(
            "Please fill in all customer details."
        );

        return;
    }


    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;
    }


    // Calculate total amount

    let total = 0;


    cart.forEach(function(item) {

        total =
            total +
            (item.price * item.quantity);

    });


    // Convert cart items into text

    let items = "";


    cart.forEach(function(item) {

        items =
            items +
            item.name +
            " x " +
            item.quantity +
            ", ";

    });


    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    fetch(
        API_BASE_URL +
        "/api/payment/create-order?amount=" +
        encodeURIComponent(total),
        {
            method: "POST"
        }
    )

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Could not create payment order"
            );

        }

        return response.json();

    })

    .then(function(paymentOrder) {

        console.log(
            "Razorpay order created:",
            paymentOrder
        );


        // ==========================================
        // RAZORPAY CHECKOUT
        // ==========================================

        let options = {

            /*
             * IMPORTANT:
             * This is your Razorpay TEST KEY ID.
             *
             * NEVER put the Razorpay Secret Key here.
             */

            key:
                "rzp_test_TgzCHppixI72ho",


            amount:
                paymentOrder.amount,


            currency:
                paymentOrder.currency,


            name:
                "Kolkata Victoria Chat House",


            description:
                "Restaurant Order",


            order_id:
                paymentOrder.orderId,


            // ==========================================
            // CUSTOMER DETAILS
            // ==========================================

            prefill: {

                name:
                    name,

                contact:
                    phone

            },


            // ==========================================
            // PAYMENT SUCCESS
            // ==========================================

            handler: function(response) {

                console.log(
                    "Payment successful:",
                    response
                );


                // ==========================================
                // VERIFY PAYMENT WITH BACKEND
                // ==========================================

                fetch(
                    API_BASE_URL +
                    "/api/payment/verify",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                razorpayOrderId:
                                    response.razorpay_order_id,

                                razorpayPaymentId:
                                    response.razorpay_payment_id,

                                razorpaySignature:
                                    response.razorpay_signature

                            })

                    }
                )

                .then(function(response) {

                    if (!response.ok) {

                        throw new Error(
                            "Payment verification failed"
                        );

                    }

                    return response.json();

                })

                .then(function(verificationData) {

                    console.log(
                        "Payment verification:",
                        verificationData
                    );


                    if (
                        verificationData.status !==
                        "success"
                    ) {

                        throw new Error(
                            "Payment verification failed"
                        );

                    }


                    // ==========================================
                    // SAVE RESTAURANT ORDER
                    // ==========================================

                    fetch(
                        API_BASE_URL +
                        "/api/orders",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    name:
                                        name,

                                    phone:
                                        phone,

                                    address:
                                        address,

                                    items:
                                        items,

                                    total:
                                        total

                                })

                        }
                    )

                    .then(function(response) {

                        if (!response.ok) {

                            throw new Error(
                                "Order could not be saved"
                            );

                        }

                        return response.json();

                    })

                    .then(function(data) {

                        console.log(
                            "Order saved in database:",
                            data
                        );


                        showOrderSuccessPopup(
                            data.id,
                            data.total,
                            name
                        );


                        // Empty cart

                        cart = [];


                        updateCart();


                        closeOrderForm();


                        let form =
                            document.querySelector(
                                "#order-form form"
                            );


                        if (form) {

                            form.reset();

                        }

                    })

                    .catch(function(error) {

                        console.error(
                            "Order saving error:",
                            error
                        );


                        alert(
                            "Payment was successful, but the order could not be saved. Please contact the restaurant."
                        );

                    });

                })

                .catch(function(error) {

                    console.error(
                        "Payment verification error:",
                        error
                    );


                    alert(
                        "Payment could not be verified. Please contact the restaurant."
                    );

                });

            },


            // ==========================================
            // PAYMENT WINDOW CLOSED
            // ==========================================

            modal: {

                ondismiss: function() {

                    console.log(
                        "Payment window closed"
                    );

                }

            }

        };


        // ==========================================
        // OPEN RAZORPAY
        // ==========================================

        try {

            let razorpay =
                new Razorpay(options);


            razorpay.on(
                "payment.failed",
                function(response) {

                    console.error(
                        "Razorpay payment failed:",
                        response
                    );


                    alert(
                        "Payment failed. Please try again."
                    );

                }
            );


            razorpay.open();

        }

        catch (error) {

            console.error(
                "Razorpay checkout error:",
                error
            );


            alert(
                "Razorpay could not be opened. Please refresh the page and try again."
            );

        }

    })

    .catch(function(error) {

        console.error(
            "Payment error:",
            error
        );


        alert(
            "Sorry! Payment could not be started."
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

    alert(
        "Welcome to Kolkata Victoria Chat House!"
    );

}


// =====================================
// LOAD MENU FROM DATABASE
// =====================================

function loadCustomerMenu() {

    let menuContainer =
        document.getElementById(
            "dynamic-menu"
        );


    if (!menuContainer) {

        return;

    }


    fetch(
        API_BASE_URL +
        "/api/menu"
    )

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Could not load menu"
            );

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


        if (
            availableItems.length === 0
        ) {

            menuContainer.innerHTML =
                '<p class="no-menu">' +
                'No menu items available right now.' +
                '</p>';

            return;

        }


        availableItems.forEach(function(item) {

            // Create card

            let card =
                document.createElement(
                    "div"
                );


            card.className =
                "dynamic-menu-card";


            // Create image

            if (item.image) {

                let image =
                    document.createElement(
                        "img"
                    );


                image.className =
                    "dynamic-menu-image";


                image.src =
                    item.image;


                image.alt =
                    item.name;


                // Hide broken image

                image.onerror =
                    function() {

                        this.style.display =
                            "none";

                    };


                card.appendChild(
                    image
                );

            }


            // Create content

            let content =
                document.createElement(
                    "div"
                );


            content.className =
                "dynamic-menu-content";


            // Item name

            let name =
                document.createElement(
                    "h3"
                );


            name.textContent =
                item.name;


            // Item price

            let price =
                document.createElement(
                    "div"
                );


            price.className =
                "dynamic-menu-price";


            price.textContent =
                "₹" + item.price;


            // Add to cart button

            let button =
                document.createElement(
                    "button"
                );


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

            content.appendChild(
                name
            );


            content.appendChild(
                price
            );


            content.appendChild(
                button
            );


            card.appendChild(
                content
            );


            menuContainer.appendChild(
                card
            );

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


// =====================================
// SEARCH MENU
// =====================================

function searchMenu() {

    const searchInput =
        document.getElementById(
            "menuSearch"
        );


    if (!searchInput) {

        return;

    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const menuItems =
        document.querySelectorAll(
            "#dynamic-menu .dynamic-menu-card"
        );


    menuItems.forEach(function(item) {

        const heading =
            item.querySelector("h3");


        if (!heading) {

            return;

        }


        const itemName =
            heading.textContent
                .toLowerCase();


        if (
            itemName.includes(
                searchText
            )
        ) {

            item.style.display =
                "";

        } else {

            item.style.display =
                "none";

        }

    });

}


// =====================================
// ORDER SUCCESS POPUP
// =====================================

function showOrderSuccessPopup(
    orderId,
    total,
    customerName
) {

    let orderIdElement =
        document.getElementById(
            "success-order-id"
        );


    let totalElement =
        document.getElementById(
            "success-order-total"
        );


    let nameElement =
        document.getElementById(
            "success-customer-name"
        );


    let popup =
        document.getElementById(
            "order-success-popup"
        );


    if (
        !orderIdElement ||
        !totalElement ||
        !nameElement ||
        !popup
    ) {

        return;

    }


    orderIdElement.textContent =
        "#" + orderId;


    totalElement.textContent =
        "₹" + total;


    nameElement.textContent =
        customerName;


    popup.classList.add(
        "show"
    );

}


function closeSuccessPopup() {

    let popup =
        document.getElementById(
            "order-success-popup"
        );


    if (!popup) {

        return;

    }


    popup.classList.remove(
        "show"
    );

}


// =====================================
// CUSTOMER ORDER TRACKING
// =====================================

function trackOrder() {

    let trackingInput =
        document.getElementById(
            "tracking-order-id"
        );


    let result =
        document.getElementById(
            "tracking-result"
        );


    if (!trackingInput || !result) {

        return;

    }


    let orderId =
        trackingInput.value.trim();


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
        API_BASE_URL +
        "/api/orders/" +
        encodeURIComponent(
            orderId
        );


    console.log(
        "Tracking URL:",
        url
    );


    fetch(
        url,
        {
            method: "GET"
        }
    )

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


        displayOrderStatus(
            order
        );

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


// =====================================
// DISPLAY ORDER STATUS
// =====================================

function displayOrderStatus(order) {

    let result =
        document.getElementById(
            "tracking-result"
        );


    if (!result) {

        return;

    }


    let status =
        String(
            order.status || "NEW"
        ).toUpperCase();


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
            'Order #' +
            escapeHtml(order.id) +
            '</h3>' +

            '<p>' +
            '<strong>Name:</strong> ' +
            escapeHtml(order.name) +
            '</p>' +

            '<p>' +
            '<strong>Total:</strong> ₹' +
            escapeHtml(order.total) +
            '</p>' +

            '<p>' +
            '<strong>Current Status:</strong> ' +
            escapeHtml(status) +
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


// =====================================
// CREATE STATUS STEP
// =====================================

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
            escapeHtml(text) +
            '</span>' +

        '</div>'

    );

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================
// LOAD MENU AFTER PAGE IS READY
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCustomerMenu();

        updateCart();

    }
);


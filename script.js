// ==========================================
// 1. Menu Data
// ==========================================
const menuData = [
    {
        id: "m1",
        name: "Basmati Fried Rice & Chicken",
        description: "Fragrant basmati rice cooked with fresh veggies and served with savory fried chicken.",
        price: 7500,
        image: "basmati-rice.jpeg"
    },
    {
        id: "m2",
        name: "Puff Puff (10 pcs)",
        description: "Golden, fluffy, and sweet fried dough balls made fresh to order.",
        price: 1500,
        image: "puff-puff.jpeg"
    },
    {
        id: "m3",
        name: "Tigernut Drink",
        description: "Chilled, rich, and creamy natural tigernut blend made with 100% organic ingredients.",
        price: 3000,
        image: "tigernut-drink.jpeg"
    },
    {
        id: "m4",
        name: "Fruity Zobo",
        description: "Refreshing hibiscus tea infused with natural fresh fruits and aromatic spices.",
        price: 1800,
        image: "fruity-zobo.jpeg"
    }
];

// WhatsApp Target Phone Number
const WHATSAPP_PHONE_NUMBER = "2347069213252";

// Paystack Test Public Key
const PAYSTACK_PUBLIC_KEY = "pk_test_0c4f4f97d42eda37e404d2b86bc803fca5e54fd2";

// State
let cart = {};

// ==========================================
// 2. DOM Elements
// ==========================================
const menuGrid = document.getElementById("menuGrid");
const cartBadge = document.getElementById("cartBadge");
const mobileCartBar = document.getElementById("mobileCartBar");
const mobileCartCount = document.getElementById("mobileCartCount");
const mobileCartTotal = document.getElementById("mobileCartTotal");
const cartBadgeMobile = document.getElementById("cartBadgeMobile");

const cartDrawer = document.getElementById("cartDrawer");
const modalOverlay = document.getElementById("modalOverlay");
const cartTriggerBtn = document.getElementById("cartTriggerBtn");
const mobileCheckoutBtn = document.getElementById("mobileCheckoutBtn");
const closeCartBtn = document.getElementById("closeCartBtn");

const cartItemsContainer = document.getElementById("cartItems");
const drawerTotal = document.getElementById("drawerTotal");

const custNameInput = document.getElementById("custName");
const custAddressInput = document.getElementById("custAddress");
const custNotesInput = document.getElementById("custNotes");
const orderTicket = document.getElementById("orderTicket");

const copyOrderBtn = document.getElementById("copyOrderBtn");
const whatsappBtn = document.getElementById("whatsappBtn");

// ==========================================
// 3. Initialization & Rendering
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    setupEventListeners();
    updateCartUI();
});

function renderMenu() {
    menuGrid.innerHTML = menuData.map(item => `
        <div class="food-card">
            <div class="food-img-wrapper" onclick="openLightbox('${item.image}')">
                <img src="${item.image}" alt="${item.name}" class="food-img" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}'">
            </div>
            <div class="food-details">
                <h4 class="food-title">${item.name}</h4>
                <p class="food-desc">${item.description}</p>
                <div class="food-bottom">
                    <span class="food-price">₦${item.price.toLocaleString()}</span>
                    <button class="btn btn-primary btn-sm add-cart-btn" onclick="addToCart('${item.id}', this)">+ Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Lightbox helper functions
function openLightbox(imgSrc) {
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    lightboxImg.src = imgSrc;
    lightbox.classList.add("active");
}

function closeLightbox() {
    document.getElementById("imageLightbox").classList.remove("active");
}

// ==========================================
// 4. Cart Operations
// ==========================================
function addToCart(id, buttonEl) {
    if (cart[id]) {
        cart[id]++;
    } else {
        cart[id] = 1;
    }
    updateCartUI();

    // Visual button feedback logic
    if (buttonEl) {
        buttonEl.textContent = "✓ Added!";
        buttonEl.classList.add("added-success");
        
        setTimeout(() => {
            buttonEl.textContent = "+ Add to Cart";
            buttonEl.classList.remove("added-success");
        }, 1000);
    }
}

function changeQty(id, delta) {
    if (cart[id]) {
        cart[id] += delta;
        if (cart[id] <= 0) {
            delete cart[id];
        }
    }
    updateCartUI();
}

function calculateTotal() {
    let count = 0;
    let total = 0;

    Object.keys(cart).forEach(id => {
        const item = menuData.find(m => m.id === id);
        if (item) {
            count += cart[id];
            total += item.price * cart[id];
        }
    });

    return { count, total };
}

// ==========================================
// 5. Dynamic UI Updates & Ticket Formatting
// ==========================================
function updateCartUI() {
    const { count, total } = calculateTotal();

    // Update Badges & Totals
    cartBadge.textContent = count;
if (cartBadgeMobile) cartBadgeMobile.textContent = count;
    mobileCartCount.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
    mobileCartTotal.textContent = `₦${total.toLocaleString()}`;
    drawerTotal.textContent = `₦${total.toLocaleString()}`;

    // Render Cart Items List Inside Drawer
    const keys = Object.keys(cart);
    if (keys.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-msg">Your cart is empty. Add something tasty!</p>`;
    } else {
        cartItemsContainer.innerHTML = keys.map(id => {
            const item = menuData.find(m => m.id === id);
            const qty = cart[id];
            const itemSubtotal = item.price * qty;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <p>₦${itemSubtotal.toLocaleString()}</p>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty('${id}', -1)">-</button>
                        <span>${qty}</span>
                        <button class="qty-btn" onclick="changeQty('${id}', 1)">+</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    generateOrderTicketText();
}

function generateOrderTicketText() {
    const { count, total } = calculateTotal();
    const name = custNameInput.value.trim() || "[Not Provided]";
    const address = custAddressInput.value.trim() || "[Not Provided]";
    const notes = custNotesInput.value.trim() || "[Not Provided]";

    let ticket = `==============================\n`;
    ticket += `        LICKY TREATS ORDER       \n`;
    ticket += `==============================\n`;
    ticket += `Hi, I would like to process my order.\n\n`;
    ticket += `CUSTOMER DETAILS:\n`;
    ticket += `• Name: ${name}\n`;
    ticket += `• Address: ${address}\n`;
    ticket += `• Phone/Notes: ${notes}\n\n`;
    ticket += `ORDER ITEMS:\n`;

    const keys = Object.keys(cart);
    if (keys.length === 0) {
        ticket += `(No items in cart)\n`;
    } else {
        keys.forEach((id, idx) => {
            const item = menuData.find(m => m.id === id);
            const qty = cart[id];
            const itemTotal = item.price * qty;
            ticket += `${idx + 1}. ${item.name} x${qty} - ₦${itemTotal.toLocaleString()}\n`;
        });
    }

    ticket += `\n------------------------------\n`;
    ticket += `TOTAL AMOUNT: ₦${total.toLocaleString()}\n`;
    ticket += `==============================\n`;
    ticket += `Please confirm my order and send account details for payment.`;

    orderTicket.value = ticket;
}

// ==========================================
// 6. Modal / Drawer Toggle Logic
// ==========================================
function openCart() {
    cartDrawer.classList.add("active");
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // Push a dummy history state so the mobile back button/gesture closes the cart
    if (window.location.hash !== "#cart") {
        history.pushState({ cartOpen: true }, "", "#cart");
    }
}

function closeCart() {
    cartDrawer.classList.remove("active");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "auto";

    // Clean up the URL hash if it's still present
    if (window.location.hash === "#cart") {
        history.back();
    }
}

// Listen for the user's mobile back gesture/button
window.addEventListener("popstate", function (event) {
    // If the cart is open when back is triggered, close it cleanly
    if (cartDrawer.classList.contains("active")) {
        cartDrawer.classList.remove("active");
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }
});

// ==========================================
// Paystack Payment Logic
// ==========================================
function payWithPaystack() {
    const { count, total } = calculateTotal();

    // 1. Validation Checks
    if (count === 0) {
        alert("Please add at least one item to your cart before proceeding.");
        return;
    }

    if (!custNameInput.value.trim() || !custAddressInput.value.trim() || !custNotesInput.value.trim()) {
        alert("Please fill out all 3 guest checkout details before placing your order.");
        return;
    }

    // 2. Extract Customer Info
    const name = custNameInput.value.trim();
    const phoneAndNotes = custNotesInput.value.trim();
    
    // Create a temporary fallback email for Paystack (Paystack requires an email format)
    const formattedEmail = `customer_${Date.now()}@lickytreats.com`;

    // 3. Initialize Paystack Pop-up
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: formattedEmail,
        amount: total * 100, // Amount in Kobo (₦1,000 = 100000)
        currency: "NGN",
        metadata: {
            custom_fields: [
                { display_name: "Customer Name", variable_name: "customer_name", value: name },
                { display_name: "Phone/Notes", variable_name: "phone_notes", value: phoneAndNotes }
            ]
        },
        callback: function(response) {
            // Payment Successful!
            const refCode = response.reference;

            // Generate ticket with PAID status and Transaction Ref
            generatePaidTicketText(refCode);

            // Open WhatsApp automatically
            const encodedMessage = encodeURIComponent(orderTicket.value);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
            
            window.location.href = whatsappUrl;

        },
        onClose: function() {
            alert("Payment window closed. If you experienced an issue, you can try again or use Pay via WhatsApp.");
        }
    });

    handler.openIframe();
}

// Format Order Ticket specifically for Successful Paystack Orders
function generatePaidTicketText(refCode) {
    const { total } = calculateTotal();
    const name = custNameInput.value.trim() || "[Not Provided]";
    const address = custAddressInput.value.trim() || "[Not Provided]";
    const notes = custNotesInput.value.trim() || "[Not Provided]";

    let ticket = `==============================\n`;
    ticket += `        LICKY TREATS ORDER       \n`;
    ticket += `==============================\n`;
    ticket += `Hi, I have PAID for my order online\n\n`;
    ticket += `PAYMENT STATUS: PAID ✓\n`;
    ticket += `TRANSACTION REF: ${refCode}\n\n`;
    ticket += `CUSTOMER DETAILS:\n`;
    ticket += `• Name: ${name}\n`;
    ticket += `• Address: ${address}\n`;
    ticket += `• Phone/Notes: ${notes}\n\n`;
    ticket += `ORDER ITEMS:\n`;

    const keys = Object.keys(cart);
    keys.forEach((id, idx) => {
        const item = menuData.find(m => m.id === id);
        const qty = cart[id];
        const itemTotal = item.price * qty;
        ticket += `${idx + 1}. ${item.name} x${qty} - ₦${itemTotal.toLocaleString()}\n`;
    });

    ticket += `\n------------------------------\n`;
    ticket += `TOTAL PAID: ₦${total.toLocaleString()}\n`;
    ticket += `==============================\n`;
    ticket += `Please process and deliver my order!`;

    orderTicket.value = ticket;
}

// ==========================================
// 7. Event Listeners & Actions
// ==========================================
function setupEventListeners() {

    // Paystack Online Payment Trigger
    const paystackBtn = document.getElementById("paystackBtn");
    if (paystackBtn) {
        paystackBtn.addEventListener("click", payWithPaystack);
    }

    cartTriggerBtn.addEventListener("click", openCart);
    mobileCheckoutBtn.addEventListener("click", openCart);
    closeCartBtn.addEventListener("click", closeCart);
    modalOverlay.addEventListener("click", closeCart);

    // Dynamic update of order ticket on guest form input
    custNameInput.addEventListener("input", generateOrderTicketText);
    custAddressInput.addEventListener("input", generateOrderTicketText);
    custNotesInput.addEventListener("input", generateOrderTicketText);

    // Copy Ticket to Clipboard with Icon Feedback
    copyOrderBtn.addEventListener("click", () => {
        if (Object.keys(cart).length === 0) {
            alert("Your cart is empty!");
            return;
        }
        
        const copyTooltip = document.getElementById("copyTooltip");
        
        navigator.clipboard.writeText(orderTicket.value).then(() => {
            copyTooltip.textContent = "Copied! ✓";
            copyOrderBtn.classList.add("copied");

            setTimeout(() => {
                copyTooltip.textContent = "Copy";
                copyOrderBtn.classList.remove("copied");
            }, 2000);
        });
    });

    // Deep-link to WhatsApp
    whatsappBtn.addEventListener("click", () => {
        const { count } = calculateTotal();
        if (count === 0) {
            alert("Please add at least one item to your cart before proceeding.");
            return;
        }

        if (!custNameInput.value.trim() || !custAddressInput.value.trim() || !custNotesInput.value.trim()) {
            alert("Please fill out all 3 guest checkout details before placing your order.");
            return;
        }

        const encodedMessage = encodeURIComponent(orderTicket.value);
        const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
    });
}

// Mobile Navigation Toggle Helpers
function toggleMobileNav() {
    const navLinks = document.getElementById('mobileNav');
    navLinks.classList.toggle('active');
}

function closeMobileNav() {
    const navLinks = document.getElementById('mobileNav');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
}
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

// WhatsApp Target Phone Number (Replace with your actual business phone number)
const WHATSAPP_PHONE_NUMBER = "2348108597424";

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
}

function closeCart() {
    cartDrawer.classList.remove("active");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

// ==========================================
// 7. Event Listeners & Actions
// ==========================================
function setupEventListeners() {
    cartTriggerBtn.addEventListener("click", openCart);
    mobileCheckoutBtn.addEventListener("click", openCart);
    closeCartBtn.addEventListener("click", closeCart);
    modalOverlay.addEventListener("click", closeCart);

    // Dynamic update of order ticket on guest form input
    custNameInput.addEventListener("input", generateOrderTicketText);
    custAddressInput.addEventListener("input", generateOrderTicketText);
    custNotesInput.addEventListener("input", generateOrderTicketText);

    // Copy Ticket to Clipboard
    copyOrderBtn.addEventListener("click", () => {
        if (Object.keys(cart).length === 0) {
            alert("Your cart is empty!");
            return;
        }
        
        navigator.clipboard.writeText(orderTicket.value).then(() => {
            const originalText = copyOrderBtn.textContent;
            copyOrderBtn.textContent = "Copied! ✓";
            copyOrderBtn.style.backgroundColor = "#D4EDDA";
            copyOrderBtn.style.color = "#155724";

            setTimeout(() => {
                copyOrderBtn.textContent = originalText;
                copyOrderBtn.style.backgroundColor = "";
                copyOrderBtn.style.color = "";
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
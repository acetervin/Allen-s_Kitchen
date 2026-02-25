// --- 1. Mobile Menu ---
const mobileMenu = document.getElementById('mobile-menu');
const openBtn = document.getElementById('mobile-menu-open');
const closeBtn = document.getElementById('mobile-menu-close');
const links = document.querySelectorAll('.mobile-link');

function toggleMenu(show) {
    if(show) { mobileMenu.classList.remove('menu-hidden'); mobileMenu.classList.add('menu-visible'); } 
    else { mobileMenu.classList.remove('menu-visible'); mobileMenu.classList.add('menu-hidden'); }
}
openBtn.addEventListener('click', () => toggleMenu(true));
closeBtn.addEventListener('click', () => toggleMenu(false));
links.forEach(l => l.addEventListener('click', () => toggleMenu(false)));

// --- 2. Cart Logic ---
let cart = [];
const businessPhone = "254728708806"; 

function addToCart(name, price, qty) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ name: name, price: price, quantity: qty });
    }
    updateCartUI();
    
    const floatBtn = document.getElementById('float-cart-count');
    floatBtn.parentElement.classList.add('pop-anim');
    setTimeout(() => floatBtn.parentElement.classList.remove('pop-anim'), 300);
    closeDetails();
}

function changeQty(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        updateCartUI();
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    ['nav-cart-count', 'mobile-cart-count', 'float-cart-count'].forEach(id => {
        const el = document.getElementById(id);
        el.innerText = totalItems;
        el.classList.toggle('hidden', totalItems === 0);
    });

    const container = document.getElementById('cartItemsContainer');
    document.getElementById('cartTotal').innerText = `Ksh ${totalPrice}`;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center italic mt-10">Your basket is empty.</p>';
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded border">
                <div class="flex-1">
                    <p class="font-bold text-sm">${item.name}</p>
                    <p class="text-xs text-gray-500">Ksh ${item.price} x ${item.quantity}</p>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="changeQty(${index}, -1)" class="w-6 h-6 bg-gray-200 rounded flex items-center justify-center font-bold hover:bg-gray-300">-</button>
                    <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)" class="w-6 h-6 bg-black text-white rounded flex items-center justify-center font-bold hover:bg-gray-800">+</button>
                </div>
            </div>
        `).join('');
    }
}

function openCart() { document.getElementById('cartModal').classList.add('active'); toggleMenu(false); }
function closeCart() { document.getElementById('cartModal').classList.remove('active'); }

function checkout() {
    const name = document.getElementById('customerName').value.trim();
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!name) return alert("Please enter your name.");

    let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let message = `*NEW ORDER*\n*Customer:* ${name}\n\n*Order Details:*\n`;
    cart.forEach(item => { message += `• ${item.quantity} x ${item.name} (Ksh ${item.price * item.quantity})\n`; });
    message += `\n*Total: Ksh ${totalPrice}*`;
    window.open(`https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`, '_blank');
}

// --- 3. Modal Quantity Logic ---
const detailsModal = document.getElementById('productModal');
let currentModalQty = 1;
let currentModalPrice = 0;
let currentModalName = "";

const modalElements = {
    img: document.getElementById('modalImg'),
    title: document.getElementById('modalTitle'),
    price: document.getElementById('modalPrice'),
    desc: document.getElementById('modalDesc'),
    btn: document.getElementById('modalAddBtn'),
    qtyDisplay: document.getElementById('modalQtyDisplay')
};

function openDetails(title, price, image, desc) {
    currentModalQty = 1;
    currentModalPrice = price;
    currentModalName = title;

    modalElements.img.src = image;
    modalElements.title.innerText = title;
    modalElements.price.innerText = "Ksh " + price;
    modalElements.desc.innerText = desc;
    
    updateModalBtn();
    detailsModal.classList.add('active');
}

function adjustModalQty(change) {
    if (currentModalQty + change >= 1) {
        currentModalQty += change;
        updateModalBtn();
    }
}

function updateModalBtn() {
    modalElements.qtyDisplay.innerText = currentModalQty;
    modalElements.btn.innerText = `Add ${currentModalQty} to Order (Ksh ${currentModalQty * currentModalPrice})`;
    modalElements.btn.onclick = function() { addToCart(currentModalName, currentModalPrice, currentModalQty); };
}

function closeDetails() { detailsModal.classList.remove('active'); }

window.onclick = function(event) {
    if (event.target == detailsModal) closeDetails();
    if (event.target == document.getElementById('cartModal')) closeCart();
}

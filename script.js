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

function addToCart(name, price, image, qty) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ name: name, price: price, image: image, quantity: qty });
    }
    updateCartUI();
    
    const floatBtn = document.getElementById('float-cart-count');
    floatBtn.parentElement.classList.add('pop-anim');
    setTimeout(() => floatBtn.parentElement.classList.remove('pop-anim'), 300);
    closeDetails();
    openCart(); // Automatically open cart when item is added
}

function changeQty(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        updateCartUI();
    }
}

function removeItem(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        updateCartUI();
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    ['nav-cart-count', 'mobile-cart-count', 'float-cart-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = totalItems;
            el.classList.toggle('hidden', totalItems === 0);
        }
    });

    const cartItemSummary = document.getElementById('cartItemSummary');
    if (cartItemSummary) cartItemSummary.innerText = `${totalItems} Item${totalItems === 1 ? '' : 's'}`;

    const container = document.getElementById('cartItemsContainer');
    document.getElementById('cartTotal').innerText = `Ksh ${totalPrice}`;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-center">
                <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 text-gray-600">
                    <i class="fas fa-shopping-basket text-2xl"></i>
                </div>
                <p class="text-gray-400 font-medium">Your basket is empty</p>
                <p class="text-gray-600 text-sm mt-1">Add something tasty from our menu!</p>
                <button onclick="closeCart()" class="mt-6 text-white text-xs font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-gray-300 transition">Browse Menu</button>
            </div>
        `;
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="group flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300">
                <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black">
                    <img src="${item.image}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition shadow-inner" alt="${item.name}">
                </div>
                <div class="flex-1 flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-white font-bold text-sm uppercase tracking-wide leading-tight">${item.name}</h4>
                            <p class="text-gray-500 text-[10px] font-bold mt-0.5">Ksh ${item.price} each</p>
                        </div>
                        <button onclick="removeItem(${index})" class="text-gray-600 hover:text-red-500 transition-colors p-1">
                            <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                    </div>
                    
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center bg-black/40 rounded-lg border border-white/10 p-1">
                            <button onclick="changeQty(${index}, -1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition">-</button>
                            <span class="w-8 text-center text-xs font-bold text-white">${item.quantity}</span>
                            <button onclick="changeQty(${index}, 1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition">+</button>
                        </div>
                        <span class="text-white font-bold text-sm">Ksh ${item.price * item.quantity}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function clearCart() {
    if (confirm('Clear all items from your basket?')) {
        cart = [];
        updateCartUI();
    }
}

function openCart() {
    const modal = document.getElementById('cartModal');
    const backdrop = document.getElementById('cartBackdrop');
    const panel = document.getElementById('cartPanel');
    
    modal.classList.remove('pointer-events-none');
    backdrop.classList.remove('opacity-0');
    backdrop.classList.remove('pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
    
    toggleMenu(false);
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    const backdrop = document.getElementById('cartBackdrop');
    const panel = document.getElementById('cartPanel');
    
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
    
    setTimeout(() => {
        modal.classList.add('pointer-events-none');
    }, 300);
}

function checkout() {
    const name = document.getElementById('customerName').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!name) return alert("Please enter your name.");
    if (!address) return alert("Please enter your delivery address.");

    let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let message = `*NEW ORDER FROM WEBSITE*\n\n*Customer Details:*\n *Name:* ${name}\n📍 *Address:* ${address}\n\n*Order Items:*\n`;
    cart.forEach(item => { 
        message += ` ${item.quantity} x ${item.name} (Ksh ${item.price * item.quantity})\n`; 
    });
    message += `\n *Total Amount: Ksh ${totalPrice}*\n\n_Ordered via Fusions Choma joint Website_`;
    
    window.open(`https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`, '_blank');
}

// --- 3. Modal Quantity Logic ---
const detailsModal = document.getElementById('productModal');
let currentModalQty = 1;
let currentModalPrice = 0;
let currentModalName = "";
let currentModalImg = "";

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
    currentModalImg = image;

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
    modalElements.btn.innerText = `Add to Order (Ksh ${currentModalQty * currentModalPrice})`;
    modalElements.btn.onclick = function() { addToCart(currentModalName, currentModalPrice, currentModalImg, currentModalQty); };
}

function closeDetails() { detailsModal.classList.remove('active'); }

// --- 4. Operating Hours Status ---
const operatingHours = {
    0: { name: 'Sunday', open: 9, close: 22 },      // 9 AM - 10 PM
    1: { name: 'Monday', open: 10, close: 22 },     // 10 AM - 10 PM
    2: { name: 'Tuesday', open: 10, close: 22 },    // 10 AM - 10 PM
    3: { name: 'Wednesday', open: 10, close: 22 },  // 10 AM - 10 PM
    4: { name: 'Thursday', open: 10, close: 22 },   // 10 AM - 10 PM
    5: { name: 'Friday', open: 10, close: 22 },     // 10 AM - 10 PM
    6: { name: 'Saturday', open: 9, close: 23 }     // 9 AM - 11 PM
};

function updateOpenStatus() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();
    
    const hours = operatingHours[dayOfWeek];
    const isOpen = currentHour >= hours.open && currentHour < hours.close;
    
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (statusDot && statusText) {
        if (isOpen) {
            statusDot.classList.remove('bg-red-500');
            statusDot.classList.add('bg-green-400');
            statusText.classList.remove('text-red-400');
            statusText.classList.add('text-green-400');
            statusText.innerText = 'Open Now';
        } else {
            statusDot.classList.remove('bg-green-400');
            statusDot.classList.add('bg-red-500');
            statusText.classList.remove('text-green-400');
            statusText.classList.add('text-red-400');
            statusText.innerText = 'Closed';
        }
    }
}

// Update status on page load and every minute
updateOpenStatus();
setInterval(updateOpenStatus, 60000);

// Hanging sign
function updateSign() {
  const now = new Date();
  const hour = now.getHours();
  const sign = document.getElementById("shop-sign");
  if (!sign) return;

  if (hour >= 10 && hour < 22) {
    sign.textContent = "OPEN";
    sign.className = "sign bg-brandBlack text-green-400 border-green-400 font-bold uppercase px-3 py-1.5 text-xs tracking-wide rounded border-2 shadow-2xl origin-top animate-swing";
  } else {
    sign.textContent = "CLOSED";
    sign.className = "sign bg-brandBlack text-red-400 border-red-400 font-bold uppercase px-3 py-1.5 text-xs tracking-wide rounded border-2 shadow-2xl origin-top animate-swing";
  }
}

updateSign();
setInterval(updateSign, 60000);

// --- 5. Newsletter Signup ---
function handleNewsletterSignup(event) {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    
    if (!email) {
        alert('Please enter a valid email address.');
        return;
    }

    // Store email in localStorage (or send to backend)
    let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }

    // Show success message
    alert('🎉 Thanks for subscribing! Check your inbox for exclusive offers.');
    document.getElementById('newsletterEmail').value = '';
    
    // Optional: Send to your backend/email service here
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
}

window.onclick = function(event) {
    if (event.target == detailsModal) closeDetails();
    if (event.target == document.getElementById('cartModal')) closeCart();
}

// Force cart closed on page load to fix overlay blocking clicks
document.addEventListener('DOMContentLoaded', function() {
  closeCart();
  updateOpenStatus();
});

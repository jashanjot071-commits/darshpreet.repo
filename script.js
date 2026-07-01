// ============================
// DATA
// ============================
const products = [
  { id:1, name:'Rose Petal Gel Polish Set', category:'Gel Polish', price:899, originalPrice:1199, emoji:'💅', rating:4.9, reviews:124, badge:'new', inStock:true, colors:['#f5e6e8','#e8c5cc','#c9919b','#b5606d'] },
  { id:2, name:'Luxury Press-On Kit – Nude', category:'Press-On', price:649, originalPrice:849, emoji:'✨', rating:4.8, reviews:89, badge:'sale', inStock:true, colors:['#f0ddd0','#d4a0a9','#c9a96e'] },
  { id:3, name:'Pro Nail Art Brush Set', category:'Tools', price:1299, originalPrice:null, emoji:'🎨', rating:4.7, reviews:67, badge:'hot', inStock:true, colors:['#2c2226','#8a7070'] },
  { id:4, name:'Glitter French Tip Set', category:'Nail Art', price:549, originalPrice:699, emoji:'💎', rating:4.9, reviews:203, badge:'sale', inStock:true, colors:['#fdf8f5','#c9a96e','#e8c5cc'] },
  { id:5, name:'Rhinestone Bling Kit', category:'Accessories', price:399, originalPrice:null, emoji:'💎', rating:4.6, reviews:45, badge:'new', inStock:true, colors:['#c9a96e','#f5e6e8'] },
  { id:6, name:'Matte Topcoat Collection', category:'Gel Polish', price:799, originalPrice:999, emoji:'🌸', rating:4.8, reviews:156, badge:'sale', inStock:true, colors:['#2c2226','#8a7070','#f5e6e8'] },
  { id:7, name:'Ombre Nail Kit – Sunset', category:'Nail Art', price:999, originalPrice:1299, emoji:'🌅', rating:4.7, reviews:78, badge:'new', inStock:false, colors:['#f0ddd0','#d4a0a9','#b5606d'] },
  { id:8, name:'Baby Pink Press-On Set', category:'Press-On', price:749, originalPrice:null, emoji:'🎀', rating:4.9, reviews:312, badge:'hot', inStock:true, colors:['#f5e6e8','#e8c5cc','#fdf8f5'] },
];

const services = [
  { id:1, name:'Classic Manicure', duration:'45 min', price:499, icon:'💅', desc:'Clean, shape & polish' },
  { id:2, name:'Gel Manicure', duration:'60 min', price:799, icon:'✨', desc:'Long-lasting gel color' },
  { id:3, name:'Nail Art Session', duration:'90 min', price:1299, icon:'🎨', desc:'Custom designs & art' },
  { id:4, name:'Press-On Application', duration:'30 min', price:399, icon:'💎', desc:'Professional press-on fitting' },
  { id:5, name:'Bridal Nail Package', duration:'120 min', price:2499, icon:'👑', desc:'Full bridal nail experience' },
  { id:6, name:'Nail Extension Set', duration:'90 min', price:1599, icon:'🌸', desc:'Acrylic/gel extensions' },
];

// STATE
let cart = JSON.parse(localStorage.getItem('dk_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('dk_wishlist') || '[]');
let currentUser = JSON.parse(localStorage.getItem('dk_user') || 'null');
let currentProduct = null;
let currentSort = 'all';
let calMonth = 4; // May (0-indexed)
let calYear = 2025;
let selectedService = null;
let selectedDay = null;
let selectedTime = null;

// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProducts();
  renderShopGrid(products);
  renderServices();
  renderCalendar();
  renderTimeSlots();
  updateBadges();
  if(currentUser) updateAuthBtn();

  // Header scroll effect
  window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    header.classList.toggle('scrolled', window.scrollY > 20);
    const scrollTop = document.getElementById('scrollTop');
    scrollTop.classList.toggle('visible', window.scrollY > 400);
  });
});

// ============================
// PAGE NAVIGATION
// ============================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if(page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Update nav active state
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if(a.getAttribute('data-page') === pageId) a.classList.add('active');
  });

  // Render dynamic content
  if(pageId === 'cart') renderCart();
  if(pageId === 'wishlist') renderWishlist();
  if(pageId === 'checkout') renderCheckoutItems();
}

// ============================
// PRODUCT CARD RENDERER
// ============================
function productCard(p, showRemoveWish = false) {
  const isWished = wishlist.some(w => w.id === p.id);
  const discount = p.originalPrice ? Math.round((1 - p.price/p.originalPrice)*100) : 0;
  return `
    <div class="product-card" id="pcard-${p.id}">
      <div class="product-img">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:5rem;background:linear-gradient(135deg,var(--blush),var(--rose));">${p.emoji}</div>
        <div class="product-badges">
          ${p.badge === 'new' ? '<span class="badge-tag badge-new">New</span>' : ''}
          ${p.badge === 'sale' ? '<span class="badge-tag badge-sale">Sale</span>' : ''}
          ${p.badge === 'hot' ? '<span class="badge-tag badge-hot">Hot</span>' : ''}
          ${!p.inStock ? '<span class="badge-tag" style="background:var(--muted)">Sold Out</span>' : ''}
        </div>
        <div class="product-actions">
          ${p.inStock ? `<button class="product-action-btn add-cart-btn" onclick="addToCart(${p.id})">🛍 Add</button>` : ''}
          ${showRemoveWish
            ? `<button class="product-action-btn" style="background:var(--accent);color:white;" onclick="removeFromWishlist(${p.id})">♡ Remove</button>`
            : `<button class="wishlist-btn ${isWished?'active':''}" onclick="toggleWishlist(${p.id})">${isWished?'♥':'♡'}</button>`
          }
        </div>
      </div>
      <div class="product-info" onclick="openProduct(${p.id})" style="cursor:pointer">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price">₹${p.price}</span>
          ${p.originalPrice ? `<span class="price-old">₹${p.originalPrice}</span>` : ''}
          ${discount > 0 ? `<span class="price-save">${discount}% OFF</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProducts() {
  const el = document.getElementById('featuredProducts');
  if(el) el.innerHTML = products.slice(0,4).map(p => productCard(p)).join('');
}

function renderShopGrid(list) {
  const el = document.getElementById('shopGrid');
  const count = document.getElementById('resultsCount');
  if(el) el.innerHTML = list.length ? list.map(p => productCard(p)).join('') : '<div class="empty-state"><div class="empty-icon">🔍</div><p style="color:var(--muted)">No products match your filters.</p></div>';
  if(count) count.textContent = `Showing ${list.length} product${list.length!==1?'s':''}`;
}

// ============================
// OPEN PRODUCT DETAIL
// ============================
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if(!p) return;
  currentProduct = p;
  const isWished = wishlist.some(w => w.id === p.id);
  const discount = p.originalPrice ? Math.round((1 - p.price/p.originalPrice)*100) : 0;
  const el = document.getElementById('productDetailContent');
  el.innerHTML = `
    <div class="product-gallery">
      <div class="main-img" style="font-size:7rem;background:linear-gradient(135deg,var(--blush),var(--rose));">${p.emoji}</div>
      <div class="thumb-row">
        ${[p.emoji, '✨', '💅', '🌸'].map((e,i) => `<div class="thumb ${i===0?'active':''}" style="background:linear-gradient(135deg,var(--blush),var(--rose));">${e}</div>`).join('')}
      </div>
    </div>
    <div class="product-detail-info">
      <div class="product-detail-category">${p.category}</div>
      <h1 class="product-detail-name">${p.name}</h1>
      <div class="product-detail-rating">
        <span class="stars" style="font-size:1rem;">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
        <span style="font-size:0.88rem;font-weight:600;color:var(--charcoal);">${p.rating}</span>
        <button class="review-link">${p.reviews} reviews</button>
      </div>
      <div class="product-detail-price">
        ₹${p.price}
        ${p.originalPrice ? `<span class="detail-price-old">₹${p.originalPrice}</span>` : ''}
        ${discount > 0 ? `<span class="detail-price-save">${discount}% OFF</span>` : ''}
      </div>
      <p class="product-detail-desc">A premium ${p.category.toLowerCase()} product crafted for nail enthusiasts who appreciate quality and style. Long-lasting formula with rich pigmentation. Perfect for all occasions — casual or glamorous.</p>
      <div class="divider"></div>
      <div class="option-label">Colour Options</div>
      <div class="color-options">
        ${p.colors.map((c,i) => `<div class="color-swatch ${i===0?'active':''}" style="background:${c}" onclick="selectColor(this)" title="${c}"></div>`).join('')}
      </div>
      <div class="option-label">Quantity</div>
      <div class="quantity-selector">
        <button class="qty-btn" onclick="changeQty(-1)">−</button>
        <div class="qty-display" id="qtyDisplay">1</div>
        <button class="qty-btn" onclick="changeQty(1)">+</button>
      </div>
      ${p.inStock
        ? `<button class="add-to-cart-main" onclick="addToCart(${p.id})">🛍 Add to Cart</button>`
        : `<button class="add-to-cart-main" disabled style="opacity:0.5;cursor:not-allowed;">Out of Stock</button>`
      }
      <button class="wishlist-full ${isWished?'active':''}" onclick="toggleWishlist(${p.id})" id="wishlistDetailBtn">
        ${isWished ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
      </button>
      <div class="product-features">
        <div class="feature-item"><span class="feature-icon">🚚</span> Free shipping on orders above ₹999</div>
        <div class="feature-item"><span class="feature-icon">↩️</span> Easy 7-day returns</div>
        <div class="feature-item"><span class="feature-icon">🔒</span> Secure payment guaranteed</div>
        <div class="feature-item"><span class="feature-icon">💯</span> Authentic, quality-tested product</div>
      </div>
    </div>
  `;
  // Related
  const related = document.getElementById('relatedProducts');
  if(related) {
    const relItems = products.filter(x => x.id !== p.id && x.category === p.category).slice(0,4);
    const fallback = products.filter(x => x.id !== p.id).slice(0,4);
    related.innerHTML = (relItems.length >= 2 ? relItems : fallback).map(x => productCard(x)).join('');
  }
  showPage('product');
}

let productQty = 1;
function changeQty(delta) {
  productQty = Math.max(1, productQty + delta);
  const el = document.getElementById('qtyDisplay');
  if(el) el.textContent = productQty;
}
function selectColor(el) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

// ============================
// CART
// ============================
function addToCart(productId) {
  const p = products.find(x => x.id === productId);
  if(!p) return;
  const existing = cart.find(i => i.id === productId);
  if(existing) {
    existing.qty += (currentProduct && currentProduct.id === productId ? productQty : 1);
  } else {
    cart.push({ ...p, qty: currentProduct && currentProduct.id === productId ? productQty : 1 });
  }
  saveCart();
  updateBadges();
  showToast(`${p.name} added to cart!`, 'success');
  productQty = 1;
  const qd = document.getElementById('qtyDisplay');
  if(qd) qd.textContent = 1;
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateBadges(); renderCart();
  showToast('Item removed from cart', 'info');
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if(item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(); renderCart(); updateBadges();
  }
}

function saveCart() {
  localStorage.setItem('dk_cart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const el = document.getElementById('cartContent');
  if(!el) return;
  if(cart.length === 0) {
    el.innerHTML = `<div class="cart-empty">
      <div class="empty-icon">🛍</div>
      <h3>Your Cart is Empty</h3>
      <p>Looks like you haven't added anything yet. Let's change that!</p>
      <button class="btn btn-primary" onclick="showPage('shop')">Start Shopping →</button>
    </div>`;
    return;
  }
  el.innerHTML = `<div class="cart-layout">
    <div>
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-img">${item.emoji}</div>
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-variant">${item.category}</div>
              <div class="cart-qty-row">
                <div class="mini-qty">
                  <button class="mini-qty-btn" onclick="updateCartQty(${item.id},-1)">−</button>
                  <span class="mini-qty-num">${item.qty}</span>
                  <button class="mini-qty-btn" onclick="updateCartQty(${item.id},1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
              </div>
            </div>
            <div class="cart-item-price">
              ₹${(item.price * item.qty).toLocaleString()}
              <small>₹${item.price} each</small>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="cart-summary">
      <div class="summary-title">Order Summary</div>
      <div class="summary-row"><span>Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} items)</span><span>₹${getCartTotal().toLocaleString()}</span></div>
      <div class="summary-row"><span>Shipping</span><span style="color:#7dc98f;">${getCartTotal() >= 999 ? 'Free' : '₹60'}</span></div>
      <div class="coupon-row">
        <input class="coupon-input" placeholder="Coupon code" id="couponInput">
        <button class="coupon-btn" onclick="applyCoupon()">Apply</button>
      </div>
      <div class="summary-row total"><span>Total</span><span>₹${(getCartTotal() + (getCartTotal()>=999?0:60)).toLocaleString()}</span></div>
      <button class="checkout-btn" onclick="goToCheckout()">🔒 Proceed to Checkout</button>
      <div style="text-align:center;margin-top:14px;">
        <button style="background:none;color:var(--muted);font-size:0.78rem;text-decoration:underline;cursor:pointer;" onclick="showPage('shop')">← Continue Shopping</button>
      </div>
    </div>
  </div>`;
}

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  if(code === 'DK15' || code === 'DETAILSDK') showToast('Coupon applied! 15% off 🎀', 'success');
  else showToast('Invalid coupon code', 'error');
}

function goToCheckout() {
  if(cart.length === 0) { showToast('Your cart is empty!','error'); return; }
  renderCheckoutItems();
  showPage('checkout');
  // reset steps
  nextCheckoutStep(1);
}

// ============================
// WISHLIST
// ============================
function toggleWishlist(id) {
  const p = products.find(x => x.id === id);
  if(!p) return;
  const idx = wishlist.findIndex(w => w.id === id);
  if(idx >= 0) {
    wishlist.splice(idx, 1);
    showToast(`${p.name} removed from wishlist`, 'info');
  } else {
    wishlist.push(p);
    showToast(`${p.name} added to wishlist! ♡`, 'success');
  }
  localStorage.setItem('dk_wishlist', JSON.stringify(wishlist));
  updateBadges();
  // Update buttons in DOM
  document.querySelectorAll(`#pcard-${id} .wishlist-btn`).forEach(btn => {
    const isNowWished = wishlist.some(w => w.id === id);
    btn.textContent = isNowWished ? '♥' : '♡';
    btn.classList.toggle('active', isNowWished);
  });
  const wdb = document.getElementById('wishlistDetailBtn');
  if(wdb) {
    const isNowWished = wishlist.some(w => w.id === id);
    wdb.textContent = isNowWished ? '♥ Remove from Wishlist' : '♡ Add to Wishlist';
    wdb.classList.toggle('active', isNowWished);
  }
}

function removeFromWishlist(id) {
  wishlist = wishlist.filter(w => w.id !== id);
  localStorage.setItem('dk_wishlist', JSON.stringify(wishlist));
  updateBadges(); renderWishlist();
  showToast('Removed from wishlist', 'info');
}

function renderWishlist() {
  const el = document.getElementById('wishlistContent');
  if(!el) return;
  if(wishlist.length === 0) {
    el.innerHTML = `<div class="empty-state" style="padding:80px 0;">
      <div class="empty-icon">♡</div>
      <h3 style="font-family:var(--font-display);font-size:1.6rem;font-weight:400;margin-bottom:10px;">Your Wishlist is Empty</h3>
      <p style="color:var(--muted);margin-bottom:30px;">Save your favourite products here!</p>
      <button class="btn btn-primary" onclick="showPage('shop')">Browse Products →</button>
    </div>`;
    return;
  }
  el.innerHTML = `<div class="products-grid" style="padding:40px 0 80px;">${wishlist.map(p => productCard(p, true)).join('')}</div>`;
}

// ============================
// FILTERS & SORT
// ============================
function applyFilters() {
  const cats = [...document.querySelectorAll('.cat-filter:checked')].map(c => c.value);
  const maxPrice = parseInt(document.getElementById('priceRange')?.value || 9999);
  const inStockOnly = document.getElementById('inStockFilter')?.checked;
  const saleOnly = document.getElementById('saleFilter')?.checked;

  let filtered = products.filter(p => {
    if(cats.length && !cats.includes(p.category)) return false;
    if(p.price > maxPrice) return false;
    if(inStockOnly && !p.inStock) return false;
    if(saleOnly && !p.originalPrice) return false;
    return true;
  });
  if(currentSort === 'new') filtered = filtered.filter(p => p.badge === 'new');
  if(currentSort === 'popular') filtered = [...filtered].sort((a,b) => b.reviews - a.reviews);
  if(currentSort === 'sale') filtered = filtered.filter(p => p.badge === 'sale');
  renderShopGrid(filtered);
}

function setActiveSort(btn, type) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  currentSort = type;
  applyFilters();
}

function sortProducts(val) {
  let sorted = [...products];
  if(val === 'price-asc') sorted.sort((a,b) => a.price - b.price);
  if(val === 'price-desc') sorted.sort((a,b) => b.price - a.price);
  if(val === 'rating') sorted.sort((a,b) => b.rating - a.rating);
  renderShopGrid(sorted);
}

function filterShop(category) {
  showPage('shop');
  setTimeout(() => {
    document.querySelectorAll('.cat-filter').forEach(c => { c.checked = c.value === category; });
    applyFilters();
  }, 100);
}

// ============================
// CHECKOUT
// ============================
let checkoutStep = 1;
function nextCheckoutStep(step) {
  checkoutStep = step;
  [1,2,3].forEach(s => {
    const el = document.getElementById('checkoutStep'+s);
    if(el) el.style.display = s === step ? 'block' : 'none';
    const circle = document.getElementById('step'+s);
    if(circle) {
      circle.classList.remove('active','done');
      if(s < step) circle.classList.add('done');
      if(s === step) circle.classList.add('active');
    }
    const line = document.getElementById('line'+s);
    if(line) line.classList.toggle('done', s < step);
  });
  if(step === 3) {
    cart = []; saveCart(); updateBadges();
  }
}

function renderCheckoutItems() {
  const el = document.getElementById('checkoutItems');
  const sub = document.getElementById('checkoutSubtotal');
  const tot = document.getElementById('checkoutTotal');
  if(!el) return;
  const total = getCartTotal();
  el.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <div class="checkout-item-img">${item.emoji}</div>
      <div>
        <div class="checkout-item-name">${item.name}</div>
        <div style="font-size:0.72rem;color:var(--muted);">Qty: ${item.qty}</div>
      </div>
      <div class="checkout-item-price">₹${(item.price*item.qty).toLocaleString()}</div>
    </div>
  `).join('');
  if(sub) sub.textContent = `₹${total.toLocaleString()}`;
  if(tot) tot.textContent = `₹${(total + (total >= 999 ? 0 : 60)).toLocaleString()}`;
}

function selectPayment(el) {
  document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
}

function formatCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
}

// ============================
// AUTH
// ============================
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.auth-tab:${tab==='login'?'first':'last'}-child`).classList.add('active');
  document.getElementById(tab + 'Panel').classList.add('active');
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const pw = document.getElementById('loginPassword').value;
  if(!email || !pw) { showToast('Please fill in all fields','error'); return; }
  currentUser = { email, name: email.split('@')[0] };
  localStorage.setItem('dk_user', JSON.stringify(currentUser));
  updateAuthBtn();
  showPage('home');
  showToast(`Welcome back, ${currentUser.name}! 🎀`,'success');
}

function handleSignup() {
  const first = document.getElementById('signupFirst').value;
  const last = document.getElementById('signupLast').value;
  const email = document.getElementById('signupEmail').value;
  const pw = document.getElementById('signupPassword').value;
  if(!first || !email || !pw) { showToast('Please fill in all required fields','error'); return; }
  currentUser = { email, name: first + ' ' + last };
  localStorage.setItem('dk_user', JSON.stringify(currentUser));
  updateAuthBtn();
  showPage('home');
  showToast(`Welcome to Details by DK, ${first}! 🎀`,'success');
}

function handleSocialLogin(provider) {
  currentUser = { email: 'user@gmail.com', name: 'Guest User' };
  localStorage.setItem('dk_user', JSON.stringify(currentUser));
  updateAuthBtn();
  showPage('home');
  showToast(`Signed in with ${provider}! 🎀`,'success');
}

function updateAuthBtn() {
  const btn = document.getElementById('authBtn');
  if(btn && currentUser) btn.title = `Hi, ${currentUser.name}`;
}

// ============================
// CONTACT
// ============================
function submitContact() {
  const f = document.getElementById('contactFirst').value;
  const e = document.getElementById('contactEmail').value;
  const m = document.getElementById('contactMessage').value;
  if(!f || !e || !m) { showToast('Please fill in all required fields','error'); return; }
  showToast('Message sent! We\'ll get back to you soon 🌸','success');
  ['contactFirst','contactLast','contactEmail','contactPhone','contactMessage'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
}

function openWhatsApp() {
  window.open('https://wa.me/919876543210?text=Hi+Details+by+DK!+I+had+a+question+about+your+nail+services.', '_blank');
}

// ============================
// BOOKING
// ============================
function renderServices() {
  const el = document.getElementById('serviceCards');
  if(!el) return;
  el.innerHTML = services.map(s => `
    <div class="service-card" id="svc-${s.id}" onclick="selectService(${s.id})">
      <div class="service-icon">${s.icon}</div>
      <div>
        <div class="service-name">${s.name}</div>
        <div class="service-duration">⏱ ${s.duration} · ${s.desc}</div>
      </div>
      <div class="service-price">₹${s.price}</div>
    </div>
  `).join('');
}

function selectService(id) {
  selectedService = id;
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('svc-'+id)?.classList.add('selected');
}

function renderCalendar() {
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const el = document.getElementById('calGrid');
  const titleEl = document.getElementById('calTitle');
  if(!el || !titleEl) return;
  titleEl.textContent = `${monthNames[calMonth]} ${calYear}`;
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  let html = days.map(d => `<div class="cal-day-label">${d}</div>`).join('');
  for(let i=0;i<firstDay;i++) html += `<div></div>`;
  for(let d=1;d<=daysInMonth;d++) {
    const isActive = selectedDay === d;
    const isPast = (calYear === 2025 && calMonth === 4 && d < 1);
    html += `<div class="cal-day ${isActive?'active':''} ${isPast?'inactive':''}" onclick="${isPast?'':'selectDay('+d+')'}">${d}</div>`;
  }
  el.innerHTML = html;
}

function selectDay(d) {
  selectedDay = d;
  renderCalendar();
  renderTimeSlots();
}

function changeMonth(delta) {
  calMonth += delta;
  if(calMonth > 11) { calMonth=0; calYear++; }
  if(calMonth < 0) { calMonth=11; calYear--; }
  selectedDay = null;
  renderCalendar();
}

function renderTimeSlots() {
  const times = ['10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];
  const unavailable = [2,5,7];
  const el = document.getElementById('timeSlots');
  if(!el) return;
  el.innerHTML = times.map((t,i) => {
    const isUnavail = unavailable.includes(i);
    const isSel = selectedTime === t;
    return `<button class="time-slot ${isUnavail?'unavailable':''} ${isSel?'selected':''}" onclick="${isUnavail?'':'selectTime(\''+t+'\')'}">${t}</button>`;
  }).join('');
}

function selectTime(t) {
  selectedTime = t;
  renderTimeSlots();
}

function confirmBooking() {
  const name = document.getElementById('bookName').value;
  const phone = document.getElementById('bookPhone').value;
  if(!selectedService) { showToast('Please select a service','error'); return; }
  if(!selectedDay) { showToast('Please select a date','error'); return; }
  if(!selectedTime) { showToast('Please select a time slot','error'); return; }
  if(!name || !phone) { showToast('Please enter your name and phone number','error'); return; }
  const svc = services.find(s => s.id === selectedService);
  showToast(`Appointment booked! ${svc.name} on May ${selectedDay} at ${selectedTime} 🎀`,'success');
  document.getElementById('bookName').value = '';
  document.getElementById('bookPhone').value = '';
  selectedDay = null; selectedTime = null; selectedService = null;
  renderCalendar(); renderTimeSlots();
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
}

// ============================
// BADGES & NEWSLETTER
// ============================
function updateBadges() {
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const wishCount = wishlist.length;
  const cb = document.getElementById('cartBadge');
  const wb = document.getElementById('wishlistBadge');
  if(cb) { cb.textContent = cartCount; cb.style.display = cartCount > 0 ? 'flex' : 'none'; }
  if(wb) { wb.textContent = wishCount; wb.style.display = wishCount > 0 ? 'flex' : 'none'; }
}

function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value;
  if(!email) { showToast('Please enter your email address','error'); return; }
  showToast('Subscribed! 15% off code: DK15 🎀','success');
  document.getElementById('newsletterEmail').value = '';
}

// ============================
// TOAST
// ============================
function showToast(msg, type='info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success:'✓', info:'ℹ', error:'!' };
  toast.innerHTML = `<span style="width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:0.7rem;flex-shrink:0;">${icons[type]||'ℹ'}</span>${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(40px)'; toast.style.transition='0.3s ease'; setTimeout(()=>toast.remove(),300); }, 3000);
}

// ============================
// MOBILE NAV
// ============================
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
}

// Initial render
renderShopGrid(products);
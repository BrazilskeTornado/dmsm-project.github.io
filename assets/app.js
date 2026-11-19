var menuToggle = document.querySelector('.menu-toggle');
var navigation = document.querySelector('#main-navigation');

if (navigation && !navigation.querySelector('a[href="blog.html"]')) {
    var journalLink = document.createElement('a');
    journalLink.href = 'blog.html';
    journalLink.textContent = 'Journal';
    var shopLink = navigation.querySelector('a[href="http://presta.fp.vut.cz/~xhudecm00/index.php"]');
    navigation.insertBefore(journalLink, shopLink || null);
}

document.querySelectorAll('.site-footer .footer-links').forEach(function (footerLinks) {
    if (!footerLinks.querySelector('a[href="blog.html"]')) {
        var footerJournal = document.createElement('a');
        footerJournal.href = 'blog.html';
        footerJournal.textContent = 'Journal';
        footerLinks.appendChild(footerJournal);
    }
});

if (menuToggle && navigation) {
    menuToggle.addEventListener('click', function () {
        var isOpen = navigation.classList.toggle('is-open');
        menuToggle.classList.toggle('is-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    navigation.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navigation.classList.remove('is-open');
            menuToggle.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
        });
    });
}

var revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });

    revealItems.forEach(function (item) {
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach(function (item) {
        item.classList.add('is-visible');
    });
}

(function () {
    'use strict';
    var content = window.AuraContent;
    if (!content) return;

    function money(value) {
        return '$' + Number(value).toFixed(2);
    }

    function renderArticles() {
        var grid = document.querySelector('#article-grid');
        if (!grid) return;
        grid.innerHTML = content.articles().filter(function (article) { return article.published !== false; }).map(function (article) {
            return '<article class="article-card reveal is-visible"><div class="article-art"><span>' + article.category + '</span></div><div class="article-card-body"><p class="article-meta">' + article.date + ' · ' + article.readingTime + '</p><h2>' + article.title + '</h2><p>' + article.excerpt + '</p><a class="card-link" href="blog-article.html?slug=' + encodeURIComponent(article.slug) + '">Read the article <span>↗</span></a></div></article>';
        }).join('');
    }

    function renderArticle() {
        var target = document.querySelector('#article-view');
        if (!target) return;
        var slug = new URLSearchParams(window.location.search).get('slug') || window.location.pathname.split('/').filter(Boolean).pop();
        var article = content.articles().find(function (item) { return item.slug === slug; }) || content.articles()[0];
        document.title = article.title + ' | AuraPerform';
        target.innerHTML = '<header class="article-header"><a class="text-link" href="blog.html">← Back to journal</a><p class="eyebrow">' + article.category + '</p><h1>' + article.title + '</h1><div class="article-meta"><span>' + article.date + '</span><span>' + article.readingTime + '</span><span>By ' + (article.author || 'The AuraPerform team') + '</span></div></header><div class="article-content">' + article.content + '<aside class="article-takeaways"><p class="eyebrow">Key takeaways</p><ul>' + (article.takeaways || []).map(function (takeaway) { return '<li>' + takeaway + '</li>'; }).join('') + '</ul></aside></div><div class="article-cta"><div><p class="eyebrow">Keep the ritual going</p><strong>Choose a formula for your next session.</strong><span> Explore purposeful ingredients and find a flavor that fits the way you train.</span></div><a class="button" href="http://presta.fp.vut.cz/~xhudecm00/index.php" target="_blank" rel="noopener">Explore products</a></div>';
    }

    var cart = [];
    function renderProducts() {
        var grid = document.querySelector('#product-grid');
        if (!grid) return;
        grid.innerHTML = content.products().map(function (product) {
            return '<article class="product-card reveal is-visible"><div class="product-image ' + product.color + '"><span>' + product.badge + '</span><strong>AP</strong></div><div class="product-card-body"><div class="product-title-row"><h2>' + product.title + '</h2><strong>' + money(product.price) + '</strong></div><p>' + product.description + '</p><ul>' + product.benefits.map(function (benefit) { return '<li>' + benefit + '</li>'; }).join('') + '</ul><div class="product-actions"><button class="button" data-add-product="' + product.id + '"' + (product.stock ? '' : ' disabled') + '>' + (product.stock ? 'Add to cart' : 'Currently unavailable') + '</button><button class="text-link detail-button" type="button" data-view-product="' + product.id + '">View details <span>↗</span></button></div></div></article>';
        }).join('');
        grid.querySelectorAll('[data-add-product]').forEach(function (button) { button.addEventListener('click', function () { cart.push(button.getAttribute('data-add-product')); updateCart(); }); });
        grid.querySelectorAll('[data-view-product]').forEach(function (button) { button.onclick = function (event) { event.preventDefault(); event.stopPropagation(); var product = content.products().find(function (item) { return item.id === button.getAttribute('data-view-product'); }); if (!product) return; document.querySelector('#product-detail').innerHTML = '<p class="eyebrow">' + product.badge + '</p><h2 id="product-detail-title">' + product.title + '</h2><p>' + product.description + '</p><ul>' + product.benefits.map(function (benefit) { return '<li>' + benefit + '</li>'; }).join('') + '</ul><div class="detail-price">' + money(product.price) + '</div><button class="button detail-add-button" data-detail-add="' + product.id + '">Add to cart</button>'; document.querySelector('#product-detail-modal').hidden = false; document.body.classList.add('modal-open'); document.querySelector('[data-detail-add]').onclick = function () { cart.push(product.id); updateCart(); document.querySelector('#product-detail-modal').hidden = true; document.querySelector('#cart-modal').hidden = false; document.body.classList.add('modal-open'); }; }; });
    }

    function updateCart() {
        var products = content.products();
        var count = document.querySelector('#cart-count');
        var floatingCount = document.querySelector('#cart-floating-count');
        var items = document.querySelector('#cart-items');
        var total = document.querySelector('#cart-total');
        if (count) count.textContent = String(cart.length);
        if (floatingCount) floatingCount.textContent = String(cart.length);
        if (items) {
            items.innerHTML = cart.length ? cart.map(function (id, index) {
                var product = products.find(function (item) { return item.id === id; });
                return '<div class="cart-item"><div class="cart-item-info"><strong>' + product.title + '</strong><span>30-serving formula</span></div><strong class="cart-item-price">' + money(product.price) + '</strong><button class="cart-remove" type="button" data-remove-cart="' + index + '">Remove</button></div>';
            }).join('') : '<p class="muted">Your cart is ready for its first scoop.</p>';
            items.querySelectorAll('[data-remove-cart]').forEach(function (button) { button.onclick = function () { cart.splice(Number(button.dataset.removeCart), 1); updateCart(); }; });
        }
        if (total) total.textContent = money(cart.reduce(function (sum, id) { var item = products.find(function (product) { return product.id === id; }); return sum + (item ? Number(item.price) : 0); }, 0));
    }

    function renderCheckout() {
            var target = document.querySelector('#checkout-content');
            if (!target) return;
            var products = content.products();
            var total = cart.reduce(function (sum, id) { var item = products.find(function (product) { return product.id === id; }); return sum + (item ? Number(item.price) : 0); }, 0);
            target.innerHTML = '<p class="eyebrow">Secure prototype checkout</p><h2 id="checkout-title">Complete your order.</h2><p class="checkout-intro">This is a mock checkout. No payment is collected.</p><form id="checkout-form" class="checkout-form-modern"><label>Full name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required></label><label>Shipping address<input name="address" autocomplete="street-address" required></label><label>City<input name="city" autocomplete="address-level2" required></label><label>ZIP code<input name="zip" autocomplete="postal-code" required></label><div class="checkout-total"><span>Order total: </span><strong>' + money(total) + '</strong></div><button class="button" type="submit">Place Order (Mock)</button></form>';
            document.querySelector('#checkout-form').onsubmit = function (event) {
                event.preventDefault();
                var form = event.target;
                var data = new FormData(form);
                var order = {
                    id: 'AP-' + Date.now().toString().slice(-8),
                    customer: { name: data.get('name'), email: data.get('email'), phone: data.get('phone'), address: data.get('address'), city: data.get('city'), zip: data.get('zip') },
                    items: cart.map(function (id) { var item = products.find(function (product) { return product.id === id; }); return { id: item.id, title: item.title, price: Number(item.price) }; }),
                    total: total,
                    date: new Date().toISOString(),
                    status: 'Received'
                };
                content.saveOrders(content.orders().concat(order));
                target.innerHTML = '<div class="order-confirmation"><p class="eyebrow">Order received</p><h2>Thank You for Your Order!</h2><p>Your mock order <strong>' + order.id + '</strong> has been saved locally.</p><div class="confirmation-summary"><span>' + order.items.length + ' item(s) </span><strong>' + money(order.total) + '</strong><small> Shipping to ' + order.customer.city + ', ' + order.customer.zip + '</small></div><button class="button" type="button" data-finish-order>Back to shop</button></div>';
                cart = [];
                updateCart();
                document.querySelector('[data-finish-order]').onclick = function () { document.querySelector('#checkout-modal').hidden = true; document.body.classList.remove('modal-open'); };
            };
    }

    function initShop() {
        if (!document.querySelector('#product-grid')) return;
        renderProducts(); updateCart();
        document.querySelector('#product-grid').addEventListener('click', function (event) {
            if (!event.target.closest('[data-add-product]')) return;
            var modal = document.querySelector('#cart-modal');
            if (modal) {
                modal.hidden = false;
                document.body.classList.add('modal-open');
            }
        });
        document.querySelectorAll('[data-close-cart]').forEach(function (button) { button.onclick = function () { document.querySelector('#cart-modal').hidden = true; document.body.classList.remove('modal-open'); }; });
        document.querySelectorAll('[data-close-detail]').forEach(function (button) { button.onclick = function () { document.querySelector('#product-detail-modal').hidden = true; document.body.classList.remove('modal-open'); }; });
        document.querySelectorAll('.modal-backdrop').forEach(function (backdrop) { backdrop.addEventListener('click', function (event) { if (event.target === backdrop) { backdrop.hidden = true; document.body.classList.remove('modal-open'); } }); });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { document.querySelectorAll('.modal-backdrop').forEach(function (modal) { modal.hidden = true; }); document.body.classList.remove('modal-open'); } });
        document.querySelector('[data-checkout]').onclick = function (event) { event.preventDefault(); if (!cart.length) return; renderCheckout(); document.querySelector('#cart-modal').hidden = true; document.querySelector('#checkout-modal').hidden = false; document.body.classList.add('modal-open'); };
        document.querySelectorAll('[data-open-cart]').forEach(function (button) { button.onclick = function () { if (!cart.length) return; document.querySelector('#checkout-modal').hidden = true; document.querySelector('#product-detail-modal').hidden = true; document.querySelector('#cart-modal').hidden = false; document.body.classList.add('modal-open'); }; });
        document.querySelectorAll('[data-close-checkout]').forEach(function (button) { button.onclick = function () { document.querySelector('#checkout-modal').hidden = true; document.querySelector('#cart-modal').hidden = false; document.body.classList.add('modal-open'); }; });
    }

    function initAdmin() {
        var root = document.querySelector('#admin-app');
        if (!root) return;
        if (sessionStorage.getItem('auraperform-admin') !== 'true') {
            root.innerHTML = '<div class="admin-login"><p class="eyebrow">Private workspace</p><h2>Enter your passcode.</h2><p class="muted">This lightweight demo panel stores updates in this browser only.</p><input id="admin-passcode" type="password" placeholder="Passcode" aria-label="Admin passcode"><button class="button" id="admin-login-button">Unlock dashboard</button><p id="admin-error" class="error-message"></p></div>';
            document.querySelector('#admin-login-button').onclick = function () { if (document.querySelector('#admin-passcode').value === 'aura2026') { sessionStorage.setItem('auraperform-admin', 'true'); initAdmin(); } else document.querySelector('#admin-error').textContent = 'That passcode did not match.'; };
            return;
        }
        root.innerHTML = '<div class="admin-toolbar"><div><p class="eyebrow">Dashboard unlocked</p><h2>Content management</h2></div><button class="button button-secondary" id="admin-logout">Lock panel</button></div></div><div class="admin-panels"><section class="admin-panel is-active" data-admin-panel="products"><h3>Products</h3><div id="admin-products"></div><button class="button" id="add-product">Add product</button></section><section class="admin-panel" data-admin-panel="articles"><h3>Journal posts</h3><div id="admin-articles"></div><button class="button" id="add-article">Add article</button></section><section class="admin-panel" data-admin-panel="orders"><h3>Mock orders</h3><div id="admin-orders"></div></section></div>';
        renderAdminProducts(); renderAdminArticles(); renderAdminOrders();
        document.querySelectorAll('[data-admin-tab]').forEach(function (tab) { tab.onclick = function () { document.querySelectorAll('[data-admin-tab], [data-admin-panel]').forEach(function (item) { item.classList.remove('is-active'); }); tab.classList.add('is-active'); document.querySelector('[data-admin-panel="' + tab.dataset.adminTab + '"]').classList.add('is-active'); if (tab.dataset.adminTab === 'orders') renderAdminOrders(); }; });
        document.querySelector('#admin-logout').onclick = function () { sessionStorage.removeItem('auraperform-admin'); initAdmin(); };
        document.querySelector('#add-product').onclick = function () { var products = content.products(); products.push({ id: 'product-' + Date.now(), title: 'New formula', description: 'Describe this flavor.', benefits: ['30 servings'], price: 34, badge: 'New', stock: true, color: 'blue' }); content.saveProducts(products); renderAdminProducts(); };
        document.querySelector('#add-article').onclick = function () { var articles = content.articles(); articles.push({ slug: 'new-post-' + Date.now(), title: 'New journal post', date: 'November 3, 2026', readingTime: '3 min read', category: 'Training', excerpt: 'Add a short summary.', content: '<p>Write your article here.</p>' }); content.saveArticles(articles); renderAdminArticles(); };
    }

    function renderAdminProducts() {
        var node = document.querySelector('#admin-products'); if (!node) return;
        node.innerHTML = content.products().map(function (product) { return '<div class="admin-row" data-product-id="' + product.id + '"><label class="admin-field"><span>Product title</span><input data-field="title" value="' + product.title.replace(/"/g, '&quot;') + '"></label><label class="admin-field"><span>Price</span><input data-field="price" type="number" min="0" step=".01" value="' + product.price + '"></label><label class="admin-check"><input data-field="stock" type="checkbox" ' + (product.stock ? 'checked' : '') + '> In stock</label><button class="admin-remove" data-delete-product>Remove</button></div>'; }).join('');
        node.querySelectorAll('.admin-row').forEach(function (row) { row.querySelectorAll('input').forEach(function (input) { input.onchange = function () { var products = content.products(); var item = products.find(function (product) { return product.id === row.dataset.productId; }); item[input.dataset.field] = input.type === 'checkbox' ? input.checked : (input.dataset.field === 'price' ? Number(input.value) : input.value); content.saveProducts(products); }; }); row.querySelector('[data-delete-product]').onclick = function () { content.saveProducts(content.products().filter(function (product) { return product.id !== row.dataset.productId; })); renderAdminProducts(); }; });
    }

    function renderAdminArticles() {
        var node = document.querySelector('#admin-articles'); if (!node) return;
        node.innerHTML = content.articles().map(function (article) { return '<div class="admin-article-row" data-article-slug="' + article.slug + '"><label class="admin-field"><span>Article title</span><input data-field="title" value="' + article.title.replace(/"/g, '&quot;') + '"></label><label class="admin-field"><span>Article HTML</span><textarea data-field="content">' + article.content + '</textarea></label><label class="admin-check"><input data-field="published" type="checkbox" ' + (article.published !== false ? 'checked' : '') + '> Published</label><button class="admin-remove" data-delete-article>Remove</button></div>'; }).join('');
        node.querySelectorAll('.admin-article-row').forEach(function (row) { row.querySelectorAll('input, textarea').forEach(function (input) { input.onchange = function () { var articles = content.articles(); var item = articles.find(function (article) { return article.slug === row.dataset.articleSlug; }); item[input.dataset.field] = input.type === 'checkbox' ? input.checked : input.value; content.saveArticles(articles); }; }); row.querySelector('[data-delete-article]').onclick = function () { content.saveArticles(content.articles().filter(function (article) { return article.slug !== row.dataset.articleSlug; })); renderAdminArticles(); }; });
    }

    function renderAdminOrders() {
        var node = document.querySelector('#admin-orders'); if (!node) return;
        var orders = content.orders();
        node.innerHTML = orders.length ? '<div class="order-cards">' + orders.slice().reverse().map(function (order, index) { var itemNames = order.items.map(function (item) { return '<li><span>' + item.title + '</span><strong>' + money(item.price) + '</strong></li>'; }).join(''); return '<article class="order-card"><div class="order-card-top"><div><p class="eyebrow">Order ' + String(orders.length - index).padStart(2, '0') + '</p><h4>' + order.customer.name + '</h4></div><span class="order-status">' + order.status + '</span></div><div class="order-card-grid"><div class="order-detail"><span>Contact</span><strong>' + order.customer.email + '</strong><small>' + order.customer.phone + '</small></div><div class="order-detail"><span>Shipping</span><strong>' + order.customer.address + '</strong><small>' + order.customer.city + ', ' + order.customer.zip + '</small></div><div class="order-detail order-detail-items"><span>Items purchased</span><ul>' + itemNames + '</ul></div><div class="order-detail order-detail-total"><span>Total amount</span><strong>' + money(order.total) + '</strong><small>' + new Date(order.date).toLocaleDateString() + '</small></div></div></article>'; }).join('') + '</div>' : '<div class="empty-orders"><p class="eyebrow">No orders yet</p><p>Completed mock checkouts will appear here.</p></div>';
    }

    renderArticles(); renderArticle(); initShop(); initAdmin();
}());

/**
 * Artsy Baku - Məhsullar Səhifəsi (products.js)
 * store.json faylından məhsulları və gül rənglərini dinamik yükləyir və göstərir.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const store = await Config.getStore();
  if (!store) {
    showToast('Məhsul məlumatları yüklənərkən xəta baş verdi', 'error');
    return;
  }

  renderFlowerReference(store.flowers);
  renderProductsList(store.products, store.flowers);
});

/**
 * Gül rənglərinin vizual istinad lövhəsini göstərir
 */
function renderFlowerReference(flowers) {
  const container = document.getElementById('flowerReferenceGrid');
  if (!container || !flowers) return;

  container.innerHTML = flowers.map(flower => {
    const isAvail = flower.available !== false;
    return `
      <div class="flower-reference-card ${isAvail ? '' : 'unavailable'}">
        <span class="flower-num-badge">${flower.number || ''}</span>
        <div class="flower-reference-swatch" style="background-color: ${flower.hex};"></div>
        <div class="flower-reference-name">${flower.name}</div>
        <div class="flower-reference-status">${isAvail ? 'Mövcuddur' : 'Bitib'}</div>
      </div>
    `;
  }).join('');
}

/**
 * Məhsul kartlarını grid şəklində render edir
 */
function renderProductsList(products, flowers) {
  const container = document.getElementById('productsGrid');
  if (!container || !products) return;

  const flowerDotsHtml = (flowers || []).map(f => `
    <span class="flower-dot" style="background-color: ${f.hex};" title="${f.name} ${f.available === false ? '(Bitib)' : ''}"></span>
  `).join('');

  container.innerHTML = products.map(product => {
    const isAvailable = product.available !== false;
    const badgeHtml = product.badge ? `<span class="badge badge-gold">${product.badge}</span>` : '';
    const statusBadge = isAvailable
      ? '<span class="badge badge-green">Mövcuddur</span>'
      : '<span class="badge badge-red">Mövcud deyil</span>';

    return `
      <article class="product-card" id="card-${product.id}">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='assets/images/flower-colors.jpg'">
          <div class="product-badge-overlay">${badgeHtml}</div>
          <div class="product-availability-tag">${statusBadge}</div>
        </div>

        <div class="product-content">
          <div class="product-header-row">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-price">${product.price} AZN</span>
          </div>

          <p class="product-description">${product.description || ''}</p>

          <div class="product-card-colors">
            <div class="product-card-colors-label">
              <span>Mövcud Gül Rəngləri</span>
              <span>6 Rəng</span>
            </div>
            <div class="flower-dots-row">
              ${flowerDotsHtml}
            </div>
          </div>

          <div class="product-card-actions">
            ${isAvailable ? `
              <a href="order.html?product=${product.id}" class="btn btn-primary btn-block">
                <span>Sifariş Et</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            ` : `
              <button class="btn btn-secondary btn-block" disabled style="opacity: 0.55; cursor: not-allowed;">
                Mövcud Deyil
              </button>
            `}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

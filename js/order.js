/**
 * Artsy Baku - Çoxməhsullu Sifariş Sistemi (order.js)
 * Klassik səbətsiz, birbaşa çoxməhsullu sifariş forması və avtomatik qiymət hesablaması.
 */

let storeData = null;
let deliveryData = null;
let orderItems = [];
let itemCounter = 0;

document.addEventListener('DOMContentLoaded', async () => {
  storeData = await Config.getStore();
  deliveryData = await Config.getDelivery();

  if (!storeData) {
    showToast('Mağaza məlumatları yüklənə bilmədi', 'error');
    return;
  }

  // URL-dən parametr oxu (məsələn ?product=sep-a)
  const urlParams = new URLSearchParams(window.location.search);
  const initialProductId = urlParams.get('product');

  // Birinci məhsul sətrini əlavə et
  addNewOrderItem(initialProductId);

  // Düymə və hadisə dinləyiciləri
  document.getElementById('btnAddProduct').addEventListener('click', () => {
    addNewOrderItem();
  });

  // Çatdırılma radio düymələri
  document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
    radio.addEventListener('change', handleDeliveryMethodChange);
  });

  // Sifariş göndərmə düyməsi
  document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);

  // İlkin çatdırılma sahəsi görünüşü
  handleDeliveryMethodChange();
  updateOrderSummary();
});

/**
 * Sifarişə yeni məhsul bloku əlavə edir
 */
function addNewOrderItem(preferredProductId = null) {
  itemCounter++;
  const currentId = itemCounter;

  // Standart və ya ilk mövcud məhsul
  const availableProducts = storeData.products.filter(p => p.available !== false);
  let defaultProduct = availableProducts.find(p => p.id === preferredProductId) || availableProducts[0];
  
  // Standart və ya ilk mövcud gül
  const availableFlowers = storeData.flowers.filter(f => f.available !== false);
  let defaultFlower = availableFlowers[0];

  const newItem = {
    id: currentId,
    productId: defaultProduct ? defaultProduct.id : '',
    productName: defaultProduct ? defaultProduct.name : '',
    price: defaultProduct ? defaultProduct.price : 23,
    flowerId: defaultFlower ? defaultFlower.id : '',
    flowerName: defaultFlower ? defaultFlower.name : '',
    customName: '',
    quantity: 1,
    note: ''
  };

  orderItems.push(newItem);
  renderOrderItemHTML(newItem);
  updateOrderSummary();
  updateRemoveButtonsVisibility();
}

/**
 * Sifariş bloku üçün HTML yaradır
 */
function renderOrderItemHTML(item) {
  const container = document.getElementById('orderItemsWrapper');
  const card = document.createElement('div');
  card.className = 'order-item-card';
  card.id = `orderItemCard_${item.id}`;

  // Məhsul seçimi üçün option-lar
  const productOptions = storeData.products.map(p => {
    const isAvail = p.available !== false;
    const isSelected = p.id === item.productId ? 'selected' : '';
    return `<option value="${p.id}" ${isSelected} ${!isAvail ? 'disabled' : ''}>
      ${p.name} — ${p.price} AZN ${!isAvail ? '(Satışda yoxdur)' : ''}
    </option>`;
  }).join('');

  // Gül rəngləri seçimi
  const flowerOptions = storeData.flowers.map(f => {
    const isAvail = f.available !== false;
    const isChecked = f.id === item.flowerId ? 'checked' : '';
    return `
      <label class="color-option ${!isAvail ? 'disabled' : ''}">
        <input type="radio" name="flower_item_${item.id}" value="${f.id}" data-name="${f.name}" ${isChecked} ${!isAvail ? 'disabled' : ''}>
        <div class="color-option-box">
          <span class="color-circle" style="background-color: ${f.hex};"></span>
          <span class="color-name">${f.number ? f.number + '. ' : ''}${f.name}</span>
          ${!isAvail ? '<span class="color-status-note">Bitib</span>' : ''}
        </div>
      </label>
    `;
  }).join('');

  card.innerHTML = `
    <div class="order-item-header">
      <div class="order-item-number">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span class="item-title-label">Məhsul</span>
      </div>
      <button type="button" class="btn-remove-item" onclick="removeOrderItem(${item.id})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        <span>Məhsulu sil</span>
      </button>
    </div>

    <!-- Məhsul növü -->
    <div class="form-group">
      <label class="form-label">Məhsulu seçin <span class="req">*</span></label>
      <select class="form-control select-product" onchange="onProductChange(${item.id}, this.value)">
        ${productOptions}
      </select>
    </div>

    <!-- Canlı gül rəngi -->
    <div class="form-group">
      <label class="form-label">Canlı gül rəngi <span class="req">*</span> <span class="help-text">(6 rəng seçimi)</span></label>
      <div class="color-picker-grid">
        ${flowerOptions}
      </div>
    </div>

    <!-- Kapsul daxilinə yazılacaq ad -->
    <div class="form-group">
      <label class="form-label">Kapsul daxilinə yazılacaq ad <span class="help-text">(məsələn: Sevinc, Nigar, və ya baş hərf)</span></label>
      <input type="text" class="form-control input-custom-name" placeholder="Fərdi ad və ya xüsusi söz daxil edin" value="${item.customName}" oninput="onCustomNameChange(${item.id}, this.value)">
    </div>

    <!-- Miqdar və Məbləğ -->
    <div class="item-row-footer">
      <div>
        <label class="form-label" style="margin-bottom: 6px; font-size: 0.85rem;">Say:</label>
        <div class="quantity-control">
          <button type="button" class="qty-btn" onclick="changeItemQty(${item.id}, -1)">−</button>
          <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" readonly>
          <button type="button" class="qty-btn" onclick="changeItemQty(${item.id}, 1)">+</button>
        </div>
      </div>

      <div class="item-calc-price">
        Məhsul məbləği: <strong id="itemTotal_${item.id}">${item.price * item.quantity} AZN</strong>
      </div>
    </div>
  `;

  container.appendChild(card);

  // Gül rəngi radio listener əlavə et
  card.querySelectorAll(`input[name="flower_item_${item.id}"]`).forEach(radio => {
    radio.addEventListener('change', (e) => {
      onFlowerChange(item.id, e.target.value, e.target.dataset.name);
    });
  });

  renumberItemHeaders();
}

/**
 * Məhsul dəyişdikdə
 */
function onProductChange(itemId, productId) {
  const item = orderItems.find(i => i.id === itemId);
  if (!item) return;

  const product = storeData.products.find(p => p.id === productId);
  if (product) {
    item.productId = product.id;
    item.productName = product.name;
    item.price = product.price;
    updateItemRowTotal(item);
    updateOrderSummary();
  }
}

/**
 * Gül rəngi dəyişdikdə
 */
function onFlowerChange(itemId, flowerId, flowerName) {
  const item = orderItems.find(i => i.id === itemId);
  if (!item) return;

  item.flowerId = flowerId;
  item.flowerName = flowerName;
}

/**
 * Fərdi ad mətni dəyişdikdə
 */
function onCustomNameChange(itemId, text) {
  const item = orderItems.find(i => i.id === itemId);
  if (item) {
    item.customName = text;
  }
}

/**
 * Sayı artırıb-azaltmaq
 */
function changeItemQty(itemId, delta) {
  const item = orderItems.find(i => i.id === itemId);
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty >= 1) {
    item.quantity = newQty;
    const card = document.getElementById(`orderItemCard_${itemId}`);
    if (card) {
      card.querySelector('.qty-input').value = newQty;
    }
    updateItemRowTotal(item);
    updateOrderSummary();
  }
}

/**
 * Sətir məbləğini yeniləyir
 */
function updateItemRowTotal(item) {
  const totalEl = document.getElementById(`itemTotal_${item.id}`);
  if (totalEl) {
    totalEl.textContent = `${item.price * item.quantity} AZN`;
  }
}

/**
 * Sifarişdən məhsul silinməsi
 */
function removeOrderItem(itemId) {
  if (orderItems.length <= 1) {
    showToast('Sifarişdə ən azı bir məhsul olmalıdır', 'info');
    return;
  }

  orderItems = orderItems.filter(i => i.id !== itemId);
  const card = document.getElementById(`orderItemCard_${itemId}`);
  if (card) {
    card.remove();
  }

  renumberItemHeaders();
  updateOrderSummary();
  updateRemoveButtonsVisibility();
}

/**
 * Başlıq nömrələrini yenidən nizamlayır (Məhsul 1, Məhsul 2...)
 */
function renumberItemHeaders() {
  const cards = document.querySelectorAll('.order-item-card');
  cards.forEach((card, idx) => {
    const label = card.querySelector('.item-title-label');
    if (label) {
      label.textContent = `Məhsul ${idx + 1}`;
    }
  });
}

/**
 * Yalnız 1 məhsul olanda silmə düyməsini gizlədir
 */
function updateRemoveButtonsVisibility() {
  const removeButtons = document.querySelectorAll('.btn-remove-item');
  removeButtons.forEach(btn => {
    btn.style.display = orderItems.length > 1 ? 'inline-flex' : 'none';
  });
}

/**
 * Çatdırılma üsulu dəyişəndə forma sahələrini açır/bağlayır
 */
function handleDeliveryMethodChange() {
  const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'metro';
  
  const metroBox = document.getElementById('metroLocationGroup');
  const taxiBox = document.getElementById('taxiAddressGroup');
  const cargoBox = document.getElementById('cargoAddressGroup');
  const taxiNotice = document.getElementById('summaryTaxiNotice');

  if (metroBox) metroBox.style.display = selectedMethod === 'metro' ? 'block' : 'none';
  if (taxiBox) taxiBox.style.display = selectedMethod === 'taxi' ? 'block' : 'none';
  if (cargoBox) cargoBox.style.display = selectedMethod === 'cargo' ? 'block' : 'none';
  if (taxiNotice) taxiNotice.style.display = selectedMethod === 'taxi' ? 'block' : 'none';

  updateOrderSummary();
}

/**
 * Yekun qiymət və xülasəni hesablayır
 */
function updateOrderSummary() {
  const itemsCountEl = document.getElementById('summaryItemsCount');
  const itemsSubtotalEl = document.getElementById('summaryItemsSubtotal');
  const deliveryFeeEl = document.getElementById('summaryDeliveryFee');
  const grandTotalEl = document.getElementById('summaryGrandTotal');

  let totalQty = 0;
  let subtotal = 0;

  orderItems.forEach(item => {
    totalQty += item.quantity;
    subtotal += item.price * item.quantity;
  });

  const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'metro';
  let deliveryFee = 0;

  if (selectedMethod === 'cargo') {
    deliveryFee = 4;
  } else {
    deliveryFee = 0;
  }

  const grandTotal = subtotal + deliveryFee;

  if (itemsCountEl) itemsCountEl.textContent = `${totalQty} ədəd`;
  if (itemsSubtotalEl) itemsSubtotalEl.textContent = `${subtotal} AZN`;
  if (deliveryFeeEl) {
    if (selectedMethod === 'metro') {
      deliveryFeeEl.textContent = 'PULSUZ (0 AZN)';
    } else if (selectedMethod === 'taxi') {
      deliveryFeeEl.textContent = 'Kuryerə ödənilir (0 AZN)';
    } else {
      deliveryFeeEl.textContent = '4 AZN';
    }
  }
  if (grandTotalEl) grandTotalEl.textContent = `${grandTotal} AZN`;
}

/**
 * Sifariş formasının yoxlanması və WhatsApp-a göndərilməsi
 */
function handleOrderSubmit(e) {
  e.preventDefault();

  const customerName = document.getElementById('customerName')?.value.trim();
  const customerPhone = document.getElementById('customerPhone')?.value.trim();
  const preferredTime = document.getElementById('preferredTime')?.value.trim();
  const orderNote = document.getElementById('orderNote')?.value.trim();
  const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'metro';

  // Validasiya
  if (!customerName) {
    showToast('Zəhmət olmasa, ad və soyadınızı qeyd edin', 'error');
    document.getElementById('customerName')?.focus();
    return;
  }

  if (!customerPhone || customerPhone.length < 7) {
    showToast('Zəhmət olmasa, əlaqə nömrənizi düzgün daxil edin', 'error');
    document.getElementById('customerPhone')?.focus();
    return;
  }

  // Məhsul yoxlanışı
  for (let i = 0; i < orderItems.length; i++) {
    const item = orderItems[i];
    if (!item.productId) {
      showToast(`${i + 1}-ci məhsul seçilməyib`, 'error');
      return;
    }
    if (!item.flowerId) {
      showToast(`${i + 1}-ci məhsul üçün gül rəngi seçilməyib`, 'error');
      return;
    }
  }

  let deliveryLocation = '';
  let deliveryAddress = '';

  if (selectedMethod === 'metro') {
    const selectMetro = document.getElementById('metroStationSelect');
    deliveryLocation = selectMetro ? selectMetro.value : '';
    if (!deliveryLocation) {
      showToast('Zəhmət olmasa, təhvil üçün metro stansiyasını seçin', 'error');
      return;
    }
  } else if (selectedMethod === 'taxi') {
    const taxiAddrInput = document.getElementById('taxiAddressInput');
    deliveryAddress = taxiAddrInput ? taxiAddrInput.value.trim() : '';
    if (!deliveryAddress) {
      showToast('Zəhmət olmasa, taxi çatdırılması üçün ünvanınızı daxil edin', 'error');
      taxiAddrInput?.focus();
      return;
    }
  } else if (selectedMethod === 'cargo') {
    const cargoAddrInput = document.getElementById('cargoAddressInput');
    deliveryAddress = cargoAddrInput ? cargoAddrInput.value.trim() : '';
    if (!deliveryAddress) {
      showToast('Zəhmət olmasa, karqo çatdırılması üçün rayon və dəqiq ünvanı qeyd edin', 'error');
      cargoAddrInput?.focus();
      return;
    }
  }

  // Sifariş məlumat obyektini formalaşdır
  const orderData = {
    customerName,
    customerPhone,
    preferredTime,
    orderNote,
    deliveryMethod: selectedMethod,
    deliveryLocation,
    deliveryAddress,
    items: orderItems.map(item => ({
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      flowerName: item.flowerName,
      customName: item.customName,
      note: item.note
    }))
  };

  showToast('Sifarişiniz hazırlanır, WhatsApp açılır...', 'success');

  // WhatsApp-a ötür
  setTimeout(() => {
    WhatsAppHelper.openWhatsApp(orderData, storeData);
  }, 400);
}

// Global metodlar HTML daxilindəki inline hadisələr üçün
window.removeOrderItem = removeOrderItem;
window.changeItemQty = changeItemQty;
window.onProductChange = onProductChange;
window.onCustomNameChange = onCustomNameChange;

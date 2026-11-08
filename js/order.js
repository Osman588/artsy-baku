/**
 * Artsy Baku - Çoxməhsullu Sifariş Sistemi (order.js)
 * Düyü dənəsi üzərində adlar: 2 ad daxildir, 3-cü ad üçün +1 AZN əlavə olunur.
 * Terminologiya: "şüşə tüb".
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

  // URL parametrini oxu (?product=sep-a)
  const urlParams = new URLSearchParams(window.location.search);
  const initialProductId = urlParams.get('product');

  // Birinci məhsul blokunu əlavə et
  addNewOrderItem(initialProductId);

  // Başqa məhsul əlavə et düyməsi
  document.getElementById('btnAddProduct').addEventListener('click', () => {
    addNewOrderItem();
  });

  // Çatdırılma radio düymələri
  document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
    radio.addEventListener('change', handleDeliveryMethodChange);
  });

  // Forma təsdiqi
  document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);

  handleDeliveryMethodChange();
  updateOrderSummary();
});

/**
 * Sifarişə yeni məhsul bloku əlavə edir
 */
function addNewOrderItem(preferredProductId = null) {
  itemCounter++;
  const currentId = itemCounter;

  const availableProducts = storeData.products.filter(p => p.available !== false);
  let defaultProduct = availableProducts.find(p => p.id === preferredProductId) || availableProducts[0];
  
  const availableFlowers = storeData.flowers.filter(f => f.available !== false);
  let defaultFlower = availableFlowers[0];

  const newItem = {
    id: currentId,
    productId: defaultProduct ? defaultProduct.id : '',
    productName: defaultProduct ? defaultProduct.name : '',
    basePrice: defaultProduct ? defaultProduct.price : 23,
    unitPrice: defaultProduct ? defaultProduct.price : 23,
    flowerId: defaultFlower ? defaultFlower.id : '',
    flowerName: defaultFlower ? defaultFlower.name : '',
    name1: '',
    name2: '',
    name3: '',
    hasThirdName: false,
    quantity: 1,
    note: ''
  };

  orderItems.push(newItem);
  renderOrderItemHTML(newItem);
  updateOrderSummary();
  updateRemoveButtonsVisibility();
}

/**
 * Sifariş bloku üçün HTML render edir
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
      <label class="form-label">Məhsul modelini seçin <span class="req">*</span></label>
      <select class="form-control select-product" onchange="onProductChange(${item.id}, this.value)">
        ${productOptions}
      </select>
    </div>

    <!-- Canlı gül rəngi -->
    <div class="form-group">
      <label class="form-label">Şüşə tüb daxilindəki canlı gül rəngi <span class="req">*</span> <span class="help-text">(6 rəng)</span></label>
      <div class="color-picker-grid">
        ${flowerOptions}
      </div>
    </div>

    <!-- Düyü dənəsi üzərinə yazılacaq adlar -->
    <div class="form-group" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: var(--radius-sm); padding: 16px;">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
        <label class="form-label" style="margin-bottom: 0;">
          🌾 Düyü dənəsi üzərində yazılacaq adlar <span class="req">*</span>
        </label>
        <span class="badge badge-gold" style="font-size: 0.72rem;">2 ad pulsuz daxildir</span>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px; line-height: 1.45;">
        Adlar xüsusi əl işi sənəti ilə düyü dənəcikləri üzərinə yazılaraq şüşə tüb daxilinə yerləşdirilir. Bir şüşə tübə <strong>2 ad daxildir</strong> (pulsuz). 3-cü ad üçün cəmi <strong>+1 AZN</strong> əlavə olunur.
      </p>

      <!-- 1-ci ad -->
      <div style="margin-bottom: 10px;">
        <label style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 4px; display: block;">
          1-ci düyü dənəsi üzərində ad:
        </label>
        <input type="text" class="form-control" placeholder="Məsələn: Aysel və ya baş hərf" value="${item.name1}" oninput="onNameChange(${item.id}, 1, this.value)">
      </div>

      <!-- 2-ci ad (Daxildir / Pulsuz) -->
      <div style="margin-bottom: 12px;">
        <label style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 4px; display: flex; justify-content: space-between;">
          <span>2-ci düyü dənəsi üzərində ad:</span>
          <span style="color: var(--success); font-size: 0.75rem;">(Pulsuz daxildir)</span>
        </label>
        <input type="text" class="form-control" placeholder="Məsələn: Murad (istəyə bağlı)" value="${item.name2}" oninput="onNameChange(${item.id}, 2, this.value)">
      </div>

      <!-- 3-cü ad bloku (Dinamik +1 AZN) -->
      <div id="thirdNameWrapper_${item.id}" style="${item.hasThirdName ? 'display: block;' : 'display: none;'} margin-bottom: 12px; background: rgba(255, 183, 3, 0.08); border: 1px solid rgba(255, 183, 3, 0.25); border-radius: var(--radius-sm); padding: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <label style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700;">
            3-cü düyü dənəsi üzərində ad (+1 AZN):
          </label>
          <button type="button" onclick="removeThirdName(${item.id})" style="color: #F87171; font-size: 0.75rem; text-decoration: underline;">
            3-cü adı ləğv et
          </button>
        </div>
        <input type="text" id="thirdNameInput_${item.id}" class="form-control" placeholder="Məsələn: Leyla" value="${item.name3}" oninput="onNameChange(${item.id}, 3, this.value)">
      </div>

      <!-- 3-cü ad əlavə et düyməsi -->
      <div id="addThirdNameBtnWrapper_${item.id}" style="${item.hasThirdName ? 'display: none;' : 'display: block;'}">
        <button type="button" onclick="enableThirdName(${item.id})" class="btn btn-secondary btn-sm" style="width: 100%; border-style: dashed; font-size: 0.85rem;">
          <span>+ 3-cü düyü dənəsi adı əlavə et (+1 AZN)</span>
        </button>
      </div>
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
        Vahid: <span id="itemUnit_${item.id}" style="color: var(--text-secondary);">${item.unitPrice} AZN</span> | Məbləğ: <strong id="itemTotal_${item.id}">${item.unitPrice * item.quantity} AZN</strong>
      </div>
    </div>
  `;

  container.appendChild(card);

  // Gül rəngi dinləyicisi
  card.querySelectorAll(`input[name="flower_item_${item.id}"]`).forEach(radio => {
    radio.addEventListener('change', (e) => {
      onFlowerChange(item.id, e.target.value, e.target.dataset.name);
    });
  });

  renumberItemHeaders();
}

/**
 * Ad sahəsi dəyişdikdə
 */
function onNameChange(itemId, nameIndex, value) {
  const item = orderItems.find(i => i.id === itemId);
  if (!item) return;

  if (nameIndex === 1) item.name1 = value.trim();
  if (nameIndex === 2) item.name2 = value.trim();
  if (nameIndex === 3) item.name3 = value.trim();

  recalculateItemPrice(item);
  updateOrderSummary();
}

/**
 * 3-cü adı aktivləşdirmək (+1 AZN)
 */
function enableThirdName(itemId) {
  const item = orderItems.find(i => i.id === itemId);
  if (!item) return;

  item.hasThirdName = true;
  document.getElementById(`thirdNameWrapper_${itemId}`).style.display = 'block';
  document.getElementById(`addThirdNameBtnWrapper_${itemId}`).style.display = 'none';
  document.getElementById(`thirdNameInput_${itemId}`)?.focus();

  recalculateItemPrice(item);
  updateOrderSummary();
}

/**
 * 3-cü adı ləğv etmək
 */
function removeThirdName(itemId) {
  const item = orderItems.find(i => i.id === itemId);
  if (!item) return;

  item.hasThirdName = false;
  item.name3 = '';
  document.getElementById(`thirdNameWrapper_${itemId}`).style.display = 'none';
  document.getElementById(`addThirdNameBtnWrapper_${itemId}`).style.display = 'block';
  const input = document.getElementById(`thirdNameInput_${itemId}`);
  if (input) input.value = '';

  recalculateItemPrice(item);
  updateOrderSummary();
}

/**
 * Vahid qiyməti hesablayır (3-cü ad varsa +1 AZN)
 */
function recalculateItemPrice(item) {
  const extra = (item.hasThirdName && (item.name3 || item.hasThirdName)) ? 1 : 0;
  item.unitPrice = item.basePrice + extra;

  const unitEl = document.getElementById(`itemUnit_${item.id}`);
  const totalEl = document.getElementById(`itemTotal_${item.id}`);

  if (unitEl) unitEl.textContent = `${item.unitPrice} AZN`;
  if (totalEl) totalEl.textContent = `${item.unitPrice * item.quantity} AZN`;
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
    item.basePrice = product.price;
    recalculateItemPrice(item);
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
 * Miqdarı artırıb-azaltmaq
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
    recalculateItemPrice(item);
    updateOrderSummary();
  }
}

/**
 * Məhsulu sifarişdən silmək
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

function renumberItemHeaders() {
  const cards = document.querySelectorAll('.order-item-card');
  cards.forEach((card, idx) => {
    const label = card.querySelector('.item-title-label');
    if (label) {
      label.textContent = `Məhsul ${idx + 1}`;
    }
  });
}

function updateRemoveButtonsVisibility() {
  const removeButtons = document.querySelectorAll('.btn-remove-item');
  removeButtons.forEach(btn => {
    btn.style.display = orderItems.length > 1 ? 'inline-flex' : 'none';
  });
}

/**
 * Çatdırılma üsulu sahələri
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
 * Sifariş xülasəsini yeniləyir
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
    subtotal += item.unitPrice * item.quantity;
  });

  const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'metro';
  const deliveryFee = selectedMethod === 'cargo' ? 4 : 0;
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
 * Sifariş formasını yoxlayıb WhatsApp-a göndərir
 */
function handleOrderSubmit(e) {
  e.preventDefault();

  const customerName = document.getElementById('customerName')?.value.trim();
  const customerPhone = document.getElementById('customerPhone')?.value.trim();
  const preferredTime = document.getElementById('preferredTime')?.value.trim();
  const orderNote = document.getElementById('orderNote')?.value.trim();
  const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'metro';

  if (!customerName) {
    showToast('Zəhmət olmasa, ad və soyadınızı daxil edin', 'error');
    document.getElementById('customerName')?.focus();
    return;
  }

  if (!customerPhone || customerPhone.length < 7) {
    showToast('Zəhmət olmasa, əlaqə nömrənizi düzgün qeyd edin', 'error');
    document.getElementById('customerPhone')?.focus();
    return;
  }

  // Hər məhsul üçün yoxlama
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
    // Düyü dənəsi üzərində ən azı 1 ad olmalıdır
    if (!item.name1) {
      showToast(`${i + 1}-ci məhsul üçün düyü dənəsi üzərinə yazılacaq 1-ci adı qeyd edin`, 'error');
      return;
    }
  }

  let deliveryLocation = '';
  let deliveryAddress = '';

  if (selectedMethod === 'metro') {
    const selectMetro = document.getElementById('metroStationSelect');
    deliveryLocation = selectMetro ? selectMetro.value : '';
  } else if (selectedMethod === 'taxi') {
    const taxiAddrInput = document.getElementById('taxiAddressInput');
    deliveryAddress = taxiAddrInput ? taxiAddrInput.value.trim() : '';
    if (!deliveryAddress) {
      showToast('Zəhmət olmasa, taxi kuryer üçün ünvanınızı qeyd edin', 'error');
      taxiAddrInput?.focus();
      return;
    }
  } else if (selectedMethod === 'cargo') {
    const cargoAddrInput = document.getElementById('cargoAddressInput');
    deliveryAddress = cargoAddrInput ? cargoAddrInput.value.trim() : '';
    if (!deliveryAddress) {
      showToast('Zəhmət olmasa, karqo çatdırılması üçün rayon və ünvanı qeyd edin', 'error');
      cargoAddrInput?.focus();
      return;
    }
  }

  const orderData = {
    customerName,
    customerPhone,
    preferredTime,
    orderNote,
    deliveryMethod: selectedMethod,
    deliveryLocation,
    deliveryAddress,
    items: orderItems.map(item => {
      const activeNames = [];
      if (item.name1) activeNames.push(item.name1);
      if (item.name2) activeNames.push(item.name2);
      if (item.hasThirdName && item.name3) activeNames.push(item.name3);

      return {
        name: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        flowerName: item.flowerName,
        names: activeNames,
        note: item.note
      };
    })
  };

  showToast('Sifarişiniz hazırlanır, WhatsApp açılır...', 'success');

  setTimeout(() => {
    WhatsAppHelper.openWhatsApp(orderData, storeData);
  }, 400);
}

window.removeOrderItem = removeOrderItem;
window.changeItemQty = changeItemQty;
window.onProductChange = onProductChange;
window.onNameChange = onNameChange;
window.enableThirdName = enableThirdName;
window.removeThirdName = removeThirdName;

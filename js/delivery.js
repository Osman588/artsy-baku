/**
 * Artsy Baku - Çatdırılma Səhifəsi (delivery.js)
 * delivery.json konfiqurasiyasından qaydaları və cədvəli dinamik təqdim edir.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const deliveryData = await Config.getDelivery();
  if (!deliveryData) return;

  renderScheduleTable(deliveryData.schedule);
  renderDeliveryMethods(deliveryData.methods);
});

/**
 * Həftəlik çatdırılma cədvəli
 */
function renderScheduleTable(schedule) {
  const tbody = document.getElementById('deliveryScheduleBody');
  if (!tbody || !schedule) return;

  tbody.innerHTML = schedule.map(row => `
    <tr>
      <td><strong>${row.day}</strong></td>
      <td><span class="badge badge-gold">${row.hours}</span></td>
      <td>Bakı vaxtı ilə</td>
    </tr>
  `).join('');
}

/**
 * Çatdırılma üsulları kartları
 */
function renderDeliveryMethods(methods) {
  const container = document.getElementById('deliveryMethodsCards');
  if (!container || !methods) return;

  container.innerHTML = methods.map(method => {
    let iconSvg = '';
    if (method.id === 'metro') {
      iconSvg = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="4" y="3" width="16" height="16" rx="2"/>
          <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M9 15h.01M15 15h.01"/>
        </svg>
      `;
    } else if (method.id === 'taxi') {
      iconSvg = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      `;
    }

    let extraInfo = '';
    if (method.locations) {
      extraInfo = `
        <div style="margin-top: 12px; font-size: 0.85rem; background: var(--bg-primary); padding: 10px; border-radius: var(--radius-sm);">
          <strong>Təhvil məntəqələri:</strong>
          <ul style="margin-top: 6px; padding-left: 18px; list-style-type: disc;">
            ${method.locations.map(loc => `<li>${loc}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (method.notice) {
      extraInfo += `
        <div class="delivery-notice-box" style="margin-top: 12px;">
          ${method.notice}
        </div>
      `;
    }

    return `
      <div class="delivery-method-box">
        <div class="method-icon">${iconSvg}</div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <h3 class="heading-sm">${method.name}</h3>
          <span class="badge ${method.price === 0 ? 'badge-green' : 'badge-gold'}">${method.badge}</span>
        </div>
        <p>${method.description}</p>
        ${extraInfo}
      </div>
    `;
  }).join('');
}

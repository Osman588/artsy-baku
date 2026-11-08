/**
 * Artsy Baku - WhatsApp Mesaj Generatoru və İnteqrasiyası
 * Sifariş məlumatlarını tam və səliqəli Azərbaycan dilində formatlayır
 * və rəsmi wa.me API linki yaradır.
 */

const WhatsAppHelper = {
  /**
   * Sifariş üçün səliqəli mətn hazırlayır
   */
  generateMessage(orderData, store) {
    const lines = [];

    lines.push('🌸 ARTSY BAKU — YENİ SİFARİŞ');
    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━');
    lines.push('👤 MÜŞTƏRİ MƏLUMATLARI:');
    lines.push(`Ad: ${orderData.customerName || 'Göstərilməyib'}`);
    lines.push(`Telefon: ${orderData.customerPhone || 'Göstərilməyib'}`);
    if (orderData.preferredTime) {
      lines.push(`Üstünlük verilən çatdırılma vaxtı: ${orderData.preferredTime}`);
    }

    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━');
    lines.push('🛍️ SİFARİŞ:');
    lines.push('');

    let productsTotal = 0;

    orderData.items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      productsTotal += itemTotal;

      lines.push(`Məhsul ${index + 1}:`);
      lines.push(`Ad: ${item.name}`);
      lines.push(`Gül rəngi: ${item.flowerName}`);
      if (item.customName && item.customName.trim()) {
        lines.push(`Kapsul daxilinə yazılacaq ad: ${item.customName.trim()}`);
      }
      lines.push(`Say: ${item.quantity}`);
      lines.push(`Vahid qiymət: ${item.price} AZN`);
      lines.push(`Məbləğ: ${itemTotal} AZN`);
      if (item.note && item.note.trim()) {
        lines.push(`Məhsul üzrə qeyd: ${item.note.trim()}`);
      }
      lines.push('');
    });

    lines.push('━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`MƏHSULLARIN CƏMİ: ${productsTotal} AZN`);
    lines.push('');

    lines.push('🚚 ÇATDIRILMA:');
    if (orderData.deliveryMethod === 'metro') {
      lines.push('Üsul: Metroda təhvil');
      lines.push(`Təhvil məntəqəsi: ${orderData.deliveryLocation || 'Seçilməyib'}`);
      lines.push('Çatdırılma haqqı: PULSUZ (0 AZN)');
    } else if (orderData.deliveryMethod === 'taxi') {
      lines.push('Üsul: Birbaşa ünvana (Taxi kuryer)');
      lines.push(`Ünvan: ${orderData.deliveryAddress || 'Göstərilməyib'}`);
      lines.push('Çatdırılma haqqı: Kuryerə birbaşa ödənilir (Sayt məbləğinə daxil deyil)');
    } else if (orderData.deliveryMethod === 'cargo') {
      lines.push('Üsul: Azərpoçt / Karqo');
      lines.push(`Rayon / Ünvan: ${orderData.deliveryAddress || 'Göstərilməyib'}`);
      lines.push('Çatdırılma haqqı: 4 AZN');
    }

    const deliveryFee = orderData.deliveryMethod === 'cargo' ? 4 : 0;
    const finalTotal = productsTotal + deliveryFee;

    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`💰 YEKUN MƏBLƏĞ: ${finalTotal} AZN`);
    if (orderData.deliveryMethod === 'taxi') {
      lines.push('(Qeyd: Taxi haqqı müştəri tərəfindən kuryerə birbaşa ödəniləcək)');
    }

    if (orderData.orderNote && orderData.orderNote.trim()) {
      lines.push('');
      lines.push(`📝 Əlavə qeydlər: ${orderData.orderNote.trim()}`);
    }

    lines.push('');
    lines.push('Artsy Baku-ya üstünlük verdiyiniz üçün təşəkkür edirik! ✨');

    return lines.join('\n');
  },

  /**
   * WhatsApp URL-i hazırlayır və müştərini yönləndirir
   */
  openWhatsApp(orderData, store) {
    const rawNumber = (store && store.business && store.business.whatsapp) || '994516138069';
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const message = this.generateMessage(orderData, store);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    
    // Pəncərədə açmaq
    window.open(url, '_blank', 'noopener,noreferrer');
    return url;
  }
};

window.WhatsAppHelper = WhatsAppHelper;

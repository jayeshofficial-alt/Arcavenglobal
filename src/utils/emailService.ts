/**
 * Email & WhatsApp Dispatch Service for Arcaventure Global
 * Dispatches export quotes and inquiries to info@arcavenglobal.com
 * and routes WhatsApp details to +91 9860215449
 */

export const TARGET_INQUIRY_EMAIL = 'info@arcavenglobal.com';
export const TARGET_WHATSAPP_NUMBER = '919860215449';
export const TARGET_WHATSAPP_DISPLAY = '+91 9860215449';

export interface QuickQuotePayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  incoterm: string;
  destinationPort: string;
  message?: string;
}

export interface RfqCartPayload {
  buyerName: string;
  buyerEmail: string;
  buyerCompany: string;
  buyerPhone: string;
  incoterm: string;
  destinationPort: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    packaging?: string;
  }>;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

/**
 * Helper to open WhatsApp URL in a new window/tab safely
 */
export function openWhatsAppDirect(url: string) {
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.warn('Could not auto-open WhatsApp:', err);
  }
}

/**
 * Dispatch Quick Quote to info@arcavenglobal.com & WhatsApp +91 9860215449
 */
export async function sendQuickQuoteEmail(payload: QuickQuotePayload): Promise<{
  success: boolean;
  mailtoUrl: string;
  whatsappUrl: string;
  summaryText: string;
}> {
  const subject = `[EXPORT INQUIRY] ${payload.product} (${payload.quantity}) - ${payload.company || payload.name}`;
  
  const bodyText = `
NEW EXPORT QUOTE & ORDER INQUIRY
===========================================
To: ${TARGET_INQUIRY_EMAIL}
Date: ${new Date().toLocaleString()}

BUYER / IMPORTER DETAILS:
-------------------------------------------
• Full Name: ${payload.name}
• Company / Organization: ${payload.company || 'Not Specified'}
• Corporate Email: ${payload.email}
• Phone / WhatsApp: ${payload.phone}

COMMERCIAL ORDER REQUIREMENTS:
-------------------------------------------
• Commodity / Product: ${payload.product}
• Required Volume / Qty: ${payload.quantity}
• Desired Incoterm: ${payload.incoterm}
• Destination Port of Discharge: ${payload.destinationPort || 'Not Specified'}

SPECIFICATIONS & SPECIAL INSTRUCTIONS:
-------------------------------------------
${payload.message || 'No additional custom packaging instructions provided.'}

===========================================
Source: Arcaventure Global Web Portal (Shop Now / Request Quote)
`.trim();

  const mailtoUrl = `mailto:${TARGET_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  const whatsappMessage = `*NEW EXPORT QUOTE REQUEST - ARCAVENTURE GLOBAL*
----------------------------------------
*Product:* ${payload.product}
*Volume / Quantity:* ${payload.quantity}
*Incoterm:* ${payload.incoterm}
*Destination Port:* ${payload.destinationPort || 'Not specified'}

*Buyer:* ${payload.name}
*Company:* ${payload.company || 'Direct Buyer'}
*Email:* ${payload.email}
*Phone:* ${payload.phone}
${payload.message ? `*Notes:* ${payload.message}` : ''}
----------------------------------------
_Please send proforma invoice to ${payload.email}_`;

  const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  // Send via AJAX to FormSubmit
  try {
    await fetch(`https://formsubmit.co/ajax/${TARGET_INQUIRY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: payload.email,
        _template: 'table',
        _captcha: 'false',
        'Buyer Name': payload.name,
        'Company': payload.company || 'N/A',
        'Buyer Email': payload.email,
        'Phone / WhatsApp': payload.phone,
        'Commodity': payload.product,
        'Volume / Quantity': payload.quantity,
        'Incoterm': payload.incoterm,
        'Destination Port': payload.destinationPort || 'N/A',
        'Notes & Specifications': payload.message || 'N/A',
        'Timestamp': new Date().toISOString()
      })
    });
  } catch (err) {
    console.warn('Network submission notice:', err);
  }

  return {
    success: true,
    mailtoUrl,
    whatsappUrl,
    summaryText: `${payload.product} (${payload.quantity}) for ${payload.name}`
  };
}

/**
 * Dispatch RFQ Cart Basket to info@arcavenglobal.com & WhatsApp +91 9860215449
 */
export async function sendRfqCartEmail(payload: RfqCartPayload): Promise<{
  success: boolean;
  mailtoUrl: string;
  whatsappUrl: string;
  summaryText: string;
}> {
  const subject = `[OFFICIAL RFQ BASKET] ${payload.items.length} Product(s) - ${payload.buyerCompany || payload.buyerName}`;
  
  const productListSummary = payload.items
    .map((item, idx) => `${idx + 1}. ${item.name} | Qty: ${item.quantity} ${item.unit} | Pack: ${item.packaging || 'Export Standard'}`)
    .join('\n');

  const bodyText = `
OFFICIAL EXPORT RFQ BASKET INQUIRY
===========================================
To: ${TARGET_INQUIRY_EMAIL}
Date: ${new Date().toLocaleString()}

BUYER PROFILE:
-------------------------------------------
• Full Name: ${payload.buyerName}
• Company: ${payload.buyerCompany || 'Not Specified'}
• Corporate Email: ${payload.buyerEmail}
• Phone / WhatsApp: ${payload.buyerPhone}

LOGISTICS & DISCHARGE:
-------------------------------------------
• Incoterm: ${payload.incoterm}
• Destination Port: ${payload.destinationPort || 'Not Specified'}

REQUESTED EXPORT COMMODITIES (${payload.items.length}):
-------------------------------------------
${productListSummary}

===========================================
Please issue official proforma invoice and export shipment schedule to ${payload.buyerEmail}.
`.trim();

  const mailtoUrl = `mailto:${TARGET_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  const whatsappMessage = `*OFFICIAL EXPORT RFQ BASKET - ARCAVENTURE GLOBAL*
----------------------------------------
*Buyer:* ${payload.buyerName}
*Company:* ${payload.buyerCompany || 'Importer'}
*Email:* ${payload.buyerEmail}
*Phone:* ${payload.buyerPhone}
*Incoterm:* ${payload.incoterm} (Port: ${payload.destinationPort || 'Pending'})

*Requested Products (${payload.items.length}):*
${productListSummary}
----------------------------------------
_Forwarded to ${TARGET_INQUIRY_EMAIL}_`;

  const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  try {
    await fetch(`https://formsubmit.co/ajax/${TARGET_INQUIRY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: payload.buyerEmail,
        _template: 'table',
        _captcha: 'false',
        'Buyer Name': payload.buyerName,
        'Company': payload.buyerCompany || 'N/A',
        'Email': payload.buyerEmail,
        'Phone': payload.buyerPhone,
        'Incoterm': payload.incoterm,
        'Destination Port': payload.destinationPort || 'N/A',
        'Commodities Requested': productListSummary,
        'Total Product Count': payload.items.length,
        'Timestamp': new Date().toISOString()
      })
    });
  } catch (err) {
    console.warn('Network submission notice:', err);
  }

  return {
    success: true,
    mailtoUrl,
    whatsappUrl,
    summaryText: `${payload.items.length} items for ${payload.buyerName}`
  };
}

/**
 * Dispatch Contact Form Message to info@arcavenglobal.com & WhatsApp +91 9860215449
 */
export async function sendContactMessageEmail(payload: ContactMessagePayload): Promise<{
  success: boolean;
  mailtoUrl: string;
  whatsappUrl: string;
}> {
  const subject = `[TRADE INQUIRY] ${payload.subject} - ${payload.company || payload.name}`;
  
  const bodyText = `
EXPORT INQUIRY & TRADE MESSAGE
===========================================
To: ${TARGET_INQUIRY_EMAIL}
Date: ${new Date().toLocaleString()}

SENDER INFORMATION:
-------------------------------------------
• Name: ${payload.name}
• Email: ${payload.email}
• Phone / WhatsApp: ${payload.phone}
• Company: ${payload.company || 'Not Specified'}
• Subject: ${payload.subject}

MESSAGE DETAILS:
-------------------------------------------
${payload.message}

===========================================
Source: Arcaventure Global Contact Portal
`.trim();

  const mailtoUrl = `mailto:${TARGET_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  const whatsappMessage = `*TRADE INQUIRY - ARCAVENTURE GLOBAL*
----------------------------------------
*From:* ${payload.name} (${payload.company || 'Direct Contact'})
*Email:* ${payload.email}
*Phone:* ${payload.phone}
*Subject:* ${payload.subject}

*Message:*
${payload.message}
----------------------------------------
_Please reply to ${payload.email}_`;

  const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  try {
    await fetch(`https://formsubmit.co/ajax/${TARGET_INQUIRY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: payload.email,
        _template: 'table',
        _captcha: 'false',
        'Sender Name': payload.name,
        'Email': payload.email,
        'Phone': payload.phone,
        'Company': payload.company || 'N/A',
        'Subject': payload.subject,
        'Message': payload.message,
        'Timestamp': new Date().toISOString()
      })
    });
  } catch (err) {
    console.warn('Network submission notice:', err);
  }

  return {
    success: true,
    mailtoUrl,
    whatsappUrl
  };
}

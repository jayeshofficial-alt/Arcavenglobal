/**
 * Email Dispatch Service for Arcaventure Global
 * Dispatches export quotes and inquiries to info@archavenglobal.com
 */

export const TARGET_INQUIRY_EMAIL = 'info@archavenglobal.com';

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
 * Dispatch Quick Quote to info@archavenglobal.com
 */
export async function sendQuickQuoteEmail(payload: QuickQuotePayload): Promise<{ success: boolean; message?: string; mailtoUrl: string; whatsappUrl: string }> {
  const subject = `[EXPORT QUOTE REQUEST] ${payload.product} - ${payload.company || payload.name}`;
  
  const bodyText = `
NEW EXPORT QUOTE REQUEST (Via Arcaventure Global Portal)
-------------------------------------------------------
Recipient: ${TARGET_INQUIRY_EMAIL}
Date/Time: ${new Date().toLocaleString()}

BUYER PROFILE:
- Name: ${payload.name}
- Company: ${payload.company || 'Not Specified'}
- Corporate Email: ${payload.email}
- WhatsApp / Phone: ${payload.phone}

COMMERCIAL ORDER SPECIFICATIONS:
- Product Required: ${payload.product}
- Estimated Volume: ${payload.quantity}
- Pricing Basis / Incoterm: ${payload.incoterm}
- Destination Port: ${payload.destinationPort || 'Not Specified'}

ADDITIONAL SPECIFICATIONS / PACKAGING NOTES:
${payload.message || 'No additional notes provided.'}

-------------------------------------------------------
This inquiry was submitted from the official Arcaventure Global web portal.
`.trim();

  const mailtoUrl = `mailto:${TARGET_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  const whatsappUrl = `https://wa.me/919860215449?text=${encodeURIComponent(`*New Quote Inquiry for ${payload.product}*\nName: ${payload.name}\nCompany: ${payload.company}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nVolume: ${payload.quantity}\nIncoterm: ${payload.incoterm} (${payload.destinationPort})\nNotes: ${payload.message || 'N/A'}`)}`;

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_INQUIRY_EMAIL}`, {
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
        'Product Requested': payload.product,
        'Order Quantity': payload.quantity,
        'Incoterm': payload.incoterm,
        'Destination Port': payload.destinationPort || 'N/A',
        'Packaging & Specs Notes': payload.message || 'N/A',
        'Portal Source': 'Quick Quote / Shop Now Form'
      })
    });

    if (response.ok) {
      return { success: true, mailtoUrl, whatsappUrl };
    }
  } catch (err) {
    console.warn('FormSubmit network dispatch error, fallback prepared:', err);
  }

  return { success: true, mailtoUrl, whatsappUrl };
}

/**
 * Dispatch RFQ Cart Basket to info@archavenglobal.com
 */
export async function sendRfqCartEmail(payload: RfqCartPayload): Promise<{ success: boolean; message?: string; mailtoUrl: string; whatsappUrl: string }> {
  const subject = `[OFFICIAL EXPORT RFQ] ${payload.items.length} Product(s) - ${payload.buyerCompany || payload.buyerName}`;
  
  const productListSummary = payload.items
    .map((item, idx) => `${idx + 1}. ${item.name} | Qty: ${item.quantity} ${item.unit} | Pack: ${item.packaging || 'Standard Export'}`)
    .join('\n');

  const bodyText = `
OFFICIAL EXPORT RFQ BASKET INQUIRY
-------------------------------------------------------
Recipient: ${TARGET_INQUIRY_EMAIL}
Date/Time: ${new Date().toLocaleString()}

BUYER PROFILE:
- Full Name: ${payload.buyerName}
- Company: ${payload.buyerCompany || 'Not Specified'}
- Corporate Email: ${payload.buyerEmail}
- WhatsApp / Phone: ${payload.buyerPhone}

TRADE LOGISTICS:
- Incoterm: ${payload.incoterm}
- Destination Port: ${payload.destinationPort || 'Not Specified'}

REQUESTED EXPORT PRODUCTS (${payload.items.length}):
${productListSummary}

-------------------------------------------------------
Please issue proforma invoice and export schedule to ${payload.buyerEmail}.
`.trim();

  const mailtoUrl = `mailto:${TARGET_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  const whatsappUrl = `https://wa.me/919860215449?text=${encodeURIComponent(`*Export RFQ Basket from ${payload.buyerName} (${payload.buyerCompany})*\nEmail: ${payload.buyerEmail}\nPhone: ${payload.buyerPhone}\nIncoterm: ${payload.incoterm} - Port: ${payload.destinationPort}\n\n*Products:*\n${productListSummary}`)}`;

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_INQUIRY_EMAIL}`, {
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
        'Phone / WhatsApp': payload.buyerPhone,
        'Incoterm': payload.incoterm,
        'Destination Port': payload.destinationPort || 'N/A',
        'Products List': productListSummary,
        'Portal Source': 'RFQ Basket Drawer'
      })
    });

    if (response.ok) {
      return { success: true, mailtoUrl, whatsappUrl };
    }
  } catch (err) {
    console.warn('FormSubmit network dispatch error, fallback prepared:', err);
  }

  return { success: true, mailtoUrl, whatsappUrl };
}

/**
 * Dispatch Contact Form Message to info@archavenglobal.com
 */
export async function sendContactMessageEmail(payload: ContactMessagePayload): Promise<{ success: boolean; message?: string; mailtoUrl: string; whatsappUrl: string }> {
  const subject = `[TRADE INQUIRY] ${payload.subject} - ${payload.company || payload.name}`;
  
  const bodyText = `
NEW EXPORT INQUIRY MESSAGE
-------------------------------------------------------
Recipient: ${TARGET_INQUIRY_EMAIL}
Date/Time: ${new Date().toLocaleString()}

SENDER DETAILS:
- Full Name: ${payload.name}
- Email: ${payload.email}
- Phone / WhatsApp: ${payload.phone}
- Company: ${payload.company || 'Not Specified'}
- Subject: ${payload.subject}

MESSAGE CONTENT:
${payload.message}
-------------------------------------------------------
`.trim();

  const mailtoUrl = `mailto:${TARGET_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  const whatsappUrl = `https://wa.me/919860215449?text=${encodeURIComponent(`*Trade Inquiry: ${payload.subject}*\nFrom: ${payload.name} (${payload.company || 'N/A'})\nEmail: ${payload.email}\nPhone: ${payload.phone}\nMessage: ${payload.message}`)}`;

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_INQUIRY_EMAIL}`, {
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
        'Portal Source': 'Contact Us Section'
      })
    });

    if (response.ok) {
      return { success: true, mailtoUrl, whatsappUrl };
    }
  } catch (err) {
    console.warn('FormSubmit network dispatch error, fallback prepared:', err);
  }

  return { success: true, mailtoUrl, whatsappUrl };
}

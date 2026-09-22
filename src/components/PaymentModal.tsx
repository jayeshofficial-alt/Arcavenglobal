import React, { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Copy, 
  X, 
  ArrowRight,
  RefreshCw,
  Smartphone,
  Receipt,
  ExternalLink,
  Check,
  Building,
  ShieldAlert
} from 'lucide-react';
import { OrderRecord, PaymentMethod, BankingSettings } from '../types';
import { getStoredBankingSettings, recordOrderPayment } from '../utils/storage';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord | null;
  onPaymentSuccess: (updatedOrder: OrderRecord) => void;
  bankingSettings?: BankingSettings;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
  bankingSettings: propBankingSettings
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<{
    reference: string;
    method: PaymentMethod;
    timestamp: string;
  } | null>(null);

  // Copy state feedbacks
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  // Credit/Debit form
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Net banking
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // UPI VPA input
  const [vpa, setVpa] = useState('');
  const [isVpaVerified, setIsVpaVerified] = useState(false);

  if (!isOpen || !order) return null;

  // Resolve active banking settings (from props or local storage)
  const activeBanking = propBankingSettings || getStoredBankingSettings();

  // Compliance / Maintenance Kill-Switch Interceptor
  if (activeBanking.isGatewayActive === false) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/85 backdrop-blur-md animate-fadeIn font-body">
        <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 leading-snug">
                  Commercial Transaction Portal
                </h3>
                <span className="text-xs text-amber-700 font-mono font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Statutory Compliance & Maintenance Mode
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Close Notice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-amber-900">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Official Corporate Notice</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-body">
              {activeBanking.suspensionNotice || "Corporate Notice: Our transactional portal is currently undergoing scheduled platform maintenance while Arca Ventures Global completes statutory legal compliance and international import documentation. Commercial onboarding will resume shortly. For priority inquiries, please contact our administrative desk directly."}
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-heading uppercase text-[10px] tracking-wider">Consignment Reference:</span>
              <strong className="font-mono text-slate-900 font-bold">#{order.orderNumber}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-heading uppercase text-[10px] tracking-wider">Consignee Importer:</span>
              <span className="font-semibold text-slate-800">{order.customerName} ({order.company || 'Consignee'})</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-heading uppercase text-[10px] tracking-wider">Administrative Desk:</span>
              <span className="font-mono text-slate-800 font-medium">contact@arcavenglobal.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-heading uppercase text-[10px] tracking-wider">Root Governance:</span>
              <span className="font-mono text-slate-800 font-medium">jayeshofficial.com</span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 bg-[#0B192C] hover:bg-slate-900 text-amber-400 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Return to Consignment Desk
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = order.totalEstimatedValue || 15000;
  const inrEquivalent = Math.round(totalAmount * 84);

  // Dynamic UPI Intent URL based on current admin settings
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(activeBanking.upiId)}&pn=${encodeURIComponent(activeBanking.accountHolderName)}&am=${inrEquivalent}&cu=INR&tn=${encodeURIComponent(`Order ${order.orderNumber}`)}`;

  // Dynamic QR Code URL generated for this exact order & active UPI ID
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiIntentUrl)}`;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleCopy = (text: string, type: 'upi' | 'acc' | 'ifsc') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'upi') {
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2000);
      } else if (type === 'acc') {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2000);
      } else {
        setCopiedIfsc(true);
        setTimeout(() => setCopiedIfsc(false), 2000);
      }
    });
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      let ref = '';
      if (selectedMethod === 'UPI') {
        ref = `UPI-UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      } else if (selectedMethod === 'Credit Card') {
        ref = `TXN-CC-${Math.floor(100000 + Math.random() * 900000)}`;
      } else if (selectedMethod === 'Debit Card') {
        ref = `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`;
      } else {
        ref = `TXN-NB-${Math.floor(100000 + Math.random() * 900000)}`;
      }

      const txnData = {
        reference: ref,
        method: selectedMethod,
        timestamp: new Date().toISOString()
      };

      setCompletedTxn(txnData);

      // Record in storage and trigger notification callback
      try {
        const updated = recordOrderPayment(order.id, selectedMethod, ref);
        onPaymentSuccess(updated);
      } catch (err) {
        console.error('Failed to record payment in storage:', err);
      }

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B192C]/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="payment-checkout-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden font-body text-slate-800 max-h-[92vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="bg-[#0B192C] text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-white">
                  Commercial Invoice Checkout
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {order.orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official payment receiver: <strong className="text-slate-200">{activeBanking.accountHolderName}</strong> ({activeBanking.upiId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-grow bg-slate-50">
          {completedTxn ? (
            /* Success Receipt Screen */
            <div className="space-y-5 text-center py-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-emerald-700 block">
                  Payment Processed Successfully
                </span>
                <h2 className="font-heading text-2xl font-bold text-slate-900 mt-1">
                  Settlement Confirmed
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Transaction reference has been generated and automatically recorded to the Super Admin Command Center queue for verification and dispatch scheduling.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="max-w-md mx-auto bg-slate-50 rounded-xl border border-slate-200 p-4 text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Commercial Order:</span>
                  <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-semibold text-slate-800">{activeBanking.accountHolderName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Settlement Method:</span>
                  <span className="font-semibold text-slate-800">{completedTxn.method}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Amount Settled:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    ${totalAmount.toLocaleString()} USD (~₹{inrEquivalent.toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Transaction Reference ID:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm select-all">{completedTxn.reference}</span>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(completedTxn.reference)}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                    title="Copy Reference"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0B192C] hover:bg-slate-900 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Main Checkout Flow */
            <div className="space-y-5">
              {/* Order Summary Ribbon */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
                    Total Proforma Valuation
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-2xl font-bold text-slate-900">
                      ${totalAmount.toLocaleString()} <span className="text-xs text-slate-500 font-normal">USD</span>
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ~₹{inrEquivalent.toLocaleString()} INR
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-500 block text-[11px]">Consignee: {order.customerName}</span>
                  <span className="text-slate-400 text-[10px] block font-mono">Port: {order.destinationPort || 'Standard Dispatch'}</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 font-heading uppercase tracking-wider">
                  Select Settlement Method
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'UPI'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className={`w-5 h-5 mb-1 ${selectedMethod === 'UPI' ? 'text-amber-600' : 'text-slate-500'}`} />
                    <span className="font-heading text-xs font-bold text-slate-900 block">
                      UPI QR & VPA
                    </span>
                    <span className="text-[10px] text-amber-700 font-mono">Instant QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Credit Card')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'Credit Card'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 mb-1 ${selectedMethod === 'Credit Card' ? 'text-amber-600' : 'text-slate-500'}`} />
                    <span className="font-heading text-xs font-bold text-slate-900 block">
                      Credit Card
                    </span>
                    <span className="text-[10px] text-slate-400">Visa/Mastercard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Debit Card')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'Debit Card'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 mb-1 ${selectedMethod === 'Debit Card' ? 'text-amber-600' : 'text-slate-500'}`} />
                    <span className="font-heading text-xs font-bold text-slate-900 block">
                      Debit Card
                    </span>
                    <span className="text-[10px] text-slate-400">RuPay/All Banks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Net Banking')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'Net Banking'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mb-1 ${selectedMethod === 'Net Banking' ? 'text-amber-600' : 'text-slate-500'}`} />
                    <span className="font-heading text-xs font-bold text-slate-900 block">
                      Net Banking
                    </span>
                    <span className="text-[10px] text-slate-400">Direct Wire/RTGS</span>
                  </button>
                </div>
              </div>

              {/* Form Content by Method */}
              <form onSubmit={handleProcessPayment} className="space-y-4">
                
                {/* 1. UPI QR & VPA (Dynamic according to admin settings) */}
                {selectedMethod === 'UPI' && (
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      
                      {/* Live Generated QR Code Box */}
                      <div className="p-3 bg-white rounded-xl border-2 border-slate-300 shadow-md flex flex-col items-center flex-shrink-0">
                        <div className="w-40 h-40 bg-white p-1 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <img 
                            src={qrCodeImageUrl} 
                            alt={`UPI QR Code for ${activeBanking.upiId}`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // If network image fails, fallback to inline SVG visual QR
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono mt-1.5 flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-emerald-600" />
                          <span>Scan with GPay / PhonePe / Paytm</span>
                        </span>
                      </div>

                      {/* Dynamic Receiver Info & Intent Controls */}
                      <div className="space-y-3.5 flex-grow text-xs w-full">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 block">
                            Configured Payout Receiver
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-bold text-slate-900 text-sm">
                              {activeBanking.accountHolderName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                              Verified Merchant
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="font-mono text-xs text-amber-700 font-bold">
                              UPI ID: {activeBanking.upiId}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(activeBanking.upiId, 'upi')}
                              className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Direct Mobile UPI Intent Link Button */}
                        <a
                          href={upiIntentUrl}
                          className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-heading text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Open UPI App Directly (₹{inrEquivalent.toLocaleString()})</span>
                        </a>

                        {/* Customer VPA Input */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1 font-heading uppercase">
                            Or Enter Your Personal UPI ID
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={vpa}
                              onChange={(e) => {
                                setVpa(e.target.value);
                                setIsVpaVerified(false);
                              }}
                              placeholder="e.g. buyer@oksbi or company@icici"
                              className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0B192C]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (vpa.includes('@')) {
                                  setIsVpaVerified(true);
                                }
                              }}
                              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              {isVpaVerified ? 'Verified ✓' : 'Verify'}
                            </button>
                          </div>
                          {isVpaVerified && (
                            <p className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>VPA verified for payment request dispatch</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Credit Card or Debit Card */}
                {(selectedMethod === 'Credit Card' || selectedMethod === 'Debit Card') && (
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                        Cardholder Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g. John Doe / Corporate Finance Ltd"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0B192C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                        Card Number (Visa / Mastercard / Amex / RuPay)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4532 •••• •••• 8912"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0B192C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0B192C]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0B192C]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Net Banking & Direct Wire */}
                {selectedMethod === 'Net Banking' && (
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-xs">
                    {/* Bank Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                        Select Institutional Banking Portal
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0B192C]"
                      >
                        <option value="State Bank of India">State Bank of India (SBI Global Trade)</option>
                        <option value="HDFC Bank">HDFC Bank (Corporate NetBanking)</option>
                        <option value="ICICI Bank">ICICI Bank Commercial</option>
                        <option value="Axis Bank">Axis Bank Forex & Trade</option>
                        <option value="HSBC Global">HSBC Commercial Banking</option>
                        <option value="Emirates NBD">Emirates NBD (Dubai Trade Gateway)</option>
                        <option value="Barclays">Barclays Corporate</option>
                        <option value="Standard Chartered">Standard Chartered Trade Portal</option>
                      </select>
                    </div>

                    {/* Official Beneficiary Bank Details Card */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <span className="font-heading font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-amber-500" />
                          <span>Official Corporate Beneficiary Account</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{activeBanking.bankName}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Account Holder:</span>
                          <strong className="text-slate-800">{activeBanking.accountHolderName}</strong>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px]">Bank & Branch:</span>
                          <span className="text-slate-700">{activeBanking.bankName}, {activeBanking.branchName || 'Corporate Trade Branch'}</span>
                        </div>

                        <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Account Number:</span>
                            <span className="font-mono font-bold text-slate-900">{activeBanking.accountNumber}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(activeBanking.accountNumber, 'acc')}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                            title="Copy Account Number"
                          >
                            {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                          <div>
                            <span className="text-slate-400 block text-[10px]">IFSC / NEFT Code:</span>
                            <span className="font-mono font-bold text-slate-900">{activeBanking.ifscCode}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(activeBanking.ifscCode, 'ifsc')}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                            title="Copy IFSC Code"
                          >
                            {copiedIfsc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {activeBanking.swiftBic && (
                        <div className="text-[10px] text-slate-500 font-mono pt-1">
                          SWIFT / BIC (International Wire): <strong>{activeBanking.swiftBic}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-[#0B192C] hover:bg-slate-900 text-amber-400 font-heading text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/20 disabled:opacity-70 mt-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Transacting with Bank Clearing Node...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Authorize Payment (${totalAmount.toLocaleString()} USD)</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Encrypted Trade Settlement • Real-Time Callback to Super Admin</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

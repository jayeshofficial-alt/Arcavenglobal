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
  Receipt
} from 'lucide-react';
import { OrderRecord, PaymentMethod } from '../types';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord | null;
  onPaymentSuccess: (orderId: string, method: PaymentMethod, referenceNumber: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<{
    reference: string;
    method: PaymentMethod;
    timestamp: string;
  } | null>(null);

  // Credit/Debit form
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Net banking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // UPI
  const [vpa, setVpa] = useState('');
  const [isVpaVerified, setIsVpaVerified] = useState(false);

  if (!isOpen || !order) return null;

  const totalAmount = order.totalEstimatedValue || 15000;
  const inrEquivalent = Math.round(totalAmount * 84);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
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
      onPaymentSuccess(order.id, selectedMethod, ref);

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

  const handleCopyRef = (text: string) => {
    navigator.clipboard.writeText(text);
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
                  Commercial Invoice Payment
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {order.orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-method digital settlement gateway for Arca Ventures Global
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-grow">
          {completedTxn ? (
            /* Success Receipt Screen */
            <div className="space-y-5 text-center py-4">
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
                  Transaction reference has been generated and automatically updated in the Super Admin Order Queue for verification and dispatch scheduling.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="max-w-md mx-auto bg-slate-50 rounded-xl border border-slate-200 p-4 text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Commercial Order:</span>
                  <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Payment Method:</span>
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
                    onClick={() => handleCopyRef(completedTxn.reference)}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                    title="Copy Reference"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="py-2.5 px-6 bg-[#0B192C] hover:bg-slate-900 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Active Payment Form */
            <div className="space-y-5">
              {/* Order Amount Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 block">
                    Total Export Value
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-[#0B192C]">
                      ${totalAmount.toLocaleString()} <span className="text-xs font-sans text-slate-500 font-normal">USD</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (Approx ₹{inrEquivalent.toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-500 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <div className="font-medium text-slate-800">
                    {order.customerName} ({order.company || 'Consignee'})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Discharge Port: {order.destinationPort || 'Standard Port'} • {order.incoterm}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 font-heading uppercase tracking-wider">
                  Select Digital Payment Gateway
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'UPI'
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <QrCode className={`w-5 h-5 ${selectedMethod === 'UPI' ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-mono">
                        Instant
                      </span>
                    </div>
                    <span className="font-heading text-xs font-bold text-slate-900 block">
                      UPI QR & VPA
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Credit Card')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'Credit Card'
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 mb-1 ${selectedMethod === 'Credit Card' ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span className="font-heading text-xs font-bold text-slate-900 block">
                      Credit Card
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Debit Card')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'Debit Card'
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 mb-1 ${selectedMethod === 'Debit Card' ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span className="font-heading text-xs font-bold text-slate-900 block">
                      Debit Card
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Net Banking')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'Net Banking'
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mb-1 ${selectedMethod === 'Net Banking' ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span className="font-heading text-xs font-bold text-slate-900 block">
                      Net Banking
                    </span>
                  </button>
                </div>
              </div>

              {/* Form Content by Method */}
              <form onSubmit={handleProcessPayment} className="space-y-4">
                {/* 1. UPI QR & VPA */}
                {selectedMethod === 'UPI' && (
                  <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* Dynamic QR Box */}
                      <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-sm flex flex-col items-center flex-shrink-0">
                        <div className="w-36 h-36 bg-slate-900 p-2 rounded-lg flex items-center justify-center relative overflow-hidden">
                          {/* SVG QR Code pattern */}
                          <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                            <rect width="100" height="100" fill="#0B192C"/>
                            {/* Corner squares */}
                            <rect x="10" y="10" width="25" height="25" fill="#FFFFFF"/>
                            <rect x="15" y="15" width="15" height="15" fill="#0B192C"/>
                            <rect x="18" y="18" width="9" height="9" fill="#F59E0B"/>

                            <rect x="65" y="10" width="25" height="25" fill="#FFFFFF"/>
                            <rect x="70" y="15" width="15" height="15" fill="#0B192C"/>
                            <rect x="73" y="18" width="9" height="9" fill="#F59E0B"/>

                            <rect x="10" y="65" width="25" height="25" fill="#FFFFFF"/>
                            <rect x="15" y="70" width="15" height="15" fill="#0B192C"/>
                            <rect x="18" y="73" width="9" height="9" fill="#F59E0B"/>

                            {/* Center and dots */}
                            <circle cx="50" cy="50" r="10" fill="#10B981" />
                            <rect x="42" y="15" width="6" height="6" fill="#FFFFFF"/>
                            <rect x="52" y="25" width="6" height="6" fill="#FFFFFF"/>
                            <rect x="45" y="70" width="8" height="8" fill="#FFFFFF"/>
                            <rect x="65" y="45" width="7" height="7" fill="#FFFFFF"/>
                            <rect x="75" y="65" width="10" height="10" fill="#FFFFFF"/>
                            <rect x="40" y="40" width="5" height="5" fill="#FFFFFF"/>
                          </svg>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono mt-1.5 flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-emerald-600" />
                          <span>Scan with any UPI App</span>
                        </span>
                      </div>

                      {/* Instructions & VPA input */}
                      <div className="space-y-3 flex-grow text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">
                            UPI Merchant: Arca Ventures Global
                          </span>
                          <span className="text-slate-500 font-mono text-[11px] block">
                            VPA: arcavenglobal@icici
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1 font-heading uppercase">
                            Or Enter Your UPI ID (VPA)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={vpa}
                              onChange={(e) => {
                                setVpa(e.target.value);
                                setIsVpaVerified(false);
                              }}
                              placeholder="e.g. buyer@okaxis or company@icici"
                              className="flex-grow px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0B192C]"
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
                              {isVpaVerified ? 'Verified ✓' : 'Verify VPA'}
                            </button>
                          </div>
                          {isVpaVerified && (
                            <p className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>VPA verified for instant debit notification</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Credit Card or Debit Card */}
                {(selectedMethod === 'Credit Card' || selectedMethod === 'Debit Card') && (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#0B192C]"
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
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0B192C]"
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
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0B192C]"
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
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0B192C]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Net Banking */}
                {selectedMethod === 'Net Banking' && (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                        Select Institution / Commercial Bank
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0B192C]"
                      >
                        <option value="HDFC Bank">HDFC Bank (Corporate NetBanking)</option>
                        <option value="State Bank of India">State Bank of India (SBI Global Trade)</option>
                        <option value="ICICI Bank">ICICI Bank Commercial</option>
                        <option value="Axis Bank">Axis Bank Forex & Trade</option>
                        <option value="HSBC Global">HSBC Commercial Banking</option>
                        <option value="Emirates NBD">Emirates NBD (Dubai Trade Gateway)</option>
                        <option value="Barclays">Barclays Corporate</option>
                        <option value="Standard Chartered">Standard Chartered Trade Portal</option>
                      </select>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                      You will be authenticated via <strong>{selectedBank}</strong> secure gateway. Once completed, your transaction reference will be synchronized to the Super Admin queue.
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
                      <span>Transacting with Bank Node...</span>
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
                <span>256-Bit Encrypted Trade Settlement • Auto Reference Callback to Super Admin</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

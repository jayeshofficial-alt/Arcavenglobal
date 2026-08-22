import React, { useState } from 'react';
import { ProductItem } from '../types';
import { X, Check, ShieldCheck, Anchor, Package, Calendar, Award, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem, customQty?: number, unit?: any, packaging?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [selectedPackaging, setSelectedPackaging] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<'MT' | 'Containers (20ft)' | 'Containers (40ft)' | 'Sample Box (5kg)'>('Containers (40ft)');
  const [sampleSuccess, setSampleSuccess] = useState(false);

  if (!product) return null;

  const handleAddAndClose = () => {
    onAddToCart(product, quantity, unit, selectedPackaging || product.packagingOptions[0]);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
    setSampleSuccess(true);
    setTimeout(() => {
      setSampleSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="product-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-body"
      onClick={onClose}
    >
      <div
        id="product-modal-container"
        className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="product-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Product Photo & Fast Highlights */}
          <div className="md:col-span-5 relative bg-gray-900 overflow-hidden flex flex-col justify-between">
            <div className="relative h-72 md:h-96">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded bg-[#001233]/90 text-[#FF8C00] text-xs font-heading font-bold uppercase tracking-wider border border-white/10">
                  {product.categoryLabel}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[11px] font-heading uppercase tracking-wider text-gray-300">Origin / Agro Zone</div>
                <div className="text-sm font-heading font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span>📍</span>
                  <span>{product.origin}</span>
                </div>
              </div>
            </div>

            {/* Highlights List */}
            <div className="p-5 bg-[#001233] text-white border-t border-white/10 space-y-2">
              <h4 className="text-[11px] font-heading font-bold uppercase tracking-widest text-[#FF8C00] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Export Quality Highlights</span>
              </h4>
              <ul className="space-y-1 text-xs text-gray-300">
                {product.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2D5A27] flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Full Technical Specifications & RFQ Configuration */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#001233] leading-snug">
                  {product.name}
                </h2>
                {product.scientificName && (
                  <p className="text-xs italic text-gray-500 mt-0.5">
                    Botanical: {product.scientificName}
                  </p>
                )}
              </div>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-body">
                {product.fullDescription}
              </p>

              {/* Technical Specifications Table */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[11px] font-heading font-bold uppercase tracking-widest text-gray-400">
                  Export Parameters & Specifications
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Moisture Content</span>
                    <span className="font-heading font-bold text-[#001233]">{product.moistureContent}</span>
                  </div>

                  <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Purity / Sortex</span>
                    <span className="font-heading font-bold text-[#001233]">{product.purity}</span>
                  </div>

                  <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 block text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#2D5A27]" /> Shelf Life
                    </span>
                    <span className="font-heading font-bold text-[#001233]">{product.shelfLife}</span>
                  </div>

                  <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 block text-[11px] flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#FF8C00]" /> Grade Standard
                    </span>
                    <span className="font-heading font-bold text-[#001233]">{product.grade}</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-emerald-50 border border-[#2D5A27]/20 text-xs text-[#2D5A27] space-y-1">
                  <div className="flex items-center gap-1.5 font-heading font-bold">
                    <Anchor className="w-3.5 h-3.5" />
                    <span>Loading Capacity & Sea Freight:</span>
                  </div>
                  <p className="text-gray-700">{product.loadAbility}</p>
                  <p className="text-[11px] text-gray-500 font-medium">
                    <strong>Ports:</strong> {product.exportPorts.join(', ')}
                  </p>
                </div>
              </div>

              {/* Packaging Options */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-heading font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#FF8C00]" />
                  <span>Select Packaging Style</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.packagingOptions.map((pkg, idx) => {
                    const isSelected = (selectedPackaging || product.packagingOptions[0]) === pkg;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPackaging(pkg)}
                        className={`px-3 py-1 rounded text-xs font-heading font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#001233] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pkg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Certifications Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {product.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-medium"
                  >
                    <ShieldCheck className="w-3 h-3 text-[#2D5A27]" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Button */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-700 hover:bg-gray-200 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-heading font-bold text-[#001233] min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-700 hover:bg-gray-200 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="px-3 py-2 text-xs font-semibold rounded border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-[#FF8C00]"
                >
                  <option value="Containers (40ft)">40ft Container (FCL)</option>
                  <option value="Containers (20ft)">20ft Container (FCL)</option>
                  <option value="MT">Metric Tons (MT)</option>
                  <option value="Sample Box (5kg)">Sample Box (5kg Air Courier)</option>
                </select>
              </div>

              <button
                id="modal-add-to-rfq-btn"
                type="button"
                onClick={handleAddAndClose}
                className="w-full sm:flex-1 py-2.5 px-5 rounded-full bg-[#FF8C00] hover:bg-[#e67e00] text-white font-heading font-bold text-xs uppercase tracking-widest orange-glow transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                {sampleSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>ADDED TO QUOTE BASKET</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ADD TO EXPORT INQUIRY</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

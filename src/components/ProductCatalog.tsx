import React, { useState, useMemo } from 'react';
import { ProductItem, ProductCategory, RfqItem } from '../types';
import { PRODUCTS } from '../data/productsData';
import { Search, ArrowUpRight, Plus, Check, ShieldCheck, MapPin, Scale } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  cartItems: RfqItem[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onAddToCart,
  cartItems
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ProductCategory; label: string; icon: string; count: number }[] = [
    { id: 'all', label: 'All Products', icon: '🌐', count: PRODUCTS.length },
    { id: 'vegetables-fruits', label: 'Produce', icon: '🥥', count: PRODUCTS.filter(p => p.category === 'vegetables-fruits').length },
    { id: 'grains-pulses', label: 'Grains', icon: '🌾', count: PRODUCTS.filter(p => p.category === 'grains-pulses').length },
    { id: 'specialty-spices', label: 'Spices', icon: '🌶️', count: PRODUCTS.filter(p => p.category === 'specialty-spices').length },
    { id: 'coconut-products', label: 'Coconut By-Products', icon: '🌴', count: PRODUCTS.filter(p => p.category === 'coconut-products').length },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.product.id === productId);
  };

  return (
    <section id="products" className="py-20 lg:py-24 bg-[#FAFCFB] border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Section Heading (Editorial) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#2D5A27] font-heading font-semibold tracking-widest text-xs uppercase mb-3 block">
            Direct From Indian Agrarian Hubs
          </span>
          
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#001233] tracking-tight">
            Curated <span className="text-[#2D5A27] italic font-serif">Organic</span> Product Portfolio
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-body max-w-2xl mx-auto">
            Certified organic fresh vegetables, royal basmati grains, aromatic Indian spices, and high-yield coconut products graded to international phytosanitary standards.
          </p>
          <div className="w-12 h-1 bg-[#FF8C00] mx-auto mt-4 rounded-full" />
        </div>

        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`category-tab-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#001233] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-[#FF8C00] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="product-search-input"
              type="text"
              placeholder="Search products or origin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-body text-[#001233] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300 max-w-md mx-auto">
            <p className="text-gray-500 font-body text-sm">No products match your search or filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-heading font-bold uppercase text-[#FF8C00] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => {
              const added = isInCart(product.id);

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="group bg-white rounded-lg overflow-hidden border border-gray-100 card-hover-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area */}
                    <div
                      className="relative h-56 overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => onSelectProduct(product)}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded bg-[#001233]/90 text-white text-[10px] font-heading font-bold uppercase tracking-wider shadow-xs">
                          {product.categoryLabel}
                        </span>
                      </div>

                      {/* Origin Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs">
                        <MapPin className="w-3 h-3 text-[#FF8C00]" />
                        <span className="truncate max-w-[190px]">{product.origin}</span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="font-heading text-lg font-bold text-[#001233] group-hover:text-[#FF8C00] transition-colors cursor-pointer leading-snug"
                        >
                          {product.name}
                        </h3>
                        {product.scientificName && (
                          <p className="text-[11px] italic text-gray-500 mt-0.5 font-body">
                            {product.scientificName}
                          </p>
                        )}
                      </div>

                      <p className="text-gray-600 font-body text-xs leading-relaxed line-clamp-2">
                        {product.shortDescription}
                      </p>

                      {/* Key Export Specs Micro Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Scale className="w-3 h-3 text-[#2D5A27]" />
                          <span className="font-semibold text-gray-700">MOQ:</span>
                          <span className="truncate">{product.moq.split('(')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3 h-3 text-[#FF8C00]" />
                          <span className="font-semibold text-gray-700">Grade:</span>
                          <span className="truncate">{product.grade.split('(')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-5 pb-5 pt-3 flex items-center justify-between gap-3 border-t border-gray-100 bg-[#fdfdfd]">
                    <button
                      id={`learn-more-${product.id}`}
                      onClick={() => onSelectProduct(product)}
                      className="text-xs font-heading font-bold text-[#001233] hover:text-[#FF8C00] transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <span>DETAILS</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`add-rfq-${product.id}`}
                      onClick={() => onAddToCart(product)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                        added
                          ? 'bg-[#2D5A27] text-white'
                          : 'bg-[#001233] hover:bg-[#FF8C00] text-white'
                      }`}
                      title="Add to quotation basket"
                    >
                      {added ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>IN BASKET</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>ADD TO RFQ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

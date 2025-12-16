import React, { useState } from 'react';
import { PRODUCTS, FALLBACK_IMAGE } from '../constants';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, CreditCard, X, Loader2, CheckCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { saveOrder, saveUserProfile } from '../services/storage';

const Shop: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);
  const categories = ['All', 'Tableware', 'Decor', 'Tea Sets'];

  const filteredProducts = filter === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="pt-24 min-h-screen bg-stone-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-stone-800 mb-4">Collection</h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto">
            Small batch ceramics. Each piece is unique.
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-12 space-x-4 md:space-x-8 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`pb-2 text-sm uppercase tracking-widest transition-colors ${
                filter === cat 
                  ? 'border-b-2 border-terracotta text-stone-900' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onBuyNow={() => setBuyNowProduct(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-stone-400 font-serif text-xl">
            Currently out of stock in this category. The kiln is firing...
          </div>
        )}
      </div>

      {/* Buy Now Modal */}
      {buyNowProduct && (
        <BuyNowModal 
          product={buyNowProduct} 
          onClose={() => setBuyNowProduct(null)} 
        />
      )}
    </div>
  );
};

const ProductCard: React.FC<{ product: Product, onBuyNow: () => void }> = ({ product, onBuyNow }) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMAGE) {
        setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className="group flex flex-col h-full">
      <div className="relative aspect-square w-full overflow-hidden bg-stone-200 mb-4">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 animate-pulse z-10">
            <ImageIcon className="text-stone-300" size={48} strokeWidth={1} />
          </div>
        )}

        <img
          src={imgSrc}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={handleError}
          className={`h-full w-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {!product.inStock && (
          <div className="absolute top-2 right-2 z-20 bg-stone-800 text-white text-xs px-2 py-1 uppercase tracking-wider">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-serif text-xl text-stone-900">{product.name}</h3>
          <p className="text-sm text-stone-500 font-light line-clamp-2 mt-1">{product.description}</p>
        </div>
        <p className="font-medium text-stone-700 shrink-0 ml-4">₹{product.price}</p>
      </div>

      <div className="mt-auto pt-4 flex gap-3">
        {product.inStock ? (
            <>
                <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-white border border-stone-300 text-stone-800 px-4 py-3 uppercase tracking-widest text-xs hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
                >
                <ShoppingBag size={14} /> Add to Cart
                </button>
                <button 
                onClick={onBuyNow}
                className="flex-1 bg-stone-900 text-white px-4 py-3 uppercase tracking-widest text-xs hover:bg-terracotta transition-colors flex items-center justify-center gap-2"
                >
                <CreditCard size={14} /> Buy Now
                </button>
            </>
        ) : (
             <button disabled className="w-full bg-stone-200 text-stone-400 px-4 py-3 uppercase tracking-widest text-xs cursor-not-allowed">
                Out of Stock
             </button>
        )}
      </div>
    </div>
  );
};

const BuyNowModal: React.FC<{ product: Product, onClose: () => void }> = ({ product, onClose }) => {
    const [step, setStep] = useState<'summary' | 'processing' | 'success'>('summary');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });
    const [orderId, setOrderId] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    const handleConfirm = () => {
        if (!formData.email || !formData.address || !formData.name) {
            alert("Please enter your name, email and shipping address to proceed.");
            return;
        }

        setStep('processing');
        
        setTimeout(() => {
            const newOrderId = `BSH-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
            const estDate = new Date();
            estDate.setDate(estDate.getDate() + 7); // 7 days delivery
            const dateStr = estDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

            setOrderId(newOrderId);
            setDeliveryDate(dateStr);

            window.open('https://razorpay.com/demo-link', '_blank'); 
            
            saveUserProfile({ name: formData.name, email: formData.email });
            saveOrder({
                id: newOrderId,
                date: new Date().toLocaleDateString(),
                items: [{ name: product.name, price: product.price, quantity: 1 }],
                total: product.price
            });

            setStep('success');
        }, 1500);
    };

    if (step === 'success') {
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white p-8 max-w-sm w-full text-center shadow-xl animate-fade-in rounded-sm">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h3 className="font-serif text-2xl text-stone-800 mb-2">Order Placed!</h3>
                    <p className="text-stone-500 mb-6 text-sm">
                        Payment confirmed. A confirmation email has been sent to <strong>{formData.email}</strong>.
                    </p>
                    <div className="bg-stone-50 p-4 mb-4 text-left border border-stone-100 space-y-3 rounded-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase text-stone-400 tracking-wider">Order ID</span>
                            <span className="font-mono text-stone-800 font-medium text-sm">{orderId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-[10px] uppercase text-stone-400 tracking-wider">Est. Delivery</span>
                             <span className="text-stone-800 font-medium text-sm">{deliveryDate}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-full bg-stone-900 text-white py-3 uppercase tracking-widest text-sm hover:bg-terracotta transition-colors">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white max-w-md w-full shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-stone-100">
                    <h3 className="font-serif text-xl text-stone-800">Express Checkout</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="flex gap-4 mb-6">
                        <div className="w-20 h-20 bg-stone-200 shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-serif text-lg text-stone-800">{product.name}</h4>
                            <p className="text-terracotta font-medium mt-1">₹{product.price}</p>
                            <p className="text-xs text-stone-500 mt-2">Qty: 1</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-stone-500">Full Name <span className="text-red-400">*</span></label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Your Name" 
                                className="w-full p-3 border border-stone-200 rounded-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none" 
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-stone-500">Email Address <span className="text-red-400">*</span></label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="you@example.com" 
                                className="w-full p-3 border border-stone-200 rounded-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-stone-500">Shipping Address <span className="text-red-400">*</span></label>
                            <textarea 
                                rows={2} 
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="Full address..." 
                                className="w-full p-3 border border-stone-200 rounded-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none resize-none" 
                            />
                        </div>
                    </div>

                    <div className="mt-8 border-t border-stone-100 pt-4 flex justify-between items-center">
                        <span className="text-stone-600">Total to Pay</span>
                        <span className="font-serif text-2xl text-stone-900">₹{product.price}</span>
                    </div>
                </div>

                <div className="p-6 border-t border-stone-100 bg-stone-50">
                    <button 
                        onClick={handleConfirm}
                        disabled={step === 'processing'}
                        className="w-full bg-stone-900 text-white py-4 flex items-center justify-center gap-2 hover:bg-terracotta transition-colors disabled:opacity-70"
                    >
                        {step === 'processing' ? (
                            <>
                                <Loader2 className="animate-spin" size={18} /> Redirecting...
                            </>
                        ) : (
                            <>
                                Pay Securely <ExternalLink size={18} />
                            </>
                        )}
                    </button>
                    <p className="text-[10px] text-center text-stone-400 mt-3">
                        Secure payment via Razorpay.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Shop;
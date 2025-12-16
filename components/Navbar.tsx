import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getUserProfile, logoutUser } from '../services/storage';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleCart, cartCount } = useCart();
  const [user, setUser] = useState(getUserProfile());

  // Re-check auth state on location change (in case of login/logout)
  useEffect(() => {
    setUser(getUserProfile());
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Workshops', path: '/workshops' },
    { name: 'Custom', path: '/custom' },
    { name: 'About', path: '/' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-stone-100/90 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center" title="Home">
            <span className="font-serif text-3xl text-stone-900 tracking-tight font-light">Bashō.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-sans text-sm tracking-widest uppercase hover:text-terracotta transition-colors ${isActive(link.path) ? 'text-terracotta font-medium' : 'text-stone-600'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Icons Group */}
            <div className="flex items-center space-x-6 border-l border-stone-300 pl-6 ml-4">
                {user ? (
                   <div className="flex items-center space-x-4">
                       <Link to="/dashboard" className="text-stone-800 hover:text-terracotta transition-colors flex items-center gap-2" title="View Dashboard">
                          <User size={20} />
                          <span className="text-xs uppercase tracking-widest hidden lg:inline">{user.name.split(' ')[0]}</span>
                       </Link>
                       <button onClick={handleLogout} className="text-stone-400 hover:text-stone-800 transition-colors" title="Logout">
                          <LogOut size={18} />
                       </button>
                   </div>
                ) : (
                    <Link to="/login" className="text-stone-800 hover:text-terracotta transition-colors text-xs uppercase tracking-widest font-medium" title="Login">
                        Login
                    </Link>
                )}
                
                <button 
                  onClick={toggleCart}
                  className="text-stone-800 hover:text-terracotta transition-colors relative"
                  title="View Cart"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {user ? (
                 <Link to="/dashboard" className="text-stone-800" title="View Dashboard">
                    <User size={20} />
                 </Link>
             ) : (
                <Link to="/login" className="text-stone-800 font-bold text-xs uppercase" title="Login">
                    Login
                </Link>
             )}
             
             <button onClick={toggleCart} className="text-stone-800 relative" title="View Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-800 hover:text-terracotta focus:outline-none"
              title={isOpen ? "Close Menu" : "Open Menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-center font-serif text-xl text-stone-700 hover:text-terracotta hover:bg-stone-100"
              >
                {link.name}
              </Link>
            ))}
             {user ? (
                 <>
                    <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-4 text-center font-serif text-xl text-stone-700 hover:text-terracotta hover:bg-stone-100 border-t border-stone-200"
                    >
                        My Dashboard
                    </Link>
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                        }}
                        className="w-full block px-3 py-4 text-center font-serif text-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 border-t border-stone-200"
                    >
                        Sign Out
                    </button>
                 </>
             ) : (
                 <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-center font-serif text-xl text-stone-700 hover:text-terracotta hover:bg-stone-100 border-t border-stone-200"
                >
                    Login / Register
                </Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
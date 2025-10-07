import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'light' : 'dark');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="header-glow"></div>
        <div className="container">
          <div className="header-inner">
            <Link to="/" className="logo" onClick={closeMobileMenu}>
              <div className="logo-wrapper">
                <img src="/assets/images/logo_inesic.png" alt="INESIC Logo" className="logo-image" />
                <div className="logo-shine"></div>
              </div>
            </Link>
            
            <nav className="nav-menu">
              {[
                { path: '/', label: 'Accueil' },
                { path: '/about', label: 'Qui sommes-nous' },
                { path: '/expertise', label: 'Nos expertises' },
                { path: '/sakkanal', label: 'Sakkanal', isSpecial: true },
                { path: '/why-us', label: 'Pourquoi nous' },
                { path: '/contact', label: 'Contact' }
              ].map((item) => (
                <div key={item.path} className={`nav-item ${item.isSpecial ? 'sakkanal-special' : ''}`}>
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <span className="nav-link-text">{item.label}</span>
                    <span className="nav-link-bg"></span>
                    {item.isSpecial && (
                      <>
                        <span className="promo-badge">-32%.</span>
                        <span className="promo-tooltip">
                          <span className="lightning">⚡</span>
                          Économisez 40% sur votre facture
                        </span>
                      </>
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="header-actions">
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                <span className="theme-icon-wrapper">
                  <i className={`fas fa-${isDarkTheme ? 'sun' : 'moon'}`}></i>
                </span>
              </button>
              <button 
                className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`} 
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            <img src="/assets/images/logo_inesic.png" alt="INESIC Logo" />
          </div>
          <button className="mobile-menu-close" onClick={closeMobileMenu} aria-label="Close menu">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <ul className="mobile-menu-list">
          {[
            { path: '/', label: 'Accueil', icon: 'home' },
            { path: '/about', label: 'Qui sommes-nous', icon: 'users' },
            { path: '/expertise', label: 'Nos expertises', icon: 'briefcase' },
            { path: '/sakkanal', label: 'Sakkanal', icon: 'star', isSpecial: true },
            { path: '/why-us', label: 'Pourquoi nous', icon: 'award' },
            { path: '/contact', label: 'Contact', icon: 'envelope' }
          ].map((item, index) => (
            <li 
              key={item.path} 
              className="mobile-menu-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link 
                to={item.path} 
                className={`mobile-menu-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <i className={`fas fa-${item.icon}`}></i>
                <span>{item.label}</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-footer">
          <button className="theme-toggle-mobile" onClick={toggleTheme}>
            <i className={`fas fa-${isDarkTheme ? 'sun' : 'moon'}`}></i>
            <span>{isDarkTheme ? 'Mode clair' : 'Mode sombre'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
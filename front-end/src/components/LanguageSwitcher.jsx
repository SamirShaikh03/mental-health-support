import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeout = useRef(null);
  const switcherRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const clearHoverTimeout = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const handleLanguageChange = (languageCode) => {
    clearHoverTimeout();
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Update document direction for RTL languages
    if (languageCode === 'ur') {
      document.dir = 'rtl';
      document.documentElement.lang = languageCode;
    } else {
      document.dir = 'ltr';
      document.documentElement.lang = languageCode;
    }
  };

  const openDropdown = () => {
    clearHoverTimeout();
    setIsOpen(true);
  };

  const scheduleClose = (event) => {
    const nextTarget = event?.relatedTarget;
    const isNode = typeof Node !== 'undefined' && nextTarget instanceof Node;
    if (isNode && switcherRef.current?.contains(nextTarget)) {
      return;
    }
    clearHoverTimeout();
    hoverTimeout.current = setTimeout(() => setIsOpen(false), 220);
  };

  useEffect(() => {
    return () => clearHoverTimeout();
  }, []);

  return (
    <div 
      className="language-switcher"
      ref={switcherRef}
      onMouseEnter={openDropdown}
      onMouseLeave={scheduleClose}
    >
      <button 
        className="language-toggle"
        onClick={() => {
          clearHoverTimeout();
          setIsOpen((prev) => !prev);
        }}
        aria-label="Switch Language"
      >
        <FontAwesomeIcon icon={faGlobe} />
        <span className="current-language">{currentLanguage.nativeName}</span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div 
          className="language-dropdown"
          onMouseEnter={openDropdown}
          onMouseLeave={scheduleClose}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="language-native">{language.nativeName}</span>
              <span className="language-english">({language.name})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
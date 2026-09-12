import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import i18n, { SUPPORTED_LANGUAGES, LANGUAGE_STORAGE_KEY } from '../i18n/config';

export default function LanguageSelector({ variant = 'navbar', className = '' }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangCode = (i18n.language || 'en').split('-')[0];
  const currentLanguage =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLangCode) ||
    SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown' && !isOpen) {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  if (variant === 'select') {
    return (
      <div className={`language-selector-wrapper ${className}`}> 
        <label htmlFor="swasth-lang-select" className="language-selector-screen-reader">
          {t('common.language')}
        </label>
        <div className="language-selector-select-wrap">
          <Globe className="language-selector-icon" aria-hidden="true" />
          <select
            id="swasth-lang-select"
            value={currentLangCode}
            onChange={(event) => handleLanguageChange(event.target.value)}
            className="language-selector-select"
            aria-label={t('common.language')}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className={`language-selector ${className}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsOpen(false);
      }}
    >
      <button
        type="button"
        id="language-selector-button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${t('common.language')}: ${currentLanguage.nativeName}`}
        className="language-selector-button"
      >
        <Globe className="language-selector-button-icon" aria-hidden="true" />
        <span className="language-selector-label">{currentLanguage.nativeName}</span>
        <ChevronDown
          className={`language-selector-chevron ${isOpen ? 'language-selector-chevron-open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-selector-button"
          className="language-selector-dropdown"
        >
          <div className="language-selector-dropdown-title">
            {t('common.language')}
          </div>

          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => handleLanguageChange(lang.code)}
                className={`language-selector-option ${isSelected ? 'language-selector-option-selected' : ''}`}
              >
                <span className="language-selector-option-name">{lang.nativeName}</span>
                <span className="language-selector-option-code">{lang.name}</span>
                {isSelected && (
                  <Check className="language-selector-check" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Globe2 } from 'lucide-react';
import i18n, { SUPPORTED_LANGUAGES, LANGUAGE_STORAGE_KEY, LEGACY_LANGUAGE_STORAGE_KEY } from '../i18n/config';

function LanguageSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleContinue = () => {
    if (!selectedLanguage) {
      return;
    }

    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    localStorage.setItem(LEGACY_LANGUAGE_STORAGE_KEY, selectedLanguage);

    navigate('/home');
  };

  return (
    <div className="language-selection-page">
      <div className="language-selection-shell">
        <header className="language-selection-brand" aria-label={t('common.brand')}>
          <span className="brand-mark">S</span>
          <span className="brand-word">{t('common.brand')}</span>
        </header>

        <section className="language-selection-card">
          <div className="language-selection-heading">
            <div className="language-selection-icon-wrap">
              <Globe2 className="language-selection-icon" size={36} />
            </div>
            <h1>{t('languageSelection.title')}</h1>
            <p className="language-selection-subtitle">
              {t('languageSelection.subtitle')}
            </p>
          </div>

          <div className="language-options-grid">
            {SUPPORTED_LANGUAGES.map((language) => {
              const isSelected = selectedLanguage === language.code;

              return (
                <button
                  type="button"
                  key={language.code}
                  className={`language-option-card ${isSelected ? 'language-option-card-selected' : ''}`}
                  onClick={() => setSelectedLanguage(language.code)}
                  aria-pressed={isSelected}
                  aria-label={language.name}
                >
                  <span className="language-option-row">
                    <span className="language-option-main">
                      <span className="language-option-icon">
                        <Globe2 size={24} aria-hidden="true" />
                      </span>
                      <span className="language-option-text">
                        <span className="language-option-native">{language.nativeName}</span>
                        <span className="language-option-english">{language.name}</span>
                      </span>
                    </span>

                    {isSelected && (
                      <span className="language-option-check">
                        <Check size={20} aria-hidden="true" />
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="primary-button language-continue-button"
            disabled={!selectedLanguage}
            onClick={handleContinue}
          >
            <span>{t('languageSelection.continue')}</span>
            <ArrowRight size={18} />
          </button>
        </section>
      </div>
    </div>
  );
}

export default LanguageSelection;

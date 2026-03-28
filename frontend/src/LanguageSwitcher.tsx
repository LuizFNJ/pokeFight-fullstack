import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 rounded font-semibold transition-colors ${
          i18n.language === 'en'
            ? 'bg-yellow-500 text-black'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        🇺🇸 English
      </button>
      <button
        onClick={() => changeLanguage('pt')}
        className={`px-4 py-2 rounded font-semibold transition-colors ${
          i18n.language === 'pt'
            ? 'bg-yellow-500 text-black'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        🇧🇷 Português
      </button>
    </div>
  );
}

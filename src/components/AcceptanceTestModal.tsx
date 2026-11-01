
import React from 'react';

interface AcceptanceTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: string;
}

export const AcceptanceTestModal: React.FC<AcceptanceTestModalProps> = ({
  isOpen,
  onClose,
  uiLang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {uiLang === 'hi' ? 'स्वीकृति परीक्षण' : 'Acceptance Test'}
        </h2>

        <p className="mb-6 text-gray-700">
          {uiLang === 'hi'
            ? 'कृपया आगे बढ़ने से पहले अपनी जानकारी की जाँच करें।'
            : 'Please review your information before proceeding.'}
        </p>

        <button
          onClick={onClose}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          {uiLang === 'hi' ? 'बंद करें' : 'Close'}
        </button>
      </div>
    </div>
  );
};

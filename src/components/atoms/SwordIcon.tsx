import React from 'react';

interface SwordIconProps {
  onClick?: () => void;
  className?: string;
}

export const SwordIcon: React.FC<SwordIconProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${className}`}
      title="編成情報"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-600"
      >
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
        <path d="M13 19l6-6" />
        <path d="M16 16l4 4" />
        <path d="M19 21l2-2" />
      </svg>
    </button>
  );
};

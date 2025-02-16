import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  message: string;
  duration?: number;
}

export function NotificationBar({ message, duration = 5000 }: Props) {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-6 py-2 rounded-md shadow-md text-center transition-all duration-500 ease-in-out z-[100]">
      {t(message)}
    </div>
  );
}

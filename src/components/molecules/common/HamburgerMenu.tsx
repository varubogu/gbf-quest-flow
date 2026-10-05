import * as React from 'react';
import { Menu } from 'lucide-react';
import { IconButton } from '../../atoms/common/IconButton';

interface HamburgerMenuProps {
  onClick: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onClick }) => {
  return (
    <IconButton
      icon={Menu}
      label="メニューを開く"
      variant="default"
      className="min-h-11 min-w-11 sm:min-h-9 sm:min-w-9 bg-primary text-primary-foreground"
      onClick={onClick}
    />
  );
};

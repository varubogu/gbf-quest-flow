import * as React from 'react';
import { Menu } from 'lucide-react';
import { IconButton } from '../atoms/common/IconButton';

interface HamburgerMenuProps {
  onClick: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onClick }) => {
  return <IconButton icon={Menu} label="メニューを開く" variant="ghost" onClick={onClick} />;
};

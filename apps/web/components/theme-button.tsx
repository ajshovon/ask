'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { PiMoonDuotone, PiSunDimDuotone } from 'react-icons/pi';

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <Button variant="ghost" size="icon" onClick={handleToggleTheme} className="relative md:size-9 size-8 hover:bg-[#f1f5f9] dark:hover:bg-[#334155] hover:text-primary text-accent-500 dark:text-accent-800 rounded-full">
      <PiSunDimDuotone className="md:!size-5 !size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <PiMoonDuotone className="absolute md:!size-5 !size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};

export default ThemeButton;

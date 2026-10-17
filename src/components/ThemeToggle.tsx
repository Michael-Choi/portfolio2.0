import { MoonIcon, SunIcon } from '@/components/Icons';
import { useTheme } from '@/useTheme';

/** A button that switches between the light and dark themes. */
export const ThemeToggle = () => {
  const [theme, toggle] = useTheme();
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="-mr-2 -mt-1.5 grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink"
    >
      {theme === 'dark' ? <SunIcon className="size-[18px]" /> : <MoonIcon className="size-[18px]" />}
    </button>
  );
};

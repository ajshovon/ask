import { MessageSquare, Settings } from 'lucide-react';
import Link from 'next/link';
import ThemeButton from './theme-button';

export default function BottomNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex w-full items-center justify-between bg-white px-4 py-4  shadow-sm dark:bg-[#080808] sm:px-6 md:px-8 lg:px-10">
        <Link href="/" className="flex items-center" prefetch={false}>
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">.ask</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <Link href="/messages" className="hover:underline hover:underline-offset-4" prefetch={false}>
            Messages
          </Link>
          <Link href="/settings" className="hover:underline hover:underline-offset-4" prefetch={false}>
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeButton />
        </div>
        <div className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-around bg-white py-3 shadow-t dark:bg-[#080808] lg:hidden">
          <Link href="/messages" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" prefetch={false}>
            <MessageSquare className="h-6 w-6" />
            Messages
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" prefetch={false}>
            <Settings className="h-6 w-6" />
            Settings
          </Link>
        </div>
      </header>
      <div> {children}</div>
    </>
  );
}

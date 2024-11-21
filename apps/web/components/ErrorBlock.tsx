'use client';
import Image from 'next/image';
import Link from 'next/link';
import { BsRobot } from 'react-icons/bs';
import { TbSmartHome } from 'react-icons/tb';
import FullScreenToggle from './FullScreenToggle';
import ThemeButton from './theme-button';

function Navbar() {
  return (
    <div>
      <nav className="max-w-7xl mx-auto px-5 mt-5">
        <div className="bg-card flex justify-between items-center w-full px-8 py-4 rounded-lg shadow-md border border-default">
          <Link href="/">
            <Image src="/favicon-96x96.png" height={60} width={60} alt=".ask" />
          </Link>
          <div className="flex items-center gap-2">
            <FullScreenToggle />
            <ThemeButton />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function ErrorBlock() {
  return (
    <div className="h-svh w-full flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Error Block */}
      <div className="flex-grow flex flex-col gap-8 justify-center items-center dark:text-[#a9a9b3] text-[#222222]">
        <BsRobot className="text-3xl" />
        <h1 className="font-bold md:text-5xl text-4xl">404</h1>
        <div className="text-center">
          <p>Oops, page not found…</p>
          <Link href="/" className="flex items-center gap-1 justify-center mt-4">
            <TbSmartHome className="text-xl" />
            <span className="hover:underline">Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

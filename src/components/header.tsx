"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header>
      <Link href="/">
        <span className="text-2xl font-bold">T</span>
        <span className="bg-primary h-1 w-1 rounded-full"></span>
      </Link>
    </header>
  );
};

export default Header;

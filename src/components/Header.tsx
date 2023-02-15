import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

import ColorThemeBtn from "./ColorThemeBtn";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-row justify-between items-center mx-auto py-2 px-2 md:w-[1000px]">
      <div className="flex flex-row items-center gap-2">
        <Link href={"/"}>
          <p className="font-catamaran font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300">
            NOODLE
          </p>
        </Link>
        <div className="flex flex-row gap-2">
          <ColorThemeBtn
            onClick={() =>
              theme == "dark" ? setTheme("light") : setTheme("dark")
            }
          />
        </div>
        <p>Search</p>
      </div>
      <SignInButton />
    </div>
  );
}

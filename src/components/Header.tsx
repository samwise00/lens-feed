import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

export default function Header() {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Link href={"/"}>
            <p className="font-catamaran font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300">
              NOODLE
            </p>
          </Link>
          <Link href={"/create"}>
            <p>+</p>
          </Link>
        </div>
        <SignInButton />
      </div>
      <div />
    </>
  );
}

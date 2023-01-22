import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

export default function Header() {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Link href={"/"}>
            <p>Home</p>
          </Link>
          <Link href={"/create"}>
            <p>Create</p>
          </Link>
        </div>
        <SignInButton />
      </div>
      <div />
    </>
  );
}

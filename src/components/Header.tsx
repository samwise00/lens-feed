import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

export default function Header() {
  return (
    <>
      <div>
        <div>
          <Link href={"/"}>
            <p>Home</p>
          </Link>
        </div>

        <div>
          <SignInButton />
        </div>
      </div>
      <div />
    </>
  );
}

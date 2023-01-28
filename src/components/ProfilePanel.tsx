import React from "react";
import Link from "next/link";
import { MediaRenderer } from "@thirdweb-dev/react";

type Props = {
  profileData: any;
};

export default function ProfilePanel({ profileData }: Props) {
  console.log(profileData);

  return (
    <div className="flex flex-col justify-center w-screen bg-white dark:bg-[#1e1e1e] rounded-2xl drop-shadow-lg p-4 md:max-w-[250px] gap-3 mb-4">
      <div className="flex flex-row gap-4">
        {/* Author Profile Picture */}
        <MediaRenderer
          // @ts-ignore - the type does exist
          src={profileData?.profile?.picture?.original?.url || "/logo.png"}
          alt={profileData.profile.name || profileData.profile.handle}
          className="h-[50px] w-[50px] rounded-lg"
        />
        {/* Author profile name */}
        <div className="flex flex-col">
          <Link
            href={`/profile/${profileData.profile.handle}`}
            className="font-bold text-xl"
          >
            {profileData.profile?.name}
          </Link>
          <p className="text-sm text-slate-400">
            @{profileData.profile?.handle}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between text-xs">
        <div className="flex flex-row">
          <p>Posts</p>
          <p>13</p>
        </div>
        <div className="flex flex-row">
          <p>|</p>
        </div>
        <div className="flex flex-row">
          <p>Followers</p>
          <p>1456</p>
        </div>
      </div>
      <div className="flex justify-center items-center border-2 rounded-lg text-xs py-2">
        View Profile
      </div>
      <div className="text-xs">Settings</div>
    </div>
  );
}

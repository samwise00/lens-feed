import React from "react";
import Link from "next/link";
import { MediaRenderer, useAddress } from "@thirdweb-dev/react";

import { useRecommendedProfilesQuery } from "../graphql/generated";

type Props = {
  profileData: any;
};

export default function Footer({ profileData }: Props) {
  const {
    isLoading: loadingRecommendedProfiles,
    data: recommendedProfilesData,
    error: recommendedProfilesError,
  } = useRecommendedProfilesQuery();

  console.log(`recommended profiles: ${recommendedProfilesData}`);

  return (
    <div className="flex flex-col justify-center p-1 md:max-w-[250px] gap-2 text-slate-500 dark:text-slate-300">
      <div className="flex flex-row justify-start gap-2">
        <p className="text-xs">About</p>
        <p className="text-xs">Help</p>
        <p className="text-xs">Privacy</p>
        <p className="text-xs">Terms</p>
        <p className="text-xs">Locations</p>
      </div>

      <div className="flex flex-row justify-start gap-2">
        <p className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300">
          NOODLE
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          Copyright @2023
        </p>
      </div>
    </div>
  );
}

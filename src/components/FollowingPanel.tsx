import React from "react";
import Link from "next/link";
import { MediaRenderer, useAddress } from "@thirdweb-dev/react";

import { useFollowingQuery } from "../graphql/generated";

type Props = {
  profileData: any;
};

export default function FollowingPanel({ profileData }: Props) {
  const address = useAddress();
  const {
    isLoading: loadingfollowers,
    data: followingData,
    error: followingError,
  } = useFollowingQuery(
    {
      request: {
        address: address,
        limit: 10,
      },
    },
    {
      enabled: !!profileData?.profile?.id,
    }
  );

  console.log(followingData);

  return (
    <div className="flex flex-col justify-center w-screen bg-white dark:bg-[#1e1e1e] rounded-2xl drop-shadow-lg p-4 md:max-w-[250px] gap-3">
      <div className="flex flex-row justify-between pb-4">
        <div className="text-sm">Following</div>
        <div className="text-sm">See all</div>
      </div>
      {followingData &&
        followingData?.following.items.map((follower: any) => {
          return (
            <div className="flex flex-row gap-4">
              {/* Author Profile Picture */}
              <MediaRenderer
                // @ts-ignore - the type does exist
                src={follower?.profile?.picture?.original?.url || "/logo.png"}
                alt={follower?.profile?.name || follower?.profile?.handle}
                className="h-[40px] w-[40px] rounded-lg"
              />
              {/* Author profile name */}
              <div className="flex flex-col">
                <Link
                  href={`/profile/${follower?.wallet?.defaultProfile?.handle}`}
                  className="font-bold text-sm"
                >
                  {follower?.profile?.name}
                </Link>
                <p className="text-xs text-slate-400">
                  @{follower?.profile?.handle}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { MediaRenderer, useAddress } from "@thirdweb-dev/react";

import RecommendedModal from "../components/RecommendedModal";

import { useRecommendedProfilesQuery } from "../graphql/generated";
import { useDisclosure } from "@chakra-ui/react";

type Props = {
  profileData: any;
};

export default function FollowingPanel({ profileData }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useAddress();
  const {
    isLoading: loadingRecommendedProfiles,
    data: recommendedProfilesData,
    error: recommendedProfilesError,
  } = useRecommendedProfilesQuery();

  console.log(`recommended profiles: ${recommendedProfilesData}`);

  return (
    <div>
      <div className="flex flex-col justify-center w-screen bg-white dark:bg-[#1e1e1e] rounded-2xl drop-shadow-lg p-4 md:max-w-[250px] gap-3">
        <div className="flex flex-row justify-between pb-4">
          <div className="text-sm">Recommended For You</div>
          <button className="text-sm" onClick={onOpen}>
            See all
          </button>
        </div>
        {recommendedProfilesData &&
          recommendedProfilesData?.recommendedProfiles?.map(
            (profile: any, index: number) => {
              if (index < 7) {
                return (
                  <div className="flex flex-row gap-4">
                    {/* Author Profile Picture */}
                    <MediaRenderer
                      // @ts-ignore - the type does exist
                      src={profile?.picture?.original?.url || "/logo.png"}
                      alt={profile?.name || profile.handle}
                      className="h-[40px] w-[40px] rounded-lg"
                    />
                    {/* Author profile name */}
                    <div className="flex flex-col">
                      <Link
                        href={`/profile/${profile?.handle}`}
                        className="font-bold text-sm"
                      >
                        {profile?.name}
                      </Link>
                      <p className="text-xs text-slate-400">
                        @{profile?.handle}
                      </p>
                    </div>
                  </div>
                );
              }
            }
          )}
      </div>
      <RecommendedModal
        isOpen={isOpen}
        onClose={onClose}
        recommendedProfilesData={recommendedProfilesData}
      />
    </div>
  );
}
